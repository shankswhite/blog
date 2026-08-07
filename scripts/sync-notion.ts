import { createHash } from "node:crypto";
import {
  access,
  mkdir,
  readFile,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { loadEnvFile } from "node:process";
import { fileURLToPath } from "node:url";
import {
  Client,
  isFullDataSource,
  isFullPage,
  type DataSourceObjectResponse,
  type PageObjectResponse,
  type QueryDataSourceParameters,
} from "@notionhq/client";
import { GetParameterCommand, SSMClient } from "@aws-sdk/client-ssm";
import {
  CONTENT_CACHE_SCHEMA_VERSION,
  NOTION_API_VERSION,
  isProjectAccent,
  type NotionContentCache,
  type NotionContentItem,
  type ProjectAccent,
} from "../src/types/content";
import {
  mediaExtensionForContentType,
  parseTemporaryNotionMediaUrl,
} from "../src/lib/notion-media";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, "..");
const cacheDirectory = path.join(projectRoot, ".notion-cache");
const cachePath = path.join(cacheDirectory, "content.json");
const publicDirectory = path.join(projectRoot, "public");
const generatedMediaDirectory = path.join(publicDirectory, "notion-generated");
const generatedMediaStageDirectory = path.join(
  publicDirectory,
  `.notion-generated-stage-${process.pid}`
);
const generatedMediaBackupDirectory = path.join(
  publicDirectory,
  `.notion-generated-backup-${process.pid}`
);

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const NOTION_REQUEST_INTERVAL_MS = 350;
const MAX_MEDIA_BYTES = 50 * 1024 * 1024;
const MAX_TOTAL_MEDIA_BYTES = 150 * 1024 * 1024;
const MAX_MEDIA_REDIRECTS = 3;

type DataSourceProperty = DataSourceObjectResponse["properties"][string];
type PageProperty = PageObjectResponse["properties"][string];
type PublicationConfig =
  | { property: "Published"; type: "checkbox" }
  | { property: "Status"; type: "status" | "select" };

type SchemaConfig = {
  publication: PublicationConfig;
  coverProperty?: "Cover URL" | "Image";
};

type MediaSnapshotContext = {
  downloadedBySource: Map<string, string>;
  totalBytes: number;
};

let nextNotionRequestAt = 0;

async function pathExists(targetPath: string): Promise<boolean> {
  try {
    await access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function loadLocalEnvironment() {
  const localEnvironmentPath = path.join(projectRoot, ".env.local");
  if (await pathExists(localEnvironmentPath)) {
    loadEnvFile(localEnvironmentPath);
  }
}

async function readSecureParameter(name: string): Promise<string> {
  const response = await new SSMClient({}).send(
    new GetParameterCommand({ Name: name, WithDecryption: true })
  );
  const value = response.Parameter?.Value?.trim();
  if (!value) {
    throw new Error(`SSM parameter "${name}" is empty or unavailable.`);
  }
  return value;
}

async function readConfiguration() {
  const inlineApiKey = process.env.NOTION_API_KEY?.trim();
  const apiKeyParameter = process.env.NOTION_API_KEY_SSM_PATH?.trim();
  const dataSourceId = (
    process.env.NOTION_CONTENT_DATA_SOURCE_ID ??
    process.env.NOTION_DATA_SOURCE_ID
  )?.trim();

  if (!inlineApiKey && !apiKeyParameter && !dataSourceId) {
    return { configured: false as const };
  }

  if ((!inlineApiKey && !apiKeyParameter) || !dataSourceId) {
    throw new Error(
      "Notion is partially configured. Set NOTION_DATA_SOURCE_ID (or " +
        "NOTION_CONTENT_DATA_SOURCE_ID) and either NOTION_API_KEY or " +
        "NOTION_API_KEY_SSM_PATH."
    );
  }

  const apiKey = apiKeyParameter
    ? await readSecureParameter(apiKeyParameter)
    : inlineApiKey!;
  return { configured: true as const, apiKey, dataSourceId };
}

async function withNotionThrottle<T>(request: () => Promise<T>): Promise<T> {
  const waitFor = Math.max(0, nextNotionRequestAt - Date.now());
  if (waitFor > 0) {
    await new Promise((resolve) => setTimeout(resolve, waitFor));
  }

  nextNotionRequestAt = Date.now() + NOTION_REQUEST_INTERVAL_MS;
  return request();
}

function requireProperty(
  dataSource: DataSourceObjectResponse,
  name: string,
  expectedTypes: readonly DataSourceProperty["type"][]
): DataSourceProperty {
  const property = dataSource.properties[name];
  if (!property) {
    throw new Error(`Notion schema is missing the required \"${name}\" property.`);
  }

  if (!expectedTypes.includes(property.type)) {
    throw new Error(
      `Notion property \"${name}\" must be ${expectedTypes.join(" or ")}; ` +
        `received ${property.type}.`
    );
  }

  return property;
}

function validateOptionalProperty(
  dataSource: DataSourceObjectResponse,
  name: string,
  expectedTypes: readonly DataSourceProperty["type"][]
) {
  const property = dataSource.properties[name];
  if (property && !expectedTypes.includes(property.type)) {
    throw new Error(
      `Optional Notion property \"${name}\" must be ${expectedTypes.join(" or ")}; ` +
        `received ${property.type}.`
    );
  }
}

function validateSchema(dataSource: DataSourceObjectResponse): SchemaConfig {
  requireProperty(dataSource, "Title", ["title"]);
  requireProperty(dataSource, "Type", ["select"]);
  requireProperty(dataSource, "Slug", ["rich_text"]);
  requireProperty(dataSource, "Description", ["rich_text"]);
  requireProperty(dataSource, "Date", ["date"]);
  requireProperty(dataSource, "Tags", ["multi_select"]);

  const typeProperty = dataSource.properties.Type;
  if (typeProperty.type !== "select") {
    throw new Error('Notion property "Type" must be a select.');
  }

  const typeOptions = new Set(typeProperty.select.options.map(({ name }) => name));
  for (const expectedType of ["Writing", "Project"]) {
    if (!typeOptions.has(expectedType)) {
      throw new Error(
        `Notion Type select must include an exact \"${expectedType}\" option.`
      );
    }
  }

  let publication: PublicationConfig;
  if (dataSource.properties.Published?.type === "checkbox") {
    publication = { property: "Published", type: "checkbox" };
  } else if (dataSource.properties.Status?.type === "status") {
    publication = { property: "Status", type: "status" };
  } else if (dataSource.properties.Status?.type === "select") {
    publication = { property: "Status", type: "select" };
  } else {
    throw new Error(
      'Notion schema requires either a "Published" checkbox or a "Status" ' +
        'status/select property with an exact "Published" value.'
    );
  }

  if (publication.property === "Status") {
    const statusProperty = dataSource.properties.Status;
    const options =
      statusProperty.type === "status"
        ? statusProperty.status.options
        : statusProperty.type === "select"
          ? statusProperty.select.options
          : [];

    if (!options.some(({ name }) => name === "Published")) {
      throw new Error(
        'Notion Status property must include an exact "Published" option.'
      );
    }
  }

  const optionalProperties: Array<
    [string, readonly DataSourceProperty["type"][]]
  > = [
    ["Cover URL", ["url"]],
    ["Image", ["url"]],
    ["Category", ["select", "rich_text"]],
    ["Year", ["rich_text", "number"]],
    ["Stack", ["multi_select"]],
    ["Accent", ["select"]],
    ["Featured", ["checkbox"]],
    ["Order", ["number"]],
    ["External URL", ["url"]],
    ["Action Label", ["rich_text"]],
  ];

  for (const [name, expectedTypes] of optionalProperties) {
    validateOptionalProperty(dataSource, name, expectedTypes);
  }

  return {
    publication,
    ...(dataSource.properties["Cover URL"]
      ? { coverProperty: "Cover URL" as const }
      : dataSource.properties.Image
        ? { coverProperty: "Image" as const }
        : {}),
  };
}

function publicationFilter(
  publication: PublicationConfig
): NonNullable<QueryDataSourceParameters["filter"]> {
  if (publication.property === "Published") {
    return {
      property: "Published",
      checkbox: { equals: true },
    };
  }

  if (publication.type === "status") {
    return {
      property: "Status",
      status: { equals: "Published" },
    };
  }

  return {
    property: "Status",
    select: { equals: "Published" },
  };
}

async function getPublishedPages(
  notion: Client,
  dataSourceId: string,
  publication: PublicationConfig
): Promise<PageObjectResponse[]> {
  const pages: PageObjectResponse[] = [];
  let cursor: string | undefined;

  do {
    const response = await withNotionThrottle(() =>
      notion.dataSources.query({
        data_source_id: dataSourceId,
        filter: publicationFilter(publication),
        sorts: [{ property: "Date", direction: "descending" }],
        page_size: 100,
        ...(cursor ? { start_cursor: cursor } : {}),
      })
    );

    for (const result of response.results) {
      if (!isFullPage(result)) {
        throw new Error(
          `Notion returned an incomplete or non-page result (${result.id}).`
        );
      }
      pages.push(result);
    }

    cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
  } while (cursor);

  return pages;
}

function richText(property: PageProperty | undefined, name: string): string {
  if (!property || (property.type !== "rich_text" && property.type !== "title")) {
    throw new Error(`Notion page property \"${name}\" has the wrong type.`);
  }

  const fragments =
    property.type === "rich_text" ? property.rich_text : property.title;
  return fragments.map(({ plain_text }) => plain_text).join("").trim();
}

function optionalRichText(property: PageProperty | undefined): string | undefined {
  if (!property) return undefined;
  if (property.type !== "rich_text") {
    throw new Error("Optional Notion rich-text property has the wrong type.");
  }
  return property.rich_text.map(({ plain_text }) => plain_text).join("").trim() || undefined;
}

function selectValue(property: PageProperty | undefined, name: string): string {
  if (!property || property.type !== "select" || !property.select) {
    throw new Error(`Notion page property \"${name}\" must have a selected value.`);
  }
  return property.select.name;
}

function optionalSelect(property: PageProperty | undefined): string | undefined {
  if (!property) return undefined;
  if (property.type !== "select") {
    throw new Error("Optional Notion select property has the wrong type.");
  }
  return property.select?.name;
}

function multiSelect(property: PageProperty | undefined, name: string): string[] {
  if (!property || property.type !== "multi_select") {
    throw new Error(`Notion page property \"${name}\" has the wrong type.`);
  }
  return property.multi_select.map(({ name: value }) => value);
}

function optionalMultiSelect(property: PageProperty | undefined): string[] {
  if (!property) return [];
  if (property.type !== "multi_select") {
    throw new Error("Optional Notion multi-select property has the wrong type.");
  }
  return property.multi_select.map(({ name }) => name);
}

function dateValue(property: PageProperty | undefined, name: string): string {
  if (!property || property.type !== "date" || !property.date?.start) {
    throw new Error(`Notion page property \"${name}\" must have a date.`);
  }

  if (Number.isNaN(Date.parse(property.date.start))) {
    throw new Error(`Notion page property \"${name}\" is not a valid date.`);
  }

  return property.date.start;
}

function optionalUrl(
  property: PageProperty | undefined,
  name: string
): string | undefined {
  if (!property) return undefined;
  if (property.type !== "url") {
    throw new Error(`Optional Notion URL property "${name}" has the wrong type.`);
  }
  const value = property.url?.trim();
  if (!value) return undefined;

  if (value.startsWith("/") && !value.startsWith("//") && !value.includes("\\")) {
    return value;
  }

  try {
    const url = new URL(value);
    if (url.protocol === "https:") return value;
  } catch {
    // The error below includes the property name, not the potentially secret URL.
  }

  throw new Error(
    `Notion URL property "${name}" must be HTTPS or a root-relative path.`
  );
}

function optionalCheckbox(property: PageProperty | undefined): boolean {
  if (!property) return false;
  if (property.type !== "checkbox") {
    throw new Error("Optional Notion checkbox property has the wrong type.");
  }
  return property.checkbox;
}

function optionalNumber(property: PageProperty | undefined): number | undefined {
  if (!property) return undefined;
  if (property.type !== "number") {
    throw new Error("Optional Notion number property has the wrong type.");
  }
  return property.number ?? undefined;
}

function projectYear(property: PageProperty | undefined, date: string): string {
  if (!property) return new Date(date).getUTCFullYear().toString();
  if (property.type === "rich_text") {
    return (
      property.rich_text.map(({ plain_text }) => plain_text).join("").trim() ||
      new Date(date).getUTCFullYear().toString()
    );
  }
  if (property.type === "number" && property.number !== null) {
    return property.number.toString();
  }
  throw new Error('Optional Notion property "Year" has the wrong value.');
}

function projectCategory(property: PageProperty | undefined): string {
  if (!property) return "Project";
  if (property.type === "select") return property.select?.name ?? "Project";
  if (property.type === "rich_text") {
    return (
      property.rich_text.map(({ plain_text }) => plain_text).join("").trim() ||
      "Project"
    );
  }
  throw new Error('Optional Notion property "Category" has the wrong value.');
}

function assertPublished(page: PageObjectResponse, publication: PublicationConfig) {
  const property = page.properties[publication.property];
  const isPublished =
    publication.property === "Published"
      ? property?.type === "checkbox" && property.checkbox
      : publication.type === "status"
        ? property?.type === "status" && property.status?.name === "Published"
        : property?.type === "select" && property.select?.name === "Published";

  if (!isPublished) {
    throw new Error(
      `Notion returned page ${page.id} without an explicit Published state.`
    );
  }
}

function sourceIdentity(url: URL): string {
  return `${url.origin}${url.pathname}`;
}

async function fetchTemporaryNotionMedia(sourceUrl: URL): Promise<Response> {
  let currentUrl = sourceUrl;

  for (let redirectCount = 0; ; redirectCount += 1) {
    const response = await fetch(currentUrl, {
      redirect: "manual",
      signal: AbortSignal.timeout(30_000),
    });

    if (![301, 302, 303, 307, 308].includes(response.status)) {
      return response;
    }

    if (redirectCount >= MAX_MEDIA_REDIRECTS) {
      await response.body?.cancel();
      throw new Error("Notion media exceeded the safe redirect limit.");
    }

    const location = response.headers.get("location");
    let nextUrl: URL | null = null;
    try {
      nextUrl = location
        ? parseTemporaryNotionMediaUrl(new URL(location, currentUrl).toString())
        : null;
    } catch {
      nextUrl = null;
    }
    await response.body?.cancel();

    if (!nextUrl) {
      throw new Error("Notion media redirected outside the trusted file hosts.");
    }
    currentUrl = nextUrl;
  }
}

async function readMediaWithLimit(
  response: Response,
  byteLimit: number,
  normalizedSource: string,
): Promise<Buffer> {
  if (!response.body) return Buffer.alloc(0);

  const reader = response.body.getReader();
  const chunks: Buffer[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      totalBytes += value.byteLength;
      if (totalBytes > byteLimit) {
        await reader.cancel();
        throw new Error(
          `Notion media exceeds its configured byte limit: ${normalizedSource}`,
        );
      }
      chunks.push(Buffer.from(value));
    }
  } finally {
    reader.releaseLock();
  }

  return Buffer.concat(chunks, totalBytes);
}

function extractUrlCandidates(markdown: string): string[] {
  const matches = markdown.match(/https?:\/\/[^\s<>"'`\\]+/g) ?? [];
  return Array.from(
    new Set(matches.map((value) => value.replace(/[)\]}.,;:!?]+$/g, "")))
  );
}

async function snapshotTemporaryMedia(
  sourceUrl: string,
  context: MediaSnapshotContext
): Promise<string> {
  const trustedSourceUrl = parseTemporaryNotionMediaUrl(sourceUrl);
  if (!trustedSourceUrl) return sourceUrl;

  const normalizedSource = sourceIdentity(trustedSourceUrl);
  const existing = context.downloadedBySource.get(normalizedSource);
  if (existing) return existing;

  const response = await fetchTemporaryNotionMedia(trustedSourceUrl);

  if (!response.ok) {
    throw new Error(
      `Failed to download Notion media (${response.status}) from ${normalizedSource}.`
    );
  }

  const remainingTotalBytes = MAX_TOTAL_MEDIA_BYTES - context.totalBytes;
  const currentByteLimit = Math.min(MAX_MEDIA_BYTES, remainingTotalBytes);
  if (currentByteLimit <= 0) {
    throw new Error(
      `Notion media exceeds the ${MAX_TOTAL_MEDIA_BYTES / 1024 / 1024} MB total limit.`,
    );
  }

  const declaredLength = Number(response.headers.get("content-length") ?? 0);
  if (declaredLength > currentByteLimit) {
    throw new Error(
      "Notion media exceeds its configured byte limit: " +
        normalizedSource
    );
  }

  const extension = mediaExtensionForContentType(
    response.headers.get("content-type"),
  );
  if (!extension) {
    throw new Error(
      `Notion media has a missing or unsafe content type: ${normalizedSource}`,
    );
  }

  const bytes = await readMediaWithLimit(
    response,
    currentByteLimit,
    normalizedSource,
  );

  context.totalBytes += bytes.byteLength;
  if (context.totalBytes > MAX_TOTAL_MEDIA_BYTES) {
    throw new Error(
      `Notion media exceeds the ${MAX_TOTAL_MEDIA_BYTES / 1024 / 1024} MB total limit.`
    );
  }

  const digest = createHash("sha256").update(normalizedSource).digest("hex").slice(0, 24);
  const filename = `${digest}${extension}`;
  const outputPath = path.join(generatedMediaStageDirectory, filename);
  const publicPath = `/notion-generated/${filename}`;

  await writeFile(outputPath, bytes);
  context.downloadedBySource.set(normalizedSource, publicPath);
  return publicPath;
}

async function rewriteTemporaryMedia(
  markdown: string,
  context: MediaSnapshotContext
): Promise<string> {
  let rewritten = markdown;

  for (const sourceUrl of extractUrlCandidates(markdown)) {
    if (!parseTemporaryNotionMediaUrl(sourceUrl)) continue;
    const localUrl = await snapshotTemporaryMedia(sourceUrl, context);
    rewritten = rewritten.split(sourceUrl).join(localUrl);
  }

  return rewritten;
}

async function buildContentItem(
  notion: Client,
  page: PageObjectResponse,
  schema: SchemaConfig,
  mediaContext: MediaSnapshotContext
): Promise<NotionContentItem> {
  assertPublished(page, schema.publication);

  const title = richText(page.properties.Title, "Title");
  const slug = richText(page.properties.Slug, "Slug");
  const description = richText(page.properties.Description, "Description");
  const type = selectValue(page.properties.Type, "Type");
  const date = dateValue(page.properties.Date, "Date");
  const tags = multiSelect(page.properties.Tags, "Tags");

  if (!title) throw new Error(`Notion page ${page.id} has an empty Title.`);
  if (!description) {
    throw new Error(`Notion page ${page.id} has an empty Description.`);
  }
  if (!SLUG_PATTERN.test(slug)) {
    throw new Error(
      `Notion page ${page.id} has invalid slug \"${slug}\". ` +
        "Use lowercase letters, numbers, and single hyphens only."
    );
  }
  if (type !== "Writing" && type !== "Project") {
    throw new Error(
      `Notion page ${page.id} has unsupported Type \"${type}\". ` +
        'Use exactly "Writing" or "Project".'
    );
  }

  const markdownResponse = await withNotionThrottle(() =>
    notion.pages.retrieveMarkdown({ page_id: page.id })
  );
  if (markdownResponse.truncated || markdownResponse.unknown_block_ids.length > 0) {
    throw new Error(
      `Notion page ${page.id} could not be exported completely. Unknown blocks: ` +
        (markdownResponse.unknown_block_ids.join(", ") || "truncated response")
    );
  }
  if (/<unknown(?:\s|\/|>)/i.test(markdownResponse.markdown)) {
    throw new Error(
      `Notion page ${page.id} contains a block unsupported by the Markdown API.`
    );
  }

  const markdown = await rewriteTemporaryMedia(
    markdownResponse.markdown,
    mediaContext
  );
  const rawCoverUrl = schema.coverProperty
    ? optionalUrl(page.properties[schema.coverProperty], schema.coverProperty)
    : undefined;
  const coverUrl = rawCoverUrl
    ? await snapshotTemporaryMedia(rawCoverUrl, mediaContext)
    : undefined;

  const base = {
    id: page.id,
    source: "notion" as const,
    slug,
    title,
    description,
    date,
    lastEditedAt: page.last_edited_time,
    tags,
    ...(coverUrl ? { coverUrl } : {}),
    markdown,
    notionUrl: page.url,
  };

  if (type === "Writing") {
    return { ...base, kind: "writing" };
  }

  const accentValue = optionalSelect(page.properties.Accent) ?? "slate";
  if (!isProjectAccent(accentValue)) {
    throw new Error(
      `Notion project ${page.id} has unsupported Accent \"${accentValue}\".`
    );
  }

  const category = projectCategory(page.properties.Category);
  const order = optionalNumber(page.properties.Order);
  const externalUrl = optionalUrl(
    page.properties["External URL"],
    "External URL"
  );
  const actionLabel = optionalRichText(page.properties["Action Label"]);

  return {
    ...base,
    kind: "project",
    category,
    year: projectYear(page.properties.Year, date),
    stack: optionalMultiSelect(page.properties.Stack),
    accent: accentValue as ProjectAccent,
    featured: optionalCheckbox(page.properties.Featured),
    ...(order !== undefined ? { order } : {}),
    ...(externalUrl ? { externalUrl } : {}),
    ...(actionLabel ? { actionLabel } : {}),
  };
}

function sortContent(items: NotionContentItem[]): NotionContentItem[] {
  return [...items].sort((left, right) => {
    if (left.kind !== right.kind) return left.kind.localeCompare(right.kind);
    if (left.kind === "project" && right.kind === "project") {
      const orderDifference =
        (left.order ?? Number.MAX_SAFE_INTEGER) -
        (right.order ?? Number.MAX_SAFE_INTEGER);
      if (orderDifference !== 0) return orderDifference;
    }
    return Date.parse(right.date) - Date.parse(left.date);
  });
}

function assertUniqueSlugs(items: NotionContentItem[]) {
  const pageBySlug = new Map<string, string>();

  for (const item of items) {
    const existingPage = pageBySlug.get(item.slug);
    if (existingPage) {
      throw new Error(
        `Duplicate Notion slug \"${item.slug}\" on pages ${existingPage} and ${item.id}.`
      );
    }
    pageBySlug.set(item.slug, item.id);
  }
}

async function writeCacheAtomically(cache: NotionContentCache) {
  await mkdir(cacheDirectory, { recursive: true });
  const temporaryCachePath = path.join(
    cacheDirectory,
    `content.${process.pid}.tmp.json`
  );
  await writeFile(temporaryCachePath, `${JSON.stringify(cache, null, 2)}\n`, "utf8");
  await rename(temporaryCachePath, cachePath);
}

async function installGeneratedSnapshot(cache: NotionContentCache) {
  await rm(generatedMediaBackupDirectory, { recursive: true, force: true });

  const hadExistingMedia = await pathExists(generatedMediaDirectory);
  if (hadExistingMedia) {
    await rename(generatedMediaDirectory, generatedMediaBackupDirectory);
  }

  try {
    await rename(generatedMediaStageDirectory, generatedMediaDirectory);
    await writeCacheAtomically(cache);
    await rm(generatedMediaBackupDirectory, { recursive: true, force: true });
  } catch (error) {
    await rm(generatedMediaDirectory, { recursive: true, force: true });
    if (hadExistingMedia && (await pathExists(generatedMediaBackupDirectory))) {
      await rename(generatedMediaBackupDirectory, generatedMediaDirectory);
    }
    throw error;
  }
}

async function installEmptySnapshot() {
  const cache: NotionContentCache = {
    schemaVersion: CONTENT_CACHE_SCHEMA_VERSION,
    generatedAt: new Date().toISOString(),
    source: {
      configured: false,
      notionApiVersion: NOTION_API_VERSION,
    },
    items: [],
  };

  await writeCacheAtomically(cache);
  await rm(generatedMediaDirectory, { recursive: true, force: true });
  console.log("Notion sync skipped: no Notion data source is configured.");
}

async function main() {
  const packageJson = JSON.parse(
    await readFile(path.join(projectRoot, "package.json"), "utf8")
  ) as { name?: string };
  if (packageJson.name !== "aws-amplify-gen2") {
    throw new Error("Refusing to sync Notion content outside the expected project root.");
  }

  await loadLocalEnvironment();
  const configuration = await readConfiguration();
  await mkdir(publicDirectory, { recursive: true });
  await rm(generatedMediaStageDirectory, { recursive: true, force: true });
  await mkdir(generatedMediaStageDirectory, { recursive: true });

  if (!configuration.configured) {
    await rm(generatedMediaStageDirectory, { recursive: true, force: true });
    await installEmptySnapshot();
    return;
  }

  const notion = new Client({
    auth: configuration.apiKey,
    notionVersion: NOTION_API_VERSION,
  });

  try {
    const dataSource = await withNotionThrottle(() =>
      notion.dataSources.retrieve({
        data_source_id: configuration.dataSourceId,
      })
    );
    if (!isFullDataSource(dataSource)) {
      throw new Error("Notion returned an incomplete data source schema.");
    }

    const schema = validateSchema(dataSource);
    const pages = await getPublishedPages(
      notion,
      configuration.dataSourceId,
      schema.publication
    );
    const mediaContext: MediaSnapshotContext = {
      downloadedBySource: new Map(),
      totalBytes: 0,
    };
    const items: NotionContentItem[] = [];

    for (const page of pages) {
      items.push(await buildContentItem(notion, page, schema, mediaContext));
    }

    assertUniqueSlugs(items);
    const sortedItems = sortContent(items);
    const cache: NotionContentCache = {
      schemaVersion: CONTENT_CACHE_SCHEMA_VERSION,
      generatedAt: new Date().toISOString(),
      source: {
        configured: true,
        notionApiVersion: NOTION_API_VERSION,
        dataSourceId: configuration.dataSourceId,
      },
      items: sortedItems,
    };

    await installGeneratedSnapshot(cache);
    console.log(
      `Notion sync complete: ${sortedItems.length} published item(s), ` +
        `${mediaContext.downloadedBySource.size} media file(s).`
    );
  } catch (error) {
    await rm(generatedMediaStageDirectory, { recursive: true, force: true });
    throw error;
  }
}

main().catch((error: unknown) => {
  console.error("Notion sync failed.");
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
