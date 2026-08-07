import type { ComponentPropsWithoutRef } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import remarkGfm from "remark-gfm";

const notionSchema = {
  ...defaultSchema,
  tagNames: [
    ...(defaultSchema.tagNames ?? []),
    "audio",
    "details",
    "source",
    "summary",
    "video",
  ],
  attributes: {
    ...defaultSchema.attributes,
    a: [...(defaultSchema.attributes?.a ?? []), "download", "target", "rel"],
    audio: ["controls", "preload", "src"],
    details: ["open"],
    source: ["src", "type"],
    video: ["controls", "playsInline", "poster", "preload", "src"],
  },
};

function quoteBlock(value: string) {
  return value
    .trim()
    .split("\n")
    .map((line) => `> ${line}`)
    .join("\n");
}

/**
 * Notion's 2026 enhanced Markdown includes a small XML-like vocabulary.
 * Convert structural tags to portable Markdown/HTML before the safe renderer
 * sees them, so content stays readable even if a block has no custom visual.
 */
export function normalizeNotionMarkdown(markdown: string): string {
  return markdown
    .replace(
      /<callout(?:\s[^>]*)?>([\s\S]*?)<\/callout>/gi,
      (_, body: string) => `\n${quoteBlock(body)}\n`
    )
    .replace(
      /<details(?:\s[^>]*)?>\s*<summary>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/gi,
      (_, summary: string, body: string) =>
        `\n#### ${summary.trim()}\n\n${body.trim()}\n`
    )
    .replace(
      /<(?:columns|column|synced_block|meeting-notes)(?:\s[^>]*)?>/gi,
      "\n"
    )
    .replace(/<\/(?:columns|column|synced_block|meeting-notes)>/gi, "\n")
    .replace(/<table_of_contents\s*\/>/gi, "")
    .replace(
      /<file\s+src="([^"]+)"[^>]*>([\s\S]*?)<\/file>/gi,
      (_, url: string, label: string) =>
        `[${label.trim() || "Download file"}](${url})`
    )
    .replace(
      /<pdf\s+src="([^"]+)"[^>]*>([\s\S]*?)<\/pdf>/gi,
      (_, url: string, label: string) =>
        `[${label.trim() || "Open PDF"}](${url})`
    )
    .replace(
      /<page\s+url="([^"]+)"[^>]*>([\s\S]*?)<\/page>/gi,
      (_, url: string, label: string) => `[${label.trim() || "Related page"}](${url})`
    )
    .replace(
      /<database\s+url="([^"]+)"[^>]*>([\s\S]*?)<\/database>/gi,
      (_, url: string, label: string) =>
        `[${label.trim() || "Related database"}](${url})`
    )
    .replace(
      /<audio\s+src="([^"]+)"[^>]*>([\s\S]*?)<\/audio>/gi,
      (_, url: string, label: string) =>
        `<audio controls preload="metadata" src="${url}">${label.trim()}</audio>`
    )
    .replace(
      /<video\s+src="([^"]+)"[^>]*>([\s\S]*?)<\/video>/gi,
      (_, url: string, label: string) =>
        `<video controls playsinline preload="metadata" src="${url}">${label.trim()}</video>`
    );
}

function MarkdownLink({ href = "", ...props }: ComponentPropsWithoutRef<"a">) {
  const external = /^https?:\/\//i.test(href);
  return (
    <a
      href={href}
      {...props}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
    />
  );
}

export function ContentMarkdown({ markdown }: { markdown: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, [rehypeSanitize, notionSchema]]}
      components={{
        a: MarkdownLink,
        img: ({ alt = "", ...props }) => (
          // Notion media is downloaded at build time; dimensions are unknown.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            {...props}
            alt={alt}
            loading="lazy"
            className="h-auto max-w-full rounded-2xl border border-slate-200"
          />
        ),
        audio: (props) => <audio {...props} className="w-full" />,
        video: (props) => (
          <video
            {...props}
            className="h-auto w-full rounded-2xl border border-slate-200 bg-slate-950"
          />
        ),
      }}
    >
      {normalizeNotionMarkdown(markdown)}
    </ReactMarkdown>
  );
}
