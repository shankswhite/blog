import Image from "next/image";
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
  title,
  eyebrow,
  coverUrl,
  className,
}: {
  slug: string;
  accent: keyof typeof accentClasses;
  title?: string;
  eyebrow?: string;
  coverUrl?: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={twMerge(
        "relative isolate min-h-[220px] overflow-hidden rounded-[24px] bg-gradient-to-br p-4 sm:p-5",
        accentClasses[accent],
        className
      )}
    >
      {coverUrl ? (
        <>
          {coverUrl.startsWith("/") ? (
            <Image
              src={coverUrl}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 420px"
              className="object-cover"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={coverUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent" />
        </>
      ) : (
        <>
          <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.3)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.3)_1px,transparent_1px)] [background-size:28px_28px]" />
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/15 blur-3xl" />
          <VisualContent slug={slug} title={title} eyebrow={eyebrow} />
        </>
      )}
    </div>
  );
}

function VisualContent({
  slug,
  title,
  eyebrow,
}: {
  slug: string;
  title?: string;
  eyebrow?: string;
}) {
  if (slug === "live-service-anomaly-detection") {
    return (
      <div className="relative flex min-h-[180px] flex-col justify-between">
        <div className="flex items-center justify-between gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-100/70">
          <span>Live-service telemetry</span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2.5 py-1 text-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
            Production
          </span>
        </div>
        <div className="grid grid-cols-[1fr_auto] items-end gap-5">
          <div>
            <p className="text-4xl font-semibold tracking-[-0.07em] sm:text-5xl">
              50+
            </p>
            <p className="mt-1 text-xs text-emerald-100/65">
              monitored service KPIs
            </p>
          </div>
          <div className="flex h-20 items-end gap-1.5 rounded-xl border border-white/15 bg-black/15 px-3 py-2">
            {[28, 42, 35, 58, 48, 76, 46, 88].map((height, index) => (
              <span
                key={`${height}-${index}`}
                className={twMerge(
                  "w-2 rounded-sm bg-emerald-200/45",
                  index === 5 && "bg-amber-300",
                  index === 7 && "bg-emerald-300"
                )}
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.14em] text-emerald-100/55">
          <span>Detect</span>
          <span>Investigate</span>
          <span>Report</span>
        </div>
      </div>
    );
  }

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
            <p className="text-4xl font-semibold tracking-[-0.08em] sm:text-5xl">65.83</p>
            <p className="mt-1 text-xs text-white/65">best precision · KAN-2-5</p>
          </div>
          <div className="relative h-20 w-24 rounded-xl border border-white/30 bg-black/15 sm:h-24 sm:w-28">
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
      <div className="relative flex min-h-[180px] flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center sm:gap-5">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-sky-200/70">
            Search frontier
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-[-0.05em]">Dijkstra / A*</p>
          <p className="mt-2 max-w-[150px] text-xs leading-5 text-sky-100/65">
            Watch an algorithm turn uncertainty into a route.
          </p>
        </div>
        <div className="grid h-32 w-32 shrink-0 self-end grid-cols-6 gap-1 rounded-2xl border border-white/15 bg-black/20 p-3 shadow-inner sm:h-36 sm:w-36 sm:self-auto">
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

  if (slug === "portfolio-companion") {
    return (
      <div className="relative flex min-h-[180px] flex-col justify-between">
        <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.2em] text-sky-100/65">
          <span>Curated context</span>
          <span className="rounded-full border border-emerald-300/25 bg-emerald-300/10 px-2.5 py-1 text-emerald-200">
            EN / 中文
          </span>
        </div>
        <div className="mx-auto w-full max-w-[270px] space-y-2.5">
          <div className="ml-auto max-w-[78%] rounded-2xl rounded-br-sm bg-white px-3.5 py-2.5 text-xs font-medium text-slate-900 shadow-lg">
            What makes the work different?
          </div>
          <div className="max-w-[88%] rounded-2xl rounded-bl-sm border border-white/15 bg-white/10 px-3.5 py-2.5 text-xs leading-5 text-sky-50 backdrop-blur-sm">
            Systems thinking, linked to evidence.
            <div className="mt-2 flex gap-1.5">
              {['Research', 'Games', 'Code'].map((label) => (
                <span
                  key={label}
                  className="rounded-full border border-white/15 px-2 py-0.5 text-[9px] text-sky-100/70"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
        <p className="text-right text-[10px] uppercase tracking-[0.16em] text-sky-100/55">
          Answers → sources
        </p>
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
        <div className="flex items-center justify-center gap-1 sm:gap-2">
          {["東", "三", "發", "九"].map((tile, index) => (
            <span
              key={tile}
              className="flex h-16 w-12 items-center justify-center rounded-lg border-b-4 border-amber-200 bg-[#fff8e7] text-xl font-semibold text-slate-900 shadow-xl sm:h-20 sm:w-14 sm:text-2xl"
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

  if (slug === "opengl-pathfinding-game") {
    const route = new Set([0, 1, 7, 13, 14, 15, 21, 27, 28, 34, 35]);
    const obstacles = new Set([3, 9, 10, 16, 17, 23, 25, 31]);
    return (
      <div className="relative flex min-h-[180px] flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center sm:gap-5">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-100/65">
            Player vs agent
          </p>
          <p className="mt-3 font-mono text-3xl font-semibold tracking-[-0.05em]">
            C / GL
          </p>
          <p className="mt-2 max-w-[140px] text-xs leading-5 text-emerald-100/65">
            Place obstacles. Advance a round. Read the route.
          </p>
        </div>
        <div className="grid h-32 w-32 shrink-0 self-end grid-cols-6 gap-1 rounded-lg border-2 border-emerald-300/30 bg-black/35 p-3 shadow-inner sm:h-36 sm:w-36 sm:self-auto">
          {Array.from({ length: 36 }).map((_, index) => (
            <span
              key={index}
              className={twMerge(
                "border border-emerald-200/10 bg-emerald-300/10",
                obstacles.has(index) && "bg-amber-300/80",
                route.has(index) && "bg-emerald-300"
              )}
            />
          ))}
        </div>
      </div>
    );
  }

  if (slug === "distributed-file-system") {
    return (
      <div className="relative flex min-h-[180px] flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60">
            gRPC file service
          </span>
          <span className="font-mono text-xs text-sky-200">100 clients</span>
        </div>
        <div className="relative mx-auto h-28 w-full max-w-[270px]">
          <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-sky-300/30 bg-sky-300/15 p-3 text-center shadow-[0_0_35px_rgba(125,211,252,.18)]">
            <span className="block font-mono text-2xl font-semibold">FS</span>
            <span className="text-[9px] uppercase tracking-wider text-sky-100/60">
              server
            </span>
          </div>
          {[
            "left-0 top-1",
            "left-2 bottom-1",
            "right-0 top-1",
            "right-2 bottom-1",
          ].map((position, index) => (
            <div
              key={position}
              className={`absolute ${position} flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10 font-mono text-[10px]`}
            >
              C{index + 1}
            </div>
          ))}
          <span className="absolute left-[47px] top-[27px] h-px w-[62px] rotate-[19deg] bg-white/25" />
          <span className="absolute bottom-[27px] left-[49px] h-px w-[62px] -rotate-[19deg] bg-white/25" />
          <span className="absolute right-[47px] top-[27px] h-px w-[62px] -rotate-[19deg] bg-white/25" />
          <span className="absolute bottom-[27px] right-[49px] h-px w-[62px] rotate-[19deg] bg-white/25" />
        </div>
        <div className="flex justify-between text-[10px] text-white/55">
          <span>sync</span>
          <span>async</span>
        </div>
      </div>
    );
  }

  if (slug === "job-comparator") {
    return (
      <div className="relative flex min-h-[180px] flex-col justify-between">
        <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-100/65">
          <span>Offer matrix</span>
          <span>TDD</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            ["A", "92", "Best fit"],
            ["B", "84", "Runner-up"],
          ].map(([offer, score, label], index) => (
            <div
              key={offer}
              className={twMerge(
                "rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur-sm",
                index === 0 && "-translate-y-2 border-violet-200/35 bg-white/15"
              )}
            >
              <div className="flex items-center justify-between text-[10px] text-violet-100/60">
                <span>Offer {offer}</span>
                <span>{label}</span>
              </div>
              <p className="mt-3 text-3xl font-semibold tracking-[-0.06em]">{score}</p>
              <div className="mt-2 h-1.5 rounded-full bg-black/20">
                <div
                  className="h-full rounded-full bg-violet-200"
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <p className="text-right text-[10px] text-violet-100/55">
          compare · persist · verify
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-[180px] flex-col justify-between">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60">
        {eyebrow || "Project case study"}
      </p>
      <div>
        <p className="max-w-[15ch] text-3xl font-semibold leading-tight tracking-[-0.055em] text-white/90">
          {title || "Engineering work"}
        </p>
        <div className="mt-1 h-1.5 w-28 rounded-full bg-white/15">
          <div className="h-full w-3/4 rounded-full bg-sky-300" />
        </div>
      </div>
      <p className="text-xs text-white/60">design · build · evaluate</p>
    </div>
  );
}
