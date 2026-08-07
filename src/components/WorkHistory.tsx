import { timeline } from "@/constants/timeline";
import { IconCheck } from "@tabler/icons-react";

export function WorkHistory() {
  return (
    <section aria-labelledby="experience-heading">
      <div className="mb-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-700">
          Experience & education
        </p>
        <h2
          id="experience-heading"
          className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-3xl"
        >
          A timeline of systems, people, and practice.
        </h2>
      </div>

      <ol className="relative space-y-5 before:absolute before:bottom-8 before:left-[17px] before:top-8 before:w-px before:bg-slate-200 sm:before:left-[151px]">
        {timeline.map((item) => (
          <li
            key={`${item.company}-${item.title}`}
            id={
              item.company === "Activision Blizzard (Microsoft Gaming)"
                ? "activision"
                : undefined
            }
            className="relative grid scroll-mt-20 gap-3 pl-12 sm:grid-cols-[120px_minmax(0,1fr)] sm:gap-8 sm:pl-0"
          >
            <span className="absolute left-[10px] top-7 z-10 h-4 w-4 rounded-full border-4 border-[#fffefa] bg-sky-600 shadow-sm sm:left-[144px]" />
            <time className="pt-1 text-xs font-semibold leading-5 text-slate-500 sm:pt-7 sm:text-right">
              {item.date}
            </time>
            <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-700">
                    {item.category}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold tracking-[-0.025em] text-slate-950 sm:text-xl">
                    {item.company}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {item.title}
                  </p>
                  {item.location && (
                    <p className="mt-1 text-xs text-slate-500">
                      {item.location}
                    </p>
                  )}
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                {item.description}
              </p>
              <ul className="mt-4 space-y-2.5">
                {item.responsibilities.map((responsibility) => (
                  <li
                    key={responsibility}
                    className="flex items-start gap-2.5 text-sm leading-6 text-slate-600"
                  >
                    <span className="mt-1 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sky-700">
                      <IconCheck size={11} stroke={2.5} />
                    </span>
                    <span>{responsibility}</span>
                  </li>
                ))}
              </ul>
            </article>
          </li>
        ))}
      </ol>
    </section>
  );
}
