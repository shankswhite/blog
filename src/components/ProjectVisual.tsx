import { twMerge } from "tailwind-merge";

const accentClasses = {
  red: "from-red-950 via-red-800 to-orange-500 text-red-50",
  sky: "from-slate-950 via-sky-950 to-sky-600 text-sky-50",
  violet: "from-slate-950 via-violet-950 to-fuchsia-700 text-violet-50",
  amber: "from-stone-950 via-amber-950 to-amber-600 text-amber-50",
  emerald: "from-slate-950 via-emerald-950 to-emerald-600 text-emerald-50",
  slate: "from-slate-950 via-slate-800 to-slate-500 text-slate-50",
};

export function ProjectVisual({
  slug,
  accent,
  className,
}: {
  slug: string;
  accent: keyof typeof accentClasses;
  className?: string;
}) {
  return (
    <div
      className={twMerge(
        "relative isolate min-h-[220px] overflow-hidden rounded-[24px] bg-gradient-to-br p-5",
        accentClasses[accent],
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.3)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.3)_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/15 blur-3xl" />
      <VisualContent slug={slug} />
    </div>
  );
}

function VisualContent({ slug }: { slug: string }) {
  if (slug === "yolo-kan") {
    return (
      <div className="relative flex h-full min-h-[180px] flex-col justify-between">
        <div className="flex items-start justify-between gap-4">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/65">
            Detection architecture
          </span>
          <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-medium">
            COCO
          </span>
        </div>
        <div className="grid grid-cols-[1fr_auto] items-end gap-4">
          <div>
            <p className="text-5xl font-semibold tracking-[-0.08em]">65.83</p>
            <p className="mt-1 text-xs text-white/65">best precision · KAN-2-5</p>
          </div>
          <div className="relative h-24 w-28 rounded-xl border border-white/30 bg-black/15">
            <span className="absolute left-3 top-3 h-9 w-10 border-2 border-amber-300" />
            <span className="absolute bottom-3 right-3 h-10 w-12 border-2 border-sky-300" />
            <span className="absolute left-10 top-10 h-7 w-8 border-2 border-white/70" />
          </div>
        </div>
      </div>
    );
  }

  if (slug === "pathfinding") {
    const path = new Set([1, 7, 8, 14, 20, 21, 22, 28, 34, 35]);
    const walls = new Set([3, 9, 10, 16, 17, 23, 25, 31]);
    return (
      <div className="relative flex min-h-[180px] items-center justify-between gap-5">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-sky-200/70">
            Search frontier
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-[-0.05em]">A* / JPS</p>
          <p className="mt-2 max-w-[150px] text-xs leading-5 text-sky-100/65">
            Watch an algorithm turn uncertainty into a route.
          </p>
        </div>
        <div className="grid h-36 w-36 shrink-0 grid-cols-6 gap-1 rounded-2xl border border-white/15 bg-black/20 p-3 shadow-inner">
          {Array.from({ length: 36 }).map((_, index) => (
            <span
              key={index}
              className={twMerge(
                "rounded-[3px] bg-white/10",
                walls.has(index) && "bg-slate-950",
                path.has(index) && "bg-amber-300 shadow-[0_0_12px_rgba(253,224,71,.55)]",
                index === 0 && "bg-emerald-400",
                index === 35 && "bg-rose-400"
              )}
            />
          ))}
        </div>
      </div>
    );
  }

  if (slug === "beier-neely-morphing") {
    return (
      <div className="relative flex min-h-[180px] flex-col justify-between">
        <div className="flex justify-between text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-100/65">
          <span>Source A</span>
          <span>26 line pairs</span>
          <span>Source B</span>
        </div>
        <div className="relative mx-auto h-28 w-56">
          <div className="absolute left-2 top-3 h-24 w-24 rounded-[38%_62%_48%_52%] border border-white/30 bg-cyan-300/45 shadow-[0_0_35px_rgba(103,232,249,.25)]" />
          <div className="absolute right-2 top-3 h-24 w-24 rounded-[62%_38%_52%_48%] border border-white/30 bg-fuchsia-300/45 shadow-[0_0_35px_rgba(240,171,252,.25)]" />
          <div className="absolute left-1/2 top-0 h-28 w-px -translate-x-1/2 rotate-12 bg-white/55" />
          <div className="absolute left-1/2 top-2 h-24 w-px -translate-x-1/2 -rotate-[32deg] bg-white/30" />
          <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/50 bg-white/20 backdrop-blur-sm" />
        </div>
        <p className="text-center text-xs text-violet-100/65">
          Warp geometry · dissolve color
        </p>
      </div>
    );
  }

  if (slug === "mahjong") {
    return (
      <div className="relative flex min-h-[180px] flex-col justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-100/65">
          Rule-driven game AI
        </p>
        <div className="flex items-center justify-center gap-2">
          {["東", "三", "發", "九"].map((tile, index) => (
            <span
              key={tile}
              className="flex h-20 w-14 items-center justify-center rounded-lg border-b-4 border-amber-200 bg-[#fff8e7] text-2xl font-semibold text-slate-900 shadow-xl"
              style={{ transform: `translateY(${index % 2 ? 5 : -3}px)` }}
            >
              {tile}
            </span>
          ))}
        </div>
        <p className="text-right text-xs text-amber-100/65">1 player · 3 opponents</p>
      </div>
    );
  }

  if (slug === "ml-trading") {
    const bars = [38, 54, 46, 72, 61, 92, 78, 118];
    return (
      <div className="relative flex min-h-[180px] flex-col justify-between">
        <div className="flex items-start justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-100/65">
            Policy evaluation
          </span>
          <span className="text-3xl font-semibold tracking-[-0.05em]">Q</span>
        </div>
        <div className="flex h-28 items-end gap-2 border-b border-white/20 pb-1">
          {bars.map((height, index) => (
            <span
              key={index}
              className="flex-1 rounded-t-sm bg-emerald-300/60"
              style={{ height }}
            />
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-emerald-100/60">
          <span>train</span>
          <span>test →</span>
        </div>
      </div>
    );
  }

  if (slug === "recipe-app") {
    return (
      <div className="relative flex min-h-[180px] items-center justify-center">
        <div className="w-full max-w-[250px] rounded-2xl border border-white/15 bg-black/20 p-3 shadow-2xl backdrop-blur-sm">
          {[
            ["01", "Collect"],
            ["02", "Cook"],
            ["03", "Share"],
          ].map(([number, label]) => (
            <div
              key={number}
              className="mb-2 flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 px-3 py-2 last:mb-0"
            >
              <span className="text-[10px] font-semibold text-amber-300">{number}</span>
              <span className="text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-[180px] flex-col justify-between">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60">
        Unity systems prototype
      </p>
      <div>
        <p className="text-6xl font-semibold tracking-[-0.09em] text-white/90">UP</p>
        <div className="mt-1 h-1.5 w-28 rounded-full bg-white/15">
          <div className="h-full w-3/4 rounded-full bg-sky-300" />
        </div>
      </div>
      <p className="text-xs text-white/60">climb · aim · iterate</p>
    </div>
  );
}
