import Image from "next/image";
import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";
import { formatDate } from "../../lib/formatDate";
import { Container } from "./Container";
import { Prose } from "./Prose";

type BlogMeta = {
  title: string;
  date: string;
  image: string;
  description?: string;
  tags?: string[];
};

export function BlogLayout({
  children,
  meta,
}: {
  children: React.ReactNode;
  meta: BlogMeta;
}) {
  return (
    <Container>
      <article>
        <header className="flex flex-col">
          <Link
            href="/blog"
            aria-label="Go back to articles"
            className="group mb-5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-slate-300 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            <IconArrowLeft size={17} />
          </Link>

          <h1 className="max-w-3xl py-3 text-4xl font-semibold leading-[1.02] tracking-[-0.05em] text-slate-950 sm:text-5xl">
            {meta.title}
          </h1>
          {meta.description && (
            <p className="mt-2 max-w-2xl text-base leading-7 text-slate-600">
              {meta.description}
            </p>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <time dateTime={meta.date} className="text-sm text-slate-600">
              {formatDate(meta.date)}
            </time>
            {meta.tags?.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-medium text-slate-500"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="relative mt-6 aspect-[16/10] w-full overflow-hidden rounded-[28px] border border-slate-200 bg-slate-100">
            <Image
              src={meta.image}
              alt={`${meta.title} cover`}
              fill
              className="object-cover object-left-top"
              sizes="(max-width: 1024px) 100vw, 900px"
              priority
            />
          </div>
        </header>
        <Prose className="mt-10">{children}</Prose>
      </article>
    </Container>
  );
}
