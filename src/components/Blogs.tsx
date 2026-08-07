import Image from "next/image";
import Link from "next/link";
import { IconArrowUpRight } from "@tabler/icons-react";
import type { Blog } from "@/types/blog";
import { formatDate } from "../../lib/formatDate";

export function Blogs({ blogs }: { blogs: Blog[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {blogs.map((blog) => (
        <article key={blog.slug}>
          <Link
            href={blog.href}
            className="group flex h-full flex-col rounded-[28px] border border-slate-200 bg-white p-2 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_22px_55px_-32px_rgba(15,23,42,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            <div className="relative aspect-[16/8] overflow-hidden rounded-[22px] border border-slate-100 bg-gradient-to-br from-slate-950 via-sky-950 to-sky-700">
              {blog.image?.startsWith("/") ? (
                <Image
                  src={blog.image}
                  alt={`${blog.title} cover`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.025]"
                />
              ) : blog.image ? (
                // External CMS covers are optional and cannot be enumerated in
                // Next Image remotePatterns ahead of time.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={blog.image}
                  alt={`${blog.title} cover`}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]"
                />
              ) : (
                <div
                  aria-hidden="true"
                  className="absolute inset-0 flex items-end overflow-hidden p-5 text-white"
                >
                  <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.35)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.35)_1px,transparent_1px)] [background-size:28px_28px]" />
                  <div className="absolute -right-12 -top-14 h-40 w-40 rounded-full bg-sky-300/30 blur-3xl" />
                  <p className="relative text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-100/75">
                    {blog.tags[0] || "Field note"}
                  </p>
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col p-4 pb-3">
              <time
                dateTime={blog.date}
                className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500"
              >
                {formatDate(blog.date)}
              </time>
              <h3 className="mt-3 text-xl font-semibold leading-tight tracking-[-0.03em] text-slate-950">
                {blog.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">
                {blog.description}
              </p>
              <div className="mt-4 flex items-end justify-between gap-3 border-t border-slate-100 pt-3">
                <div className="flex flex-wrap gap-1.5">
                  {blog.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-medium text-slate-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition group-hover:border-slate-950 group-hover:bg-slate-950 group-hover:text-white">
                  <IconArrowUpRight size={16} />
                </span>
              </div>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}
