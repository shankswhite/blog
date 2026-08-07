"use client";

import { useEffect, useState } from "react";

const studies = [
  {
    src: "/media/morphing/miku.mp4",
    title: "Miku → Tianyi",
    detail: "26 line pairs · character study",
  },
  {
    src: "/media/morphing/translate.mp4",
    title: "Translation",
    detail: "Stable after clamp + rounding fixes",
  },
  {
    src: "/media/morphing/translate_scale.mp4",
    title: "Translate + scale",
    detail: "Combined transformation test",
  },
  {
    src: "/media/morphing/scale.mp4",
    title: "2D scale",
    detail: "Warp behavior under scaling",
  },
  {
    src: "/media/morphing/rotate.mp4",
    title: "Rotation",
    detail: "An imperfect result that exposed a warp-direction issue",
  },
];

export function MorphingShowcase() {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return (
    <section className="mt-10" aria-labelledby="morphing-studies-title">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-700">
            Migrated experiment
          </p>
          <h2
            id="morphing-studies-title"
            className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-slate-950"
          >
            Five transformation studies
          </h2>
        </div>
        <p className="hidden text-right text-xs leading-5 text-slate-500 sm:block">
          155 source frames<br />compressed into lightweight video
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {studies.map((study, index) => (
          <figure
            key={study.src}
            className={`overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm ${
              index === 0 ? "md:col-span-2" : ""
            }`}
          >
            <div className={index === 0 ? "bg-slate-950 p-4 sm:p-6" : "bg-slate-100 p-3"}>
              <video
                src={study.src}
                autoPlay={!reduceMotion}
                controls={reduceMotion}
                muted
                loop
                playsInline
                preload="metadata"
                aria-label={`${study.title} morphing animation`}
                className={`mx-auto aspect-square rounded-2xl object-contain ${
                  index === 0 ? "max-h-[480px] bg-white" : "w-full bg-white"
                }`}
              />
            </div>
            <figcaption className="flex items-start justify-between gap-4 px-4 py-3.5">
              <span className="font-medium text-slate-900">{study.title}</span>
              <span className="max-w-[220px] text-right text-xs leading-5 text-slate-500">
                {study.detail}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
