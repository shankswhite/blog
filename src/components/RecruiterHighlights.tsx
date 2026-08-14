import Link from "next/link";
import {
  IconActivityHeartbeat,
  IconArrowRight,
  IconMessageChatbot,
  IconMicroscope,
} from "@tabler/icons-react";

const evidence = [
  {
    title: "Microsoft Gaming AI Project",
    description:
      "At Activision Blizzard, built a PB-scale anomaly-detection and agent-assisted investigation system for 50+ live-service KPIs, reducing analyst response latency by 40%+. Productionized daily ML workflows from detection to reporting.",
    stack: ["Databricks", "Airflow", "RAG", "Agentic AI", "ML Workflow"],
    status: null,
    href: "/projects/live-service-anomaly-detection",
    action: "Case study",
    icon: IconActivityHeartbeat,
    tone: "sky",
  },
  {
    title: "YOLO-KAN Research",
    description:
      "First-authored an IEEE CAI 2025 short paper integrating KAN modules into YOLOv11n for Microsoft COCO object detection. The best KAN-2-5 configuration reached 65.83% precision (+1.84 pp over the 63.99% baseline) while reducing network depth from 319 to 299 layers.",
    stack: ["YOLOv11", "KAN", "PyTorch", "Microsoft COCO", "IEEE CAI 2025"],
    status: null,
    href: "/projects/yolo-kan",
    action: "Research",
    icon: IconMicroscope,
    tone: "rose",
  },
  {
    title: "AI Companion",
    description:
      "An English, source-linked voice and text companion that follows visitors across the portfolio and answers focused questions about my experience, research, and projects.",
    stack: ["Next.js", "LiveKit", "Gemini", "Voice AI", "Source-linked"],
    status: "LIVE",
    href: "/ai-companion",
    action: "Open companion",
    icon: IconMessageChatbot,
    tone: "violet",
  },
] as const;

const toneClasses = {
  sky: "bg-sky-50 text-sky-700",
  rose: "bg-rose-50 text-rose-700",
  violet: "bg-violet-50 text-violet-700",
};

export function RecruiterHighlights() {
  return (
    <section
      id="selected-evidence"
      className="mt-8 scroll-mt-20"
      aria-labelledby="evidence-title"
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2
          id="evidence-title"
          className="text-lg font-semibold tracking-[-0.025em] text-slate-950"
        >
          Selected work
        </h2>
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
        >
          All projects
          <IconArrowRight size={14} />
        </Link>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {evidence.map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.title}
              className="flex min-w-0 flex-col rounded-[18px] border border-slate-200 bg-white p-4"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${toneClasses[item.tone]}`}
                >
                  <Icon size={18} stroke={1.8} />
                </span>
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold leading-5 tracking-[-0.015em] text-slate-950">
                    {item.title}
                  </h3>
                  {item.status && (
                    <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-amber-800">
                      {item.status}
                    </span>
                  )}
                </div>
              </div>

              <p className="mt-3 text-xs leading-5 text-slate-600">
                {item.description}
              </p>

              {item.stack.length > 0 && (
                <ul
                  className="mt-3 flex flex-wrap gap-1.5"
                  aria-label={`${item.title} technology stack`}
                >
                  {item.stack.map((technology) => (
                    <li
                      key={technology}
                      className="rounded-full border border-sky-100 bg-sky-50 px-2 py-1 text-[10px] font-semibold leading-none text-sky-800"
                    >
                      {technology}
                    </li>
                  ))}
                </ul>
              )}

              <Link
                href={item.href}
                className="group mt-4 inline-flex w-fit items-center gap-1.5 text-xs font-semibold text-sky-700 transition hover:text-sky-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 md:mt-auto md:pt-4"
              >
                {item.action}
                <IconArrowRight
                  size={14}
                  className="transition group-hover:translate-x-0.5"
                />
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}
