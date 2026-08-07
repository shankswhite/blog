"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { IconArrowUpRight } from "@tabler/icons-react";
import type { Blog } from "@/types/blog";
import { formatDate } from "../../lib/formatDate";

export function Blogs({ blogs }: { blogs: Blog[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {blogs.map((blog, index) => (
        <motion.article
          key={blog.slug}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.26, delay: Math.min(index * 0.06, 0.18) }}
        >
          <Link
            href={`/blog/${blog.slug}`}
            className="group flex h-full flex-col rounded-[28px] border border-slate-200 bg-white p-2 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_22px_55px_-32px_rgba(15,23,42,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            <div className="relative aspect-[16/10] overflow-hidden rounded-[22px] border border-slate-100 bg-slate-100">
              <Image
                src={blog.image}
                alt={`${blog.title} cover`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition duration-500 group-hover:scale-[1.025]"
              />
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
                  {blog.tags?.slice(0, 3).map((tag) => (
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
        </motion.article>
      ))}
    </div>
  );
}
