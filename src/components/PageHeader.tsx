import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  aside,
}: {
  eyebrow: string;
  title: string;
  description: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <header className="mb-10 grid items-end gap-6 border-b border-slate-200 pb-8 md:grid-cols-[minmax(0,1fr)_auto]">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-700">
          {eyebrow}
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-[0.98] tracking-[-0.055em] text-slate-950 sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        <div className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
          {description}
        </div>
      </div>
      {aside && <div className="md:pb-1">{aside}</div>}
    </header>
  );
}
