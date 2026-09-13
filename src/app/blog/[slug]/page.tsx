import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogLayout } from "@/components/BlogLayout";
import { ContentMarkdown } from "@/components/ContentMarkdown";
import {
  getNotionWritingBySlug,
  getWritingCards,
} from "@/lib/content";
import { createPageMetadata } from "@/lib/siteMetadata";

type WritingPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const writing = await getWritingCards();
  return writing
    .filter((entry) => entry.source === "notion")
    .map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: WritingPageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = getNotionWritingBySlug(slug);

  if (!entry) return { title: "Article not found" };

  return createPageMetadata({
    title: entry.title,
    description: entry.description,
    path: `/blog/${entry.slug}`,
    type: "article",
    publishedTime: entry.date,
    modifiedTime: entry.lastEditedAt,
    tags: entry.tags,
    image: entry.coverUrl,
  });
}

export default async function WritingPage({ params }: WritingPageProps) {
  const { slug } = await params;
  const entry = getNotionWritingBySlug(slug);

  if (!entry) notFound();

  return (
    <BlogLayout
      path={`/blog/${entry.slug}`}
      meta={{
        title: entry.title,
        description: entry.description,
        date: entry.date,
        modifiedDate: entry.lastEditedAt,
        image: entry.coverUrl,
        tags: entry.tags,
      }}
    >
      <ContentMarkdown markdown={entry.markdown} />
    </BlogLayout>
  );
}
