import Link from "next/link";
import {
  IconArchive,
  IconArrowRight,
  IconBrandLinkedin,
  IconFileDescription,
  IconMail,
} from "@tabler/icons-react";
import { Certifications } from "@/components/Certifications";
import { Container } from "@/components/Container";
import { RecruiterHighlights } from "@/components/RecruiterHighlights";
import { createPageMetadata } from "@/lib/siteMetadata";

export const metadata = createPageMetadata({
  title: "AI / ML Engineer",
  description:
    "Levon Zhao is an AI / ML engineer working across frontier-model evaluation, production anomaly detection, agentic analytics, and computer-vision research.",
  path: "/",
});

const proofPoints = [
  { value: "PB-scale", label: "anomaly-detection pipeline" },
  { value: "50+", label: "live-service KPIs monitored" },
  { value: "40%+", label: "lower analyst response latency" },
  { value: "IEEE CAI 2025", label: "first-author publication" },
];

export default function Home() {
  return (
    <Container>
      <section className="border-b border-slate-200 pb-8 pt-4 lg:pt-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-700">
          Levon Zhao · AI / ML Engineer
        </p>

        <h1 className="mt-4 max-w-4xl text-[2.3rem] font-semibold leading-[1.03] tracking-[-0.055em] text-slate-950 sm:text-5xl xl:text-6xl">
          I build production AI systems that turn noisy data into decisions.
        </h1>

        <p className="mt-4 max-w-4xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
          Currently an <strong className="font-semibold text-slate-800">AI Fellow</strong>{" "}
          at <strong className="font-semibold text-slate-800">Handshake AI</strong>,
          evaluating frontier LLMs. Previously built PB-scale anomaly detection
          and agentic analytics as a Data Science (AI Systems) Intern at{" "}
          <strong className="font-semibold text-slate-800">
            Activision Blizzard (Microsoft Gaming)
          </strong>
          .
        </p>

        <div className="mt-6 flex flex-col items-start gap-2.5 sm:flex-row sm:items-center">
          <div className="flex flex-wrap gap-3">
            <Link
              href="/resume"
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
            >
              <IconFileDescription size={16} />
              View résumé
            </Link>
            <Link
              href="mailto:zhao.levon@gmail.com"
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-sky-300 hover:text-sky-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              <IconMail size={16} />
              Email me
            </Link>
          </div>
          <Link
            href="https://linkedin.com/in/levonzhao"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2 py-2 text-sm font-semibold text-slate-500 transition hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            <IconBrandLinkedin size={16} />
            LinkedIn
          </Link>
        </div>

        <dl className="mt-7 grid grid-cols-2 border-y border-slate-200 md:grid-cols-4">
          {proofPoints.map((point, index) => (
            <div
              key={point.label}
              className={`flex flex-col px-3 py-3.5 sm:px-4 md:border-t-0 xl:px-5 ${
                index % 2 === 1 ? "border-l border-slate-200" : ""
              } ${index > 1 ? "border-t border-slate-200" : ""} ${
                index > 0 ? "md:border-l" : ""
              }`}
            >
              <dt className="order-2 mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                {point.label}
              </dt>
              <dd className="order-1 text-lg font-semibold tracking-[-0.035em] text-slate-950">
                {point.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <Certifications className="mt-5" />
      <RecruiterHighlights />

      <section className="mt-10 flex flex-col gap-4 border-t border-slate-200 pt-7 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-700">
            Education · 2026
          </p>
          <div className="mt-1 space-y-1">
            <h2 className="text-sm font-semibold text-slate-950 sm:text-base">
              Georgia Tech · M.S. Computer Science, Artificial Intelligence
            </h2>
            <p className="text-xs text-slate-500 sm:text-sm">
              Northeastern University · M.S. Computer Science
            </p>
          </div>
        </div>
        <Link
          href="/resume"
          className="group inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-sky-700 transition hover:text-sky-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
        >
          Full background in résumé
          <IconArrowRight
            size={14}
            className="transition group-hover:translate-x-0.5"
          />
        </Link>
      </section>

      <div className="mt-7">
        <Link
          href="/legacy"
          className="group inline-flex items-center gap-2 text-xs text-slate-500 transition hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
        >
          <IconArchive size={15} className="text-amber-700" />
          Original site: <span className="font-semibold">Legacy Blog</span>
          <IconArrowRight
            size={13}
            className="transition group-hover:translate-x-0.5"
          />
        </Link>
      </div>
    </Container>
  );
}
