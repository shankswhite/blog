const signals = [
  { label: "Research", value: "04", position: "left-1 top-12" },
  { label: "Systems", value: "05", position: "right-0 top-5" },
  { label: "Games", value: "02", position: "bottom-2 right-5" },
];

export function HeroSignalConsole() {
  return (
    <div
      className="relative mx-auto w-full max-w-[360px]"
      role="img"
      aria-label="Abstract portfolio navigation signal representing research, software systems, and games"
    >
      <div className="absolute -inset-3 rotate-3 rounded-[36px] bg-gradient-to-br from-sky-500 via-indigo-500 to-violet-600 opacity-85" />
      <div className="relative overflow-hidden rounded-[32px] border border-white/70 bg-slate-950 p-5 text-white shadow-2xl sm:p-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_48%_45%,rgba(56,189,248,.28),transparent_28%),linear-gradient(145deg,#020617_12%,#172554_58%,#312e81_100%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.35)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.35)_1px,transparent_1px)] [background-size:28px_28px]" />
        <div className="pointer-events-none absolute -left-20 top-24 h-px w-[480px] -rotate-[28deg] bg-gradient-to-r from-transparent via-sky-300/70 to-transparent" />

        <div className="relative flex items-center justify-between gap-4 text-[9px] font-semibold uppercase tracking-[0.19em] text-sky-200/70">
          <span>Portfolio signal / 01</span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2 py-1 text-emerald-200">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300 motion-reduce:animate-none" />
            Signal online
          </span>
        </div>

        <div className="relative mt-5 h-[236px] sm:h-[250px]" aria-hidden="true">
          <div className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-sky-200/20" />
          <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rotate-12 rounded-[36%] border border-violet-200/25" />
          <div className="absolute left-1/2 top-1/2 h-px w-[86%] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-sky-200/35 to-transparent" />
          <div className="absolute left-1/2 top-1/2 h-[86%] w-px -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-transparent via-sky-200/25 to-transparent" />

          <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[20px] border border-white/40 bg-white/10 shadow-[0_0_52px_rgba(56,189,248,.35)] backdrop-blur-sm">
            <div className="absolute inset-3 rounded-[12px] border border-sky-200/45 bg-sky-300/15" />
            <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_18px_rgba(255,255,255,.9)]" />
          </div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <p className="text-[8px] font-semibold uppercase tracking-[0.2em] text-slate-950">
              Levon
            </p>
          </div>

          {signals.map((signal) => (
            <div
              key={signal.label}
              className={`absolute ${signal.position} min-w-[88px] rounded-xl border border-white/15 bg-slate-950/65 px-3 py-2 shadow-lg backdrop-blur-md`}
            >
              <span className="block text-[8px] font-semibold uppercase tracking-[0.18em] text-sky-200/60">
                {signal.label}
              </span>
              <span className="mt-0.5 block text-lg font-semibold tracking-[-0.05em] text-white">
                {signal.value}
              </span>
            </div>
          ))}
        </div>

        <div className="relative border-t border-white/10 pt-4">
          <div className="flex items-center justify-between gap-3 text-[9px] font-semibold uppercase tracking-[0.16em] text-white/50">
            <span>Projects</span>
            <span>Skills</span>
            <span>Research</span>
          </div>
          <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-sky-400 via-cyan-300 to-violet-400" />
          </div>
          <p className="mt-3 text-[10px] leading-4 text-sky-100/60">
            Mapping research, software systems, and playable ideas into one
            evolving portfolio.
          </p>
        </div>
      </div>
    </div>
  );
}
