export type CompanionPageChunk = {
  heading: string;
  text: string;
};

export type CompanionPageContext = {
  path: string;
  title: string;
  highlight: string;
  chunks: CompanionPageChunk[];
  capturedAt: string;
};

const MAX_CHUNKS = 12;
const MAX_CHUNK_LENGTH = 650;
const MAX_HIGHLIGHT_LENGTH = 300;

function normalizeText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function truncate(value: string, limit: number) {
  const normalized = normalizeText(value);
  if (normalized.length <= limit) return normalized;
  return `${normalized.slice(0, Math.max(0, limit - 1)).trimEnd()}…`;
}

function isPageContent(element: Element) {
  return !element.closest(
    [
      "nav",
      "footer",
      "form",
      "script",
      "style",
      "noscript",
      '[role="dialog"]',
      '[aria-hidden="true"]',
      "#levon-companion",
      "#companion-workspace",
      '[data-companion-conversation="true"]',
      '[data-message-role]',
      "[data-persistent-avatar-host]",
    ].join(",")
  );
}

/**
 * Build a small, bounded snapshot from the page the visitor can currently see.
 * The snapshot is reference data for KIRA, never executable instructions.
 */
export function collectCompanionPageContext(
  path: string
): CompanionPageContext | null {
  if (typeof document === "undefined") return null;

  const root =
    document.querySelector(
      "#site-page-content main:not(#companion-workspace)"
    ) ??
    document.querySelector("#site-page-content") ??
    document.querySelector("main:not(#companion-workspace)");
  if (!root) return null;

  const titleElement = Array.from(root.querySelectorAll("h1")).find(
    isPageContent
  );
  const documentTitle = document.title.split("|")[0]?.trim();
  const title = truncate(
    titleElement?.textContent || documentTitle || "Current page",
    140
  );

  const chunks: CompanionPageChunk[] = [];
  const seen = new Set<string>();
  let heading = title;

  for (const element of Array.from(
    root.querySelectorAll("h2, h3, p, li")
  )) {
    if (!isPageContent(element)) continue;
    const text = normalizeText(element.textContent ?? "");
    if (!text) continue;

    if (element.matches("h2, h3")) {
      heading = truncate(text, 140);
      continue;
    }

    if (text.length < 24 || seen.has(text)) continue;
    seen.add(text);
    chunks.push({ heading, text: truncate(text, MAX_CHUNK_LENGTH) });
    if (chunks.length >= MAX_CHUNKS) break;
  }

  const metaDescription = normalizeText(
    document
      .querySelector<HTMLMetaElement>('meta[name="description"]')
      ?.content ?? ""
  );
  // Every page defines its own metadata description. It is the stable,
  // author-written summary used for the compact page highlight; body content
  // remains available separately to KIRA as retrieval chunks.
  const firstPageText =
    chunks.find((chunk) => Array.from(chunk.text).length >= 60)?.text ??
    chunks[0]?.text ??
    "";
  const highlightSource = metaDescription || firstPageText;
  const highlight = truncate(
    highlightSource || `Explore the key work and context on ${title}.`,
    MAX_HIGHLIGHT_LENGTH
  );

  return {
    path: path.startsWith("/") ? path : "/",
    title,
    highlight,
    chunks,
    capturedAt: new Date().toISOString(),
  };
}
