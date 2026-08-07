import { Container } from "@/components/Container";
import { Certifications } from "@/components/Certifications";
import { PageHeader } from "@/components/PageHeader";
import { WorkHistory } from "@/components/WorkHistory";
import { createPageMetadata } from "@/lib/siteMetadata";

export const metadata = createPageMetadata({
  title: "Resume",
  description:
    "Levon Zhao's work history - game design, software development, and machine learning.",
  path: "/resume",
});

export default function ResumePage() {
  return (
    <Container>
      <PageHeader
        eyebrow="Résumé"
        title="Experience built across disciplines."
        description={
          <p>
            Production AI systems, model evaluation, live-game analytics, and
            engineering work connected by a practical interest in measurable
            outcomes.
          </p>
        }
      />

      <section className="mb-16 grid gap-4 md:grid-cols-2">
        <article className="rounded-[24px] border border-slate-200 bg-[#f5f1e8] p-5 sm:p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-700">
            Production data lens
          </p>
          <h2 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-slate-950">
            Detect the signal, then make it actionable.
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Live-service KPIs, anomaly detection, cohort analysis, and automated
            reporting developed across game and AI product environments.
          </p>
        </article>
        <article className="rounded-[24px] border border-slate-800 bg-slate-950 p-5 text-white sm:p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-300">
            AI systems lens
          </p>
          <h2 className="mt-3 text-xl font-semibold tracking-[-0.03em]">
            Build the system and its evaluation loop.
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Databricks, Azure, Airflow, LangGraph, RAG, structured LLM
            evaluation, and production engineering—selected around the problem
            rather than a single stack.
          </p>
        </article>
      </section>

      <WorkHistory />
      <Certifications showAdditionalBackground />
    </Container>
  );
}
