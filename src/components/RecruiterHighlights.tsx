import Link from "next/link";
import {
  IconActivityHeartbeat,
  IconArrowRight,
  IconMessageChatbot,
  IconMicroscope,
} from "@tabler/icons-react";

const roleFit = [
  {
    label: "Applied ML",
    detail: "Python · PyTorch · anomaly detection · computer vision",
  },
  {
    label: "LLM systems",
    detail: "Evaluation · RAG · LangGraph · MCP",
  },
  {
    label: "Data",
    detail: "SQL · Databricks · Azure · Airflow",
  },
  {
    label: "Deployment",
    detail: "AWS · Kubernetes · GitHub Actions",
  },
];

const evidence = [
  {
    eyebrow: "AI Systems Internship · Activision Blizzard",
    title: "Live-service anomaly detection",
    description:
      "Anomaly detection and agentic investigation for production analytics on Databricks and Azure.",
    result: "Only intern project selected · 2025 Xbox Game Studios Summit",
    href: "/resume#activision",
    action: "View experience",
    icon: IconActivityHeartbeat,
    tone: "sky",
  },
  {
    eyebrow: "Computer vision research · IEEE CAI 2025",
    title: "YOLO-KAN computer vision research",
    description:
      "First-author work improving YOLO11n precision by 1.84 pp while reducing the architecture from 319 to 299 layers.",
    result: "200K images · 80 classes · ~10 ms phone-class",
    href: "/projects/yolo-kan",
    action: "Read research",
    icon: IconMicroscope,
    tone: "rose",
  },
  {
    eyebrow: "Live portfolio product",
    title: "Portfolio AI Companion",
    description:
      "A bilingual, source-linked guide across experience, research, and projects, built from curated knowledge.",
    result: "EN / 中文 · Source-linked · No sign-in",
    href: "/chat",
    action: "Try live demo",
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
    <>
      <section className="mt-8" aria-labelledby="role-fit-title">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <h2
            id="role-fit-title"
            className="text-sm font-semibold tracking-[-0.015em] text-slate-950"
          >
            AI engineering fit
          </h2>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            Skills grounded in work, research, and credentials
          </p>
        </div>
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[18px] border border-slate-200 bg-slate-200 lg:grid-cols-4">
          {roleFit.map((item) => (
            <article key={item.label} className="bg-[#fbfaf6] p-3.5">
              <h3 className="text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-700">
                {item.label}
              </h3>
              <p className="mt-2 text-xs leading-5 text-slate-600">
                {item.detail}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section id="selected-evidence" className="mt-9 scroll-mt-20" aria-labelledby="evidence-title">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-700">
              Selected evidence
            </p>
            <h2
              id="evidence-title"
              className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-3xl"
            >
              Work, research, and a live product.
            </h2>
          </div>
          <Link
            href="/projects"
            className="hidden items-center gap-1.5 text-xs font-semibold text-slate-500 transition hover:text-slate-950 sm:inline-flex"
          >
            All projects
            <IconArrowRight size={14} />
          </Link>
        </div>

        <div className="overflow-hidden rounded-[20px] border border-slate-200 bg-white">
          {evidence.map((item, index) => {
            const Icon = item.icon;

            return (
              <article
                key={item.title}
                className={`grid gap-4 p-4 sm:p-5 md:grid-cols-[minmax(0,1fr)_190px] md:items-center ${
                  index > 0 ? "border-t border-slate-200" : ""
                }`}
              >
                <div className="flex min-w-0 items-start gap-4">
                  <span
                    className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${toneClasses[item.tone]}`}
                  >
                    <Icon size={19} stroke={1.8} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                      {item.eyebrow}
                    </p>
                    <h3 className="mt-1.5 text-lg font-semibold tracking-[-0.025em] text-slate-950">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-600">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="pl-14 md:pl-0">
                  <p className="text-xs font-semibold leading-5 text-slate-700">
                    {item.result}
                  </p>
                  <Link
                    href={item.href}
                    className="group mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700 transition hover:text-sky-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                  >
                    {item.action}
                    <IconArrowRight
                      size={14}
                      className="transition group-hover:translate-x-0.5"
                    />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        <Link
          href="/projects"
          className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 transition hover:text-slate-950 sm:hidden"
        >
          View all projects
          <IconArrowRight size={14} />
        </Link>
      </section>
    </>
  );
}
