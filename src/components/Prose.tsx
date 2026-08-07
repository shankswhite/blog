import clsx from "clsx";

export function Prose({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        className,
        "prose prose-slate max-w-[70ch] text-base prose-headings:tracking-[-0.025em] prose-headings:text-slate-950 prose-p:leading-8 prose-p:text-slate-700 prose-li:leading-7 prose-li:text-slate-700 prose-a:text-sky-700 prose-a:decoration-sky-300 prose-a:underline-offset-4"
      )}
    >
      {children}
    </div>
  );
}
