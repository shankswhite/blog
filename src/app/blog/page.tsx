import { Container } from "@/components/Container";
import { Heading } from "@/components/Heading";
import { Highlight } from "@/components/Highlight";
import { Paragraph } from "@/components/Paragraph";
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
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-700">
        Field notes
      </p>
      <Heading className="pb-4 pt-3 font-black">Writing from the workbench.</Heading>
      <Paragraph className="max-w-2xl pb-10">
        Research notes and honest postmortems on <Highlight>AI</Highlight>,{" "}
        <Highlight>computer graphics</Highlight>, and the systems behind games
        and software.
      </Paragraph>

      {/* Notion blogs section */}
      {notionBlogs.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-primary">
            Latest notes
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {notionBlogs.map((blog) => (
              <Link
                key={blog.id}
                href={`/blog/notion/${blog.slug}`}
                className="block p-4 rounded-lg border border-neutral-200 hover:border-neutral-400 transition-colors bg-white hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-primary">{blog.title}</h3>
                    <p className="text-sm text-secondary mt-1 line-clamp-2">
                      {blog.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <time className="text-xs text-secondary">
                        {new Date(blog.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </time>
                      {blog.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 bg-neutral-100 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  {blog.image && (
                    <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0 ml-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Local MDX blogs */}
      <h2 className="mb-4 text-xl font-semibold text-primary">Migrated case studies</h2>
      <Blogs blogs={blogsData} />
    </Container>
  );
}
