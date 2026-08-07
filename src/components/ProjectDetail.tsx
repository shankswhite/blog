import Image from "next/image";
import Link from "next/link";
import {
  IconArrowLeft,
  IconArrowUpRight,
  IconFileTypePdf,
} from "@tabler/icons-react";
import type { Product } from "@/types/products";
import { Container } from "./Container";
import { MorphingShowcase } from "./MorphingShowcase";
import { ProjectVisual } from "./ProjectVisual";

export function ProjectDetail({
  project,
  backHref = "/projects",
  backLabel = "All projects",
  legacy = false,
}: {
  project: Product;
  backHref?: string;
  backLabel?: string;
  legacy?: boolean;
}) {
  const externalAction = project.href?.startsWith("http") ?? false;

  return (
    <Container>
      <article className="pb-10">
        <Link
          href={backHref}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
        >
          <IconArrowLeft size={14} />
          {backLabel}
        </Link>

        {legacy && (
          <div className="mb-8 rounded-[22px] border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-950">
            <span className="font-semibold">Legacy Blog record.</span> This page
            preserves material from the previous site inside the new archive,
            with clearer structure and updated accessibility.
          </div>
        )}

        <header className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.17em] text-sky-700">
              <span>{project.eyebrow}</span>
              <span className="text-slate-300">/</span>
              <span className="text-slate-500">{project.year}</span>
            </div>
            <h1 className="mt-4 text-4xl font-semibold leading-[0.98] tracking-[-0.055em] text-slate-950 sm:text-5xl lg:text-6xl">
              {project.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              {project.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {project.stack.map((technology) => (
                <span
                  key={technology}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm"
                >
                  {technology}
                </span>
              ))}
            </div>
          </div>

          <ProjectVisual
            slug={project.slug}
            accent={project.accent}
            title={project.title}
            eyebrow={project.eyebrow}
            coverUrl={project.coverUrl}
            className="min-h-[290px] shadow-[0_26px_60px_-35px_rgba(15,23,42,0.65)]"
          />
        </header>

        {project.metrics && project.metrics.length > 0 && (
          <dl
            className={`mt-10 grid gap-px overflow-hidden rounded-[24px] border border-slate-200 bg-slate-200 ${
              project.metrics.length === 1
                ? "sm:grid-cols-1"
                : project.metrics.length === 2
                  ? "sm:grid-cols-2"
                  : "sm:grid-cols-3"
            }`}
          >
            {project.metrics.map((metric) => (
              <div key={metric.label} className="bg-white px-5 py-5 sm:px-6">
                <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {metric.label}
                </dt>
                <dd className="mt-1.5 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                  {metric.value}
                </dd>
              </div>
            ))}
          </dl>
        )}

        <div className="mt-12 grid gap-8 lg:grid-cols-[180px_minmax(0,1fr)]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Project note
            </p>
          </div>
          <div className="prose prose-slate max-w-3xl text-slate-600 prose-p:leading-7">
            {project.content}
          </div>
        </div>

        {project.slug === "yolo-kan" && (
          <section className="mt-12 overflow-hidden rounded-[28px] border border-red-200 bg-red-950 p-3 shadow-[0_30px_80px_-45px_rgba(127,29,29,0.75)] sm:p-5">
            <Image
              src="/media/research/yolo-kan-poster.jpg"
              alt="YOLO-KAN research poster with architecture, ablation results, and heatmap comparisons"
              width={1600}
              height={1067}
              className="h-auto w-full rounded-2xl bg-white"
              sizes="(max-width: 1024px) 100vw, 900px"
            />
            <div className="flex flex-col gap-3 px-2 pb-1 pt-4 text-red-50 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">Complete research poster</p>
                <p className="mt-1 text-xs text-red-200/70">
                  Architecture, ablations, precision/recall, and heatmaps
                </p>
              </div>
              <Link
                href="/media/research/levon-yolo-kan-poster.pdf"
                target="_blank"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-semibold transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <IconFileTypePdf size={16} />
                Open full PDF
              </Link>
            </div>
          </section>
        )}

        {project.slug === "beier-neely-morphing" && <MorphingShowcase />}

        <div className="mt-12 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-6">
          {project.href && project.actionLabel && (
            <Link
              href={project.href}
              target={externalAction ? "_blank" : undefined}
              rel={externalAction ? "noopener noreferrer" : undefined}
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
            >
              {project.actionLabel}
              <IconArrowUpRight size={16} />
            </Link>
          )}
          {project.availabilityNote && (
            <p className="max-w-xl rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs leading-5 text-amber-900">
              {project.availabilityNote}
            </p>
          )}
          <Link
            href="/chat"
            className="inline-flex items-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            Ask the companion about this work
          </Link>
        </div>
      </article>
    </Container>
  );
}
