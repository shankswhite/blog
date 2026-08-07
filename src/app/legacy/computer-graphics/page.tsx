import Image from "next/image";
import Link from "next/link";
import { IconArrowUpRight, IconAlertTriangle } from "@tabler/icons-react";
import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import { createPageMetadata } from "@/lib/siteMetadata";

export const metadata = createPageMetadata({
  title: "Computer Graphics — Legacy Blog",
  description:
    "The computer-graphics section preserved from Levon Zhao's previous portfolio.",
  path: "/legacy/computer-graphics",
});

export default function LegacyComputerGraphicsPage() {
  return (
    <Container>
      <PageHeader
        eyebrow="Legacy Blog / Computer Graphics"
        title="Graphics experiments, with the record kept honest."
        description={
          <p>
            The old graphics index contained a complete Beier-Neely morphing
            study and a Ray Tracing card whose implementation was missing from
            the source repository.
          </p>
        }
      />

      <div className="grid gap-5 md:grid-cols-2">
        <Link
          href="/legacy/projects/beier-neely-morphing"
          className="group rounded-[28px] border border-slate-200 bg-white p-2 shadow-sm transition hover:-translate-y-1 hover:border-violet-300 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
        >
          <div className="relative aspect-[16/10] overflow-hidden rounded-[22px] bg-slate-100">
            <Image
              src="/media/morphing/warp-study.png"
              alt="Abstract Beier-Neely line-pair warp field"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition duration-500 group-hover:scale-[1.025]"
            />
          </div>
          <div className="p-4 pb-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-violet-700">
              Complete migrated study
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-slate-950">
              Beier-Neely Morphing
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              The full write-up, line-pair warp field, debugging notes, and four
              reconstructed geometric animation sequences.
            </p>
            <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-violet-700">
              Open the archive record
              <IconArrowUpRight size={15} />
            </span>
          </div>
        </Link>

        <article
          id="ray-tracing"
          className="rounded-[28px] border border-dashed border-slate-300 bg-[#f5f1e8] p-6"
        >
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-800">
            <IconAlertTriangle size={19} />
          </span>
          <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-800">
            Archive record only
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-slate-950">
            Ray Tracing Demo
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            The previous graphics index advertised “Ray Tracing Project,” but
            its dynamic component does not exist in the archived repository.
            There is no render, article, or source asset to migrate safely.
          </p>
          <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900">
            Preserved as a transparent gap instead of presenting invented or
            unrelated work.
          </p>
        </article>
      </div>

      <div className="mt-8 rounded-[24px] border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-600">
        Legacy URLs such as <code>/cg</code>, <code>/cg/Morphing</code>, and the
        old frame paths are mapped into this archive so saved links retain a
        meaningful destination.
      </div>
    </Container>
  );
}
