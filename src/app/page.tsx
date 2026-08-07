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

export default function Home() {
  return (
    <Container>
      <section className="border-b border-slate-200 pb-8 pt-4 lg:pt-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-700">
          Levon Zhao · AI / ML Engineer
        </p>

        <h1 className="mt-4 max-w-4xl text-[2.3rem] font-semibold leading-[1.03] tracking-[-0.055em] text-slate-950 sm:text-5xl xl:text-6xl">
          I build production AI systems.
        </h1>

        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
          AI Fellow at Handshake AI, evaluating frontier models. Previously built
          anomaly detection and agentic analytics at Activision Blizzard.
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
      </section>

      <Certifications className="mt-5" />
      <RecruiterHighlights />

      <section className="mt-8 border-t border-slate-200 pt-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-700">
          Education
        </p>
        <p className="mt-1.5 text-sm font-semibold text-slate-800">
          Georgia Tech MSCS (AI) · Northeastern MSCS
        </p>
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
