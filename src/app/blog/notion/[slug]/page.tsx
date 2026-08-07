import { Container } from "@/components/Container";
import { Prose } from "@/components/Prose";
import { getNotionBlogs, getNotionBlogBySlug } from "../../../../../lib/notion";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { createPageMetadata } from "@/lib/siteMetadata";
import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";

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
      <article>
        <header className="mb-10 flex flex-col">
          <Link
            href="/blog"
            aria-label="Go back to articles"
            className="group mb-5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-slate-300 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            <IconArrowLeft size={17} />
          </Link>
          {blog.image && (
            <div className="relative mb-6 aspect-[16/10] w-full overflow-hidden rounded-[28px] border border-slate-200 bg-slate-100">
              {/* Notion image hosts vary, so keep this source portable. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={blog.image}
                alt={blog.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <h1 className="max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.05em] text-slate-950 sm:text-5xl">
            {blog.title}
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            {blog.description}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <time dateTime={blog.date} className="text-slate-600">
              {new Date(blog.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>

            {blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-medium text-slate-500"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

        </header>

        <Prose className="mt-10">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </Prose>
      </article>
    </Container>
  );
}
