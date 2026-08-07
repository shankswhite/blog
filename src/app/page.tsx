import Link from "next/link";
import {
  IconArchive,
  IconArrowRight,
  IconSparkles,
} from "@tabler/icons-react";
import { Certifications } from "@/components/Certifications";
import { Container } from "@/components/Container";
import { FlagshipProjects } from "@/components/FlagshipProjects";
import { HeroSignalConsole } from "@/components/HeroSignalConsole";
import { createPageMetadata } from "@/lib/siteMetadata";

export const metadata = createPageMetadata({
  title: "AI Engineer & Systems Builder",
  description:
    "Levon Zhao builds production AI systems across anomaly detection, agentic workflows, data platforms, evaluation, and deployment.",
  path: "/",
});

export default function Home() {
  return (
    <Container>
      <section className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-[#f5f1e8] px-5 pb-6 pt-14 shadow-[0_24px_70px_-48px_rgba(15,23,42,0.45)] sm:px-8 sm:pb-8 sm:pt-8 lg:px-10 lg:py-10">
        <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(#94a3b8_0.65px,transparent_0.65px)] [background-size:22px_22px]" />
        <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-sky-300/20 blur-3xl" />

        <div className="relative grid items-center gap-10 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div>
            <p className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-sky-800">
              <IconSparkles size={13} />
              AI Engineering · Data Systems · Evaluation
            </p>
            <h1 className="mt-5 max-w-2xl text-[2.85rem] font-semibold leading-[0.96] tracking-[-0.065em] text-slate-950 sm:text-6xl lg:text-[4.25rem]">
              I build AI systems from signal to production.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              AI engineer focused on anomaly detection, agentic workflows, LLM
              evaluation, and production data platforms—designed around clear,
              measurable outcomes.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="#flagship-work"
                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
              >
                View flagship work
                <IconArrowRight size={16} />
              </Link>
              <Link
                href="/chat"
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/80 px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:text-sky-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              >
                Talk to my AI companion
              </Link>
            </div>
          </div>

          <HeroSignalConsole />
        </div>
      </section>

      <FlagshipProjects />
      <Certifications />

      <section className="mt-12 border-t border-slate-200 pt-6">
        <Link
          href="/legacy"
          className="group inline-flex items-center gap-3 rounded-xl text-sm text-slate-500 transition hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
        >
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-800 ring-1 ring-amber-200">
            <IconArchive size={17} />
          </span>
          <span>
            Looking for the original site?{" "}
            <span className="font-semibold text-slate-700 group-hover:text-slate-950">
              Open the Legacy Blog
            </span>
          </span>
          <IconArrowRight
            size={15}
            className="transition group-hover:translate-x-1"
          />
        </Link>
      </section>
    </Container>
  );
}
