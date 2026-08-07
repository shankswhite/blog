import Image from "next/image";
import Link from "next/link";
import { IconArrowRight, IconSparkles } from "@tabler/icons-react";
import { Certifications } from "@/components/Certifications";
import { Container } from "@/components/Container";
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

          <div className="relative mx-auto w-full max-w-[320px]">
            <div className="absolute -inset-3 rotate-3 rounded-[36px] bg-gradient-to-br from-sky-500 to-violet-600 opacity-80" />
            <div className="relative overflow-hidden rounded-[32px] border border-white/70 bg-slate-950 shadow-2xl">
              <div className="relative h-[360px]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_55%_30%,#38bdf8_0,transparent_35%),linear-gradient(155deg,#0f172a_20%,#312e81_100%)]" />
                <div className="absolute inset-x-0 bottom-0 h-3/4 bg-[linear-gradient(125deg,transparent_35%,rgba(255,255,255,.12)_36%,rgba(255,255,255,.12)_43%,transparent_44%)]" />
                <Image
                  src="/images/levon-portrait.png"
                  alt="Portrait of Levon Zhao"
                  fill
                  priority
                  sizes="(max-width: 1024px) 320px, 320px"
                  className="z-10 object-contain object-bottom"
                />
                <div className="absolute inset-x-4 bottom-4 z-20 rounded-2xl border border-white/15 bg-slate-950/75 p-4 text-white backdrop-blur-xl">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-300">
                    Current focus
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    AI systems · games · visual computing
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <dl className="relative mt-10 grid gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 sm:grid-cols-3">
          {[
            ["2019–22", "Senior game design"],
            ["3", "AI / graphics labs"],
            ["2", "AWS certifications"],
          ].map(([value, label]) => (
            <div key={label} className="bg-white/85 px-4 py-4 backdrop-blur-sm">
              <dt className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">
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
