import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogLayout } from "@/components/BlogLayout";
import { ContentMarkdown } from "@/components/ContentMarkdown";
import {
  getNotionWritingBySlug,
  getWritingCards,
} from "@/lib/content";
import { createPageMetadata } from "@/lib/siteMetadata";
import { siteUrl } from "@/lib/siteUrl";

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

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: entry.title,
    description: entry.description,
    datePublished: entry.date,
    dateModified: entry.lastEditedAt,
    mainEntityOfPage: `${siteUrl}/blog/${entry.slug}`,
    author: {
      "@type": "Person",
      name: "Levon Zhao",
      url: siteUrl,
    },
    ...(entry.coverUrl
      ? { image: new URL(entry.coverUrl, siteUrl).toString() }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <BlogLayout
        meta={{
          title: entry.title,
          description: entry.description,
          date: entry.date,
          image: entry.coverUrl,
          tags: entry.tags,
        }}
      >
        <ContentMarkdown markdown={entry.markdown} />
      </BlogLayout>
    </>
  );
}
