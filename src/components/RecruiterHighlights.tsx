import Link from "next/link";
import {
  IconActivityHeartbeat,
  IconArrowRight,
  IconMessageChatbot,
  IconMicroscope,
} from "@tabler/icons-react";

const evidence = [
  {
    title: "Live-service anomaly detection",
    description:
      "Activision Blizzard: PB-scale monitoring for 50+ KPIs; 40%+ lower analyst response latency.",
    href: "/projects/live-service-anomaly-detection",
    action: "Case study",
    icon: IconActivityHeartbeat,
    tone: "sky",
  },
  {
    title: "YOLO-KAN research",
    description:
      "First-author IEEE CAI 2025 research; +1.84 pp precision with fewer layers.",
    href: "/projects/yolo-kan",
    action: "Research",
    icon: IconMicroscope,
    tone: "rose",
  },
  {
    title: "Portfolio AI Companion",
    description:
      "Bilingual, source-linked navigation across my work—live without sign-in.",
    href: "/chat",
    action: "Try it",
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
                <h3 className="text-sm font-semibold leading-5 tracking-[-0.015em] text-slate-950">
                  {item.title}
                </h3>
              </div>

              <p className="mt-3 text-xs leading-5 text-slate-600">
                {item.description}
              </p>

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
