import {
  IconCloudComputing,
  IconDatabase,
  IconRobot,
} from "@tabler/icons-react";

const stages = [
  {
    label: "Data systems",
    detail: "Databricks · Azure",
    icon: IconDatabase,
  },
  {
    label: "Models & agents",
    detail: "PyTorch · RAG · LangGraph",
    icon: IconRobot,
  },
  {
    label: "Production",
    detail: "AWS · Kubernetes",
    icon: IconCloudComputing,
  },
];

export function HeroSignalConsole() {
  return (
    <aside
      className="relative mx-auto w-full max-w-[360px] overflow-hidden rounded-[28px] border border-slate-800 bg-slate-950 p-5 text-white shadow-[0_24px_60px_-32px_rgba(15,23,42,0.8)] sm:p-6"
      aria-label="AI engineering workflow"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_5%,rgba(56,189,248,.2),transparent_34%)]" />

      <div className="relative flex flex-wrap items-center justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-sky-300">
          End-to-end AI
        </p>
        <span className="inline-flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
          Production-minded
        </span>
      </div>

      <ol className="relative mt-5 space-y-2.5">
        {stages.map((stage, index) => {
          const Icon = stage.icon;

          return (
            <li
              key={stage.label}
              className="relative flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.055] p-3.5"
            >
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-300/15 bg-sky-300/10 text-sky-200">
                <Icon size={19} stroke={1.7} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold tracking-[-0.01em] text-white">
                  {stage.label}
                </span>
                <span className="mt-0.5 block text-[11px] leading-4 text-slate-400">
                  {stage.detail}
                </span>
              </span>
              <span className="font-mono text-[10px] text-white/40">
                0{index + 1}
              </span>
            </li>
          );
        })}
      </ol>

      <div className="relative mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
        <span>Design</span>
        <span className="h-px flex-1 bg-gradient-to-r from-transparent via-sky-400/40 to-transparent" />
        <span>Evaluate</span>
        <span className="h-px flex-1 bg-gradient-to-r from-transparent via-sky-400/40 to-transparent" />
        <span>Deploy</span>
      </div>
    </aside>
  );
}
