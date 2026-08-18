import Link from "next/link";
import {
  IconArchive,
  IconArrowRight,
  IconFileTypePdf,
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

export default function Home() {
  return (
    <Container>
      <section className="pt-4 lg:pt-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-700">
          Levon Zhao · AI / ML Engineer
        </p>

        <h1 className="mt-4 max-w-4xl text-[2.3rem] font-semibold leading-[1.03] tracking-[-0.055em] text-slate-950 sm:text-5xl xl:text-6xl">
          I Focus on Game &amp; AI.
        </h1>

        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
          Part-time AI Fellow at{" "}
          <strong className="font-semibold text-slate-800">Handshake AI</strong>,
          evaluating frontier models. Previously built anomaly detection and
          agentic analytics at{" "}
          <strong className="font-semibold text-slate-800">
            Activision Blizzard
          </strong>.
        </p>

      </section>

      <Certifications className="mt-8" />
      <RecruiterHighlights />

      <section className="mt-8" aria-labelledby="education-title">
        <h2
          id="education-title"
          className="text-lg font-semibold tracking-[-0.025em] text-slate-950"
        >
          Education
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 sm:gap-6">
          <div>
            <p className="text-sm font-semibold text-slate-800">
              Georgia Tech MSCS (AI)
              <span className="ml-2 font-medium text-slate-500">
                GPA 3.88 / 4.00
              </span>
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              NVIDIA Sponsored Agentic AI · Artificial Intelligence · Game AI ·
              Game Design &amp; Development · GPU Hardware &amp; Software · Machine
              Learning for Trading
            </p>
            <Link
              href="/media/education/georgia-tech-mscs-degree-audit.pdf"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open Georgia Tech degree audit PDF"
              className="mt-1.5 inline-flex items-center gap-1.5 text-[11px] font-semibold text-sky-700 transition hover:text-sky-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              <IconFileTypePdf size={13} />
              Degree audit (PDF)
            </Link>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">
              Northeastern MSCS
              <span className="ml-2 font-medium text-slate-500">
                GPA 3.97 / 4.00
              </span>
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Data Visualization &amp; GenAI · Distributed Systems · Cloud Computing ·
              Deep Learning Research
            </p>
            <Link
              href="/media/education/northeastern-mscs-unofficial-transcript.pdf"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open Northeastern unofficial transcript PDF"
              className="mt-1.5 inline-flex items-center gap-1.5 text-[11px] font-semibold text-sky-700 transition hover:text-sky-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              <IconFileTypePdf size={13} />
              Unofficial transcript (PDF)
            </Link>
          </div>
        </div>
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
