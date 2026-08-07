import { IconArrowUpRight } from "@tabler/icons-react";
import Link from "next/link";
import type { ProjectCard } from "@/types/products";
import { ProjectVisual } from "./ProjectVisual";

function ProjectTags({ stack }: { stack: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5" aria-label="Technology stack">
      {stack.slice(0, 3).map((technology) => (
        <span
          key={technology}
          className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-medium text-slate-600"
        >
          {technology}
        </span>
      ))}
    </div>
  );
}

function FeaturedProject({ product }: { product: ProjectCard }) {
  return (
    <article>
      <Link
        href={`/projects/${product.slug}`}
        className="group flex h-full flex-col rounded-[26px] border border-slate-200 bg-white p-2 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_22px_55px_-32px_rgba(15,23,42,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
      >
        <ProjectVisual
          slug={product.slug}
          title={product.title}
          eyebrow={product.eyebrow}
          coverUrl={product.coverUrl}
          accent={product.accent}
          className="min-h-[176px] transition duration-300 group-hover:scale-[0.995]"
        />
        <div className="flex flex-1 flex-col p-4 pb-3">
          <div className="flex items-center justify-between gap-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            <span>{product.eyebrow}</span>
            <span>{product.year}</span>
          </div>
          <h3 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-slate-950">
            {product.title}
          </h3>
          <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">
            {product.description}
          </p>
          <div className="mt-4 flex items-end justify-between gap-3 border-t border-slate-100 pt-3">
            <ProjectTags stack={product.stack} />
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition group-hover:border-slate-950 group-hover:bg-slate-950 group-hover:text-white">
              <IconArrowUpRight size={16} />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

function ProjectRow({ product }: { product: ProjectCard }) {
  return (
    <article>
      <Link
        href={`/projects/${product.slug}`}
        className="group grid h-full gap-4 rounded-[20px] border border-slate-200 bg-white p-5 transition hover:border-sky-300 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 sm:grid-cols-[minmax(0,1fr)_auto]"
      >
        <div>
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
            <span>{product.eyebrow}</span>
            <span className="text-slate-300">/</span>
            <span>{product.year}</span>
          </div>
          <h3 className="mt-2 text-base font-semibold tracking-[-0.02em] text-slate-950">
            {product.title}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-slate-600">
            {product.description}
          </p>
          <div className="mt-3">
            <ProjectTags stack={product.stack} />
          </div>
        </div>
        <span className="inline-flex h-9 w-9 items-center justify-center self-start rounded-full border border-slate-200 text-slate-500 transition group-hover:border-slate-950 group-hover:bg-slate-950 group-hover:text-white">
          <IconArrowUpRight size={16} />
        </span>
      </Link>
    </article>
  );
}

export function Products({ products }: { products: ProjectCard[] }) {
  const featured = products.filter((product) => product.featured).slice(0, 3);
  const featuredSlugs = new Set(featured.map(({ slug }) => slug));
  const archive = products.filter(({ slug }) => !featuredSlugs.has(slug));

  return (
    <div className="space-y-12">
      {featured.length > 0 && (
        <section aria-labelledby="flagship-projects">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-700">
                Start here
              </p>
              <h2
                id="flagship-projects"
                className="mt-1 text-xl font-semibold tracking-[-0.03em] text-slate-950"
              >
                Flagship work
              </h2>
            </div>
            <p className="hidden text-xs text-slate-500 sm:block">
              Research · systems · product thinking
            </p>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {featured.map((product) => (
              <FeaturedProject key={product.slug} product={product} />
            ))}
          </div>
        </section>
      )}

      {archive.length > 0 && (
        <section aria-labelledby="project-archive">
          <div className="mb-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              More work
            </p>
            <h2
              id="project-archive"
              className="mt-1 text-xl font-semibold tracking-[-0.03em] text-slate-950"
            >
              Project archive
            </h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {archive.map((product) => (
              <ProjectRow key={product.slug} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
