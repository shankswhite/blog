import Image from "next/image";
import Link from "next/link";
import { formatDate } from "../../lib/formatDate";
import { Container } from "./Container";
import { Prose } from "./Prose";
import { StructuredData } from "./StructuredData";
import { createArticleStructuredData } from "@/lib/structuredData";
import { siteUrl } from "@/lib/siteUrl";

type BlogMeta = {
  title: string;
  date: string;
  modifiedDate?: string;
  image?: string;
  description?: string;
  tags?: string[];
};

export function BlogLayout({
  children,
  meta,
  path,
}: {
  children: React.ReactNode;
  meta: BlogMeta;
  path: string;
}) {
  return (
    <Container>
      <StructuredData data={createArticleStructuredData(siteUrl, { ...meta, path })} />
      <article>
        <header className="flex flex-col">
          <nav aria-label="Breadcrumb" className="mb-5 text-xs leading-6 text-slate-500">
            <ol className="flex flex-wrap items-center gap-x-2">
              <li><Link href="/" className="hover:text-slate-950">Levon Blog</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/blog" className="hover:text-slate-950">Blog</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page">{meta.title}</li>
            </ol>
          </nav>

          <h1 className="max-w-3xl py-3 text-4xl font-semibold leading-[1.02] tracking-[-0.05em] text-slate-950 sm:text-5xl">
            {meta.title}
          </h1>
          {meta.description && (
            <p className="mt-2 max-w-2xl text-base leading-7 text-slate-600">
              {meta.description}
            </p>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Link href="/about" rel="author" className="text-sm font-medium text-sky-700 hover:text-slate-950">
              By Levon Zhao
            </Link>
            <time dateTime={meta.date} className="text-sm text-slate-600">
              {formatDate(meta.date)}
            </time>
            {meta.modifiedDate && meta.modifiedDate !== meta.date && (
              <span className="text-xs text-slate-500">
                Updated <time dateTime={meta.modifiedDate}>{formatDate(meta.modifiedDate)}</time>
              </span>
            )}
            {meta.tags?.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-medium text-slate-500"
              >
                {tag}
              </span>
            ))}
          </div>
          {meta.image && (
            <div className="relative mt-6 aspect-[16/10] w-full overflow-hidden rounded-[28px] border border-slate-200 bg-slate-100">
              {meta.image.startsWith("/") ? (
                <Image
                  src={meta.image}
                  alt={`${meta.title} cover`}
                  fill
                  className="object-cover object-left-top"
                  sizes="(max-width: 1024px) 100vw, 900px"
                  priority
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={meta.image}
                  alt={`${meta.title} cover`}
                  className="h-full w-full object-cover object-left-top"
                />
              )}
            </div>
          )}
        </header>
        <Prose className="mt-10">{children}</Prose>
      </article>
    </Container>
  );
}
