import Link from "next/link";
import { IconArchive, IconArrowRight, IconSparkles } from "@tabler/icons-react";
import { Certifications } from "@/components/Certifications";
import { Container } from "@/components/Container";
import { HeroSignalConsole } from "@/components/HeroSignalConsole";
import { Products } from "@/components/Products";

export default function Home() {
  return (
    <Container>
      <section className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-[#f5f1e8] px-5 pb-6 pt-14 shadow-[0_24px_70px_-48px_rgba(15,23,42,0.45)] sm:px-8 sm:pb-8 sm:pt-8 lg:px-10 lg:py-10">
        <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(#94a3b8_0.7px,transparent_0.7px)] [background-size:20px_20px]" />
        <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-sky-300/25 blur-3xl" />

        <div className="relative grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-sky-800">
              <IconSparkles size={13} />
              Game design → software & AI
            </p>
            <h1 className="mt-6 max-w-2xl text-5xl font-semibold leading-[0.94] tracking-[-0.065em] text-slate-950 sm:text-6xl lg:text-7xl">
              I build systems people can feel.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              I&apos;m Levon Zhao—a game designer turned software engineer working
              across machine learning, interactive systems, and game
              development. I care about the feedback loop between an idea, its
              implementation, and the person using it.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
              >
                Explore the work
                <IconArrowRight size={16} />
              </Link>
              <Link
                href="/chat"
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/80 px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:text-sky-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              >
                Ask my AI companion
              </Link>
            </div>
          </div>

          <HeroSignalConsole />
        </div>

        <dl className="relative mt-10 grid gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 sm:grid-cols-3">
          {[
            ["2019–22", "Senior game design"],
            ["3", "AI / graphics labs"],
            ["2", "AWS certifications"],
          ].map(([value, label]) => (
            <div key={label} className="bg-white/85 px-4 py-4 backdrop-blur-sm">
              <dt className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                {label}
              </dt>
              <dd className="mt-1 text-xl font-semibold tracking-[-0.04em] text-slate-950">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <Certifications />

      <section className="mt-16 overflow-hidden rounded-[28px] border border-amber-200 bg-amber-50 p-5 shadow-sm sm:p-6">
        <div className="grid items-center gap-5 sm:grid-cols-[auto_minmax(0,1fr)_auto]">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-900">
            <IconArchive size={20} />
          </span>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-800">
              The original site, restored
            </p>
            <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em] text-slate-950">
              Open Levon&apos;s original Blog inside this portfolio.
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              The homepage, poster viewer, graphics experiments, pathfinding UI,
              and sign-in screen keep the old layout and controls. Retired cloud
              services remain safely disconnected.
            </p>
          </div>
          <Link
            href="/legacy"
            className="inline-flex items-center justify-center justify-self-start gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
          >
            Open Legacy Blog
            <IconArrowRight size={15} />
          </Link>
        </div>
      </section>

      <section className="mt-20">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-700">
              Selected work
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
              Projects with evidence.
            </h2>
          </div>
          <Link
            href="/projects"
            className="hidden items-center gap-1.5 text-sm font-semibold text-slate-500 transition hover:text-slate-950 sm:inline-flex"
          >
            View all
            <IconArrowRight size={15} />
          </Link>
        </div>
        <Products limit={4} />
      </section>
    </Container>
  );
}
