import Link from "next/link";
import {
  IconActivityHeartbeat,
  IconArrowRight,
  IconMessageChatbot,
} from "@tabler/icons-react";

const anomalyMetrics = [
  ["PB-scale", "data pipeline"],
  ["50+", "live-service KPIs"],
  ["40%+", "lower response latency"],
];

export function FlagshipProjects() {
  return (
    <section id="flagship-work" className="mt-16 scroll-mt-20" aria-labelledby="flagship-title">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div className="max-w-2xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-sky-700">
            Flagship work
          </p>
          <h2
            id="flagship-title"
            className="mt-2 text-3xl font-semibold tracking-[-0.045em] text-slate-950 sm:text-4xl"
          >
            AI systems with measurable outcomes.
          </h2>
        </div>
        <Link
          href="/projects"
          className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-slate-500 transition hover:text-slate-950 sm:inline-flex"
        >
          All projects
          <IconArrowRight size={15} />
        </Link>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Link
          href="/resume#activision"
          aria-label="Read the Activision Blizzard anomaly-detection experience"
          className="group relative flex flex-col overflow-hidden rounded-[28px] border border-slate-800 bg-slate-950 p-6 text-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_55px_-34px_rgba(15,23,42,0.8)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 sm:p-7 xl:min-h-[430px]"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(14,165,233,.18),transparent_35%)]" />
          <div className="relative flex items-center justify-between gap-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.19em] text-sky-300">
              Activision Blizzard · Microsoft Gaming
            </p>
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-300/15 bg-sky-300/10 text-sky-200">
              <IconActivityHeartbeat size={20} stroke={1.7} />
            </span>
          </div>

          <div className="relative mt-7">
            <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-slate-400">
              Production AI · Data platform
            </p>
            <h3 className="mt-2 max-w-md text-3xl font-semibold leading-[1.05] tracking-[-0.05em] sm:text-[2.2rem]">
              Live-service anomaly detection.
            </h3>
            <p className="mt-4 max-w-md text-sm leading-6 text-slate-300">
              A Databricks and Azure pipeline paired with an agentic
              investigation workflow for faster, repeatable analysis.
            </p>
          </div>

          <div className="relative mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.045] p-4">
            <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              <span>Live-service signal</span>
              <span>Anomaly detected</span>
            </div>
            <svg
              viewBox="0 0 420 86"
              className="mt-3 h-[86px] w-full"
              aria-hidden="true"
              preserveAspectRatio="none"
            >
              <path
                d="M0 63 C40 61 42 55 78 57 S132 69 164 55 S216 62 247 52 S287 13 312 34 S347 63 420 42"
                fill="none"
                stroke="rgb(125 211 252)"
                strokeWidth="3"
                vectorEffect="non-scaling-stroke"
              />
              <path
                d="M0 63 C40 61 42 55 78 57 S132 69 164 55 S216 62 247 52 S287 13 312 34 S347 63 420 42 L420 86 L0 86 Z"
                fill="url(#signal-fill)"
              />
              <circle cx="287" cy="13" r="5" fill="rgb(251 113 133)" />
              <defs>
                <linearGradient id="signal-fill" x1="0" x2="0" y1="0" y2="1">
                  <stop stopColor="rgb(56 189 248)" stopOpacity=".22" />
                  <stop offset="1" stopColor="rgb(56 189 248)" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <dl className="relative mt-auto grid grid-cols-3 gap-2 pt-6">
            {anomalyMetrics.map(([value, label]) => (
              <div key={label} className="flex flex-col">
                <dt className="order-2 mt-0.5 text-[10px] uppercase leading-4 tracking-[0.1em] text-slate-400">
                  {label}
                </dt>
                <dd className="order-1 text-lg font-semibold tracking-[-0.035em] text-white">
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          <span className="relative mt-6 inline-flex items-center gap-2 text-xs font-semibold text-sky-300">
            Read the experience
            <IconArrowRight
              size={15}
              className="transition group-hover:translate-x-1"
            />
          </span>
        </Link>

        <Link
          href="/chat"
          aria-label="Open the Portfolio AI Companion"
          className="group relative flex flex-col overflow-hidden rounded-[28px] border border-sky-200 bg-sky-50 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_55px_-34px_rgba(14,116,144,0.38)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 sm:p-7 xl:min-h-[430px]"
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-sky-300/25 blur-3xl" />
          <div className="relative flex items-center justify-between gap-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.19em] text-sky-800">
              Portfolio AI Companion
            </p>
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-sky-700 shadow-sm ring-1 ring-sky-200">
              <IconMessageChatbot size={20} stroke={1.7} />
            </span>
          </div>

          <div className="relative mt-7">
            <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-sky-700/65">
              AI product · Information experience
            </p>
            <h3 className="mt-2 max-w-md text-3xl font-semibold leading-[1.05] tracking-[-0.05em] text-slate-950 sm:text-[2.2rem]">
              Ask the portfolio. Follow the evidence.
            </h3>
            <p className="mt-4 max-w-md text-sm leading-6 text-slate-600">
              A bilingual, source-linked guide to the work—built from curated
              project knowledge and available without sign-in.
            </p>
          </div>

          <div className="relative mx-auto mt-8 w-full max-w-sm space-y-2.5 rounded-[22px] border border-sky-200 bg-white/75 p-4 shadow-sm backdrop-blur-sm">
            <div className="ml-auto max-w-[78%] rounded-2xl rounded-br-sm bg-slate-950 px-3.5 py-2.5 text-xs font-medium leading-5 text-white">
              What did you build at Activision?
            </div>
            <div className="max-w-[88%] rounded-2xl rounded-bl-sm border border-sky-100 bg-white px-3.5 py-2.5 text-xs leading-5 text-slate-700 shadow-sm">
              I can walk you through the system, outcomes, and supporting
              résumé evidence.
              <span className="mt-2 block text-[9px] font-semibold uppercase tracking-[0.14em] text-sky-700">
                Sources linked
              </span>
            </div>
          </div>

          <div className="relative mt-auto flex flex-wrap items-center gap-2 pt-6 text-[10px] font-semibold uppercase tracking-[0.13em] text-sky-800/70">
            <span className="rounded-full bg-white/80 px-2.5 py-1.5">EN / 中文</span>
            <span className="rounded-full bg-white/80 px-2.5 py-1.5">Source-linked</span>
            <span className="rounded-full bg-white/80 px-2.5 py-1.5">No sign-in</span>
          </div>

          <span className="relative mt-6 inline-flex items-center gap-2 text-xs font-semibold text-sky-800">
            Try the companion
            <IconArrowRight
              size={15}
              className="transition group-hover:translate-x-1"
            />
          </span>
        </Link>
      </div>

      <Link
        href="/projects"
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 transition hover:text-slate-950 sm:hidden"
      >
        View all projects
        <IconArrowRight size={15} />
      </Link>
    </section>
  );
}
