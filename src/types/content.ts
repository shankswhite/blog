export const NOTION_API_VERSION = "2026-03-11" as const;
export const CONTENT_CACHE_SCHEMA_VERSION = 1 as const;

export const PROJECT_ACCENTS = [
  "red",
  "sky",
  "violet",
  "amber",
  "emerald",
  "slate",
] as const;

export type ProjectAccent = (typeof PROJECT_ACCENTS)[number];
export type ContentKind = "writing" | "project";

export type ContentSource = "notion";

export type ContentBase = {
  id: string;
  source: ContentSource;
  slug: string;
  title: string;
  description: string;
  date: string;
  lastEditedAt: string;
  tags: string[];
  coverUrl?: string;
  markdown: string;
  notionUrl: string;
};

export type WritingContent = ContentBase & {
  kind: "writing";
};

export type ProjectContent = ContentBase & {
  kind: "project";
  category: string;
  year: string;
  stack: string[];
  accent: ProjectAccent;
  featured: boolean;
  order?: number;
  externalUrl?: string;
  actionLabel?: string;
};

export type NotionContentItem = WritingContent | ProjectContent;

export type NotionContentCache = {
  schemaVersion: typeof CONTENT_CACHE_SCHEMA_VERSION;
  generatedAt: string;
  source: {
    configured: boolean;
    notionApiVersion: typeof NOTION_API_VERSION;
    dataSourceId?: string;
  };
  items: NotionContentItem[];
};

export function isProjectAccent(value: string): value is ProjectAccent {
  return (PROJECT_ACCENTS as readonly string[]).includes(value);
}
