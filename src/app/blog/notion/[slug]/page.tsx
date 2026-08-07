import { Container } from "@/components/Container";
import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import { Prose } from "@/components/Prose";
import { getNotionBlogs, getNotionBlogBySlug } from "../../../../../lib/notion";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { createPageMetadata } from "@/lib/siteMetadata";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const blogs = await getNotionBlogs();
  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const result = await getNotionBlogBySlug(slug);

  if (!result) {
    return { title: "Blog not found" };
  }

  return createPageMetadata({
    title: result.blog.title,
    description: result.blog.description,
    path: `/blog/notion/${slug}`,
    type: "article",
  });
}

export default async function NotionBlogPage({ params }: Props) {
  const { slug } = await params;
  const result = await getNotionBlogBySlug(slug);

  if (!result) {
    notFound();
  }

  const { blog, content } = result;

  return (
    <Container>
      <article className="max-w-3xl">
        <header className="mb-8">
          {blog.image && (
            <div className="relative w-full h-64 mb-6 rounded-lg overflow-hidden">
              {/* Notion image hosts vary, so keep this source portable. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={blog.image}
                alt={blog.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <Heading className="font-black">{blog.title}</Heading>

          <div className="flex items-center gap-4 mt-4 text-sm text-secondary">
            <time dateTime={blog.date}>
              {new Date(blog.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>

            {blog.tags.length > 0 && (
              <div className="flex gap-2">
                {blog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-neutral-200 rounded-md text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <Paragraph className="mt-4 text-secondary">
            {blog.description}
          </Paragraph>
        </header>

        <Prose>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </Prose>
      </article>
    </Container>
  );
}
