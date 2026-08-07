import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import { getAllBlogs, BlogMeta } from "../../../lib/getAllBlogs";
import { getNotionBlogs } from "../../../lib/notion";
import { Blogs } from "@/components/Blogs";
import Link from "next/link";
import { createPageMetadata } from "@/lib/siteMetadata";

export const metadata = createPageMetadata({
  title: "Writing",
  description:
    "Levon Zhao writes about game design, machine learning, software engineering, and technology.",
  path: "/blog",
});

export default async function Blog() {
  // Get local MDX blogs
  const localBlogs = await getAllBlogs();

  // Get Notion blogs
  const notionBlogs = await getNotionBlogs();

  // Convert to the Blog type expected by the Blogs component
  const blogsData = localBlogs.map((blog: BlogMeta) => ({
    slug: blog.slug,
    title: blog.title,
    description: blog.description,
    date: blog.date,
    image: blog.image,
    tags: blog.tags,
  }));

  return (
    <Container>
      <PageHeader
        eyebrow="Field notes"
        title="Writing from the workbench."
        description={
          <p>
            Research notes and honest postmortems on AI, computer graphics, and
            the systems behind games and software.
          </p>
        }
      />

      {/* Notion blogs section */}
      {notionBlogs.length > 0 && (
        <section className="mb-14">
          <h2 className="mb-5 text-2xl font-semibold tracking-[-0.035em] text-slate-950">
            Latest notes
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {notionBlogs.map((blog) => (
              <Link
                key={blog.id}
                href={`/blog/notion/${blog.slug}`}
                className="group flex min-h-44 flex-col rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-700">
                      Notion note
                    </p>
                    <h3 className="mt-2 font-semibold tracking-[-0.025em] text-slate-950">
                      {blog.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                      {blog.description}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <time className="text-[10px] font-medium text-slate-500">
                        {new Date(blog.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </time>
                      {blog.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  {blog.image && (
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-slate-100 bg-slate-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                      />
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Local MDX blogs */}
      <h2 className="mb-5 text-2xl font-semibold tracking-[-0.035em] text-slate-950">
        Migrated case studies
      </h2>
      <Blogs blogs={blogsData} />
    </Container>
  );
}
