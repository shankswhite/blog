import { readFileSync } from "node:fs";
import path from "node:path";
import {
  CONTENT_CACHE_SCHEMA_VERSION,
  NOTION_API_VERSION,
  isProjectAccent,
  type NotionContentCache,
  type NotionContentItem,
  type ProjectContent,
  type WritingContent,
} from "@/types/content";

const cachePath = path.resolve(process.cwd(), ".notion-cache/content.json");

const emptyCache: NotionContentCache = {
  schemaVersion: CONTENT_CACHE_SCHEMA_VERSION,
  generatedAt: "1970-01-01T00:00:00.000Z",
  source: {
    configured: false,
    notionApiVersion: NOTION_API_VERSION,
  },
  items: [],
};

let memoizedCache: NotionContentCache | undefined;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function assertBaseItem(value: Record<string, unknown>, index: number) {
  const requiredStrings = [
    "id",
    "source",
    "slug",
    "title",
    "description",
    "date",
    "lastEditedAt",
    "markdown",
    "notionUrl",
  ] as const;

  for (const field of requiredStrings) {
    if (typeof value[field] !== "string") {
      throw new Error(`Invalid Notion cache item ${index}: ${field} must be a string.`);
    }
  }

  if (value.source !== "notion") {
    throw new Error(`Invalid Notion cache item ${index}: unsupported source.`);
  }

  if (!isStringArray(value.tags)) {
    throw new Error(`Invalid Notion cache item ${index}: tags must be strings.`);
  }

  if (value.coverUrl !== undefined && typeof value.coverUrl !== "string") {
    throw new Error(`Invalid Notion cache item ${index}: coverUrl must be a string.`);
  }
}

function parseItem(value: unknown, index: number): NotionContentItem {
  if (!isRecord(value)) {
    throw new Error(`Invalid Notion cache item ${index}: expected an object.`);
  }

  assertBaseItem(value, index);

  if (value.kind === "writing") {
    return value as WritingContent;
  }

  if (value.kind !== "project") {
    throw new Error(`Invalid Notion cache item ${index}: unsupported content kind.`);
  }

  for (const field of ["category", "year", "accent"] as const) {
    if (typeof value[field] !== "string") {
      throw new Error(`Invalid Notion project ${index}: ${field} must be a string.`);
    }
  }

  if (typeof value.accent !== "string" || !isProjectAccent(value.accent)) {
    throw new Error(`Invalid Notion project ${index}: unsupported accent.`);
  }

  if (!isStringArray(value.stack)) {
    throw new Error(`Invalid Notion project ${index}: stack must be strings.`);
  }

  if (typeof value.featured !== "boolean") {
    throw new Error(`Invalid Notion project ${index}: featured must be a boolean.`);
  }

  if (value.order !== undefined && typeof value.order !== "number") {
    throw new Error(`Invalid Notion project ${index}: order must be a number.`);
  }

  for (const field of ["externalUrl", "actionLabel"] as const) {
    if (value[field] !== undefined && typeof value[field] !== "string") {
      throw new Error(`Invalid Notion project ${index}: ${field} must be a string.`);
    }
  }

  return value as ProjectContent;
}

function parseCache(value: unknown): NotionContentCache {
  if (!isRecord(value)) {
    throw new Error("Invalid Notion cache: expected an object.");
  }

  if (value.schemaVersion !== CONTENT_CACHE_SCHEMA_VERSION) {
    throw new Error(
      `Unsupported Notion cache schema: expected ${CONTENT_CACHE_SCHEMA_VERSION}.`
    );
  }

  if (typeof value.generatedAt !== "string" || !isRecord(value.source)) {
    throw new Error("Invalid Notion cache metadata.");
  }

  if (
    typeof value.source.configured !== "boolean" ||
    value.source.notionApiVersion !== NOTION_API_VERSION ||
    (value.source.dataSourceId !== undefined &&
      typeof value.source.dataSourceId !== "string")
  ) {
    throw new Error("Invalid Notion cache source metadata.");
  }

  if (!Array.isArray(value.items)) {
    throw new Error("Invalid Notion cache: items must be an array.");
  }

  return {
    schemaVersion: CONTENT_CACHE_SCHEMA_VERSION,
    generatedAt: value.generatedAt,
    source: {
      configured: value.source.configured,
      notionApiVersion: NOTION_API_VERSION,
      ...(typeof value.source.dataSourceId === "string"
        ? { dataSourceId: value.source.dataSourceId }
        : {}),
    },
    items: value.items.map(parseItem),
  };
}

export function readNotionContentCache(): NotionContentCache {
  if (memoizedCache) return memoizedCache;

  try {
    memoizedCache = parseCache(JSON.parse(readFileSync(cachePath, "utf8")));
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      (error as NodeJS.ErrnoException).code === "ENOENT"
    ) {
      memoizedCache = emptyCache;
    } else {
      throw error;
    }
  }

  return memoizedCache;
}

export function getNotionContent(): NotionContentItem[] {
  return readNotionContentCache().items;
}

export function getNotionWriting(): WritingContent[] {
  return getNotionContent().filter(
    (item): item is WritingContent => item.kind === "writing"
  );
}

export function getNotionProjects(): ProjectContent[] {
  return getNotionContent().filter(
    (item): item is ProjectContent => item.kind === "project"
  );
}

export function getNotionContentBySlug(
  kind: NotionContentItem["kind"],
  slug: string
): NotionContentItem | undefined {
  return getNotionContent().find(
    (item) => item.kind === kind && item.slug === slug
  );
}
