"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const studies = [
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
            Warp field + four transformation studies
          </h2>
        </div>
        <p className="hidden text-right text-xs leading-5 text-slate-500 sm:block">
          Original abstract field<br />plus reconstructed tests
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <figure className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm md:col-span-2">
          <div className="bg-slate-950 p-4 sm:p-6">
            <Image
              src="/media/morphing/warp-study.png"
              alt="Abstract Beier-Neely line-pair warp field between two original geometric forms"
              width={960}
              height={640}
              sizes="(max-width: 768px) 100vw, 960px"
              className="mx-auto h-auto w-full max-w-[760px] rounded-2xl"
            />
          </div>
          <figcaption className="flex items-start justify-between gap-4 px-4 py-3.5">
            <span className="font-medium text-slate-900">Abstract warp field</span>
            <span className="max-w-[240px] text-right text-xs leading-5 text-slate-500">
              Original replacement visual · line-pair geometry at t = 0.50
            </span>
          </figcaption>
        </figure>

        {studies.map((study) => (
          <figure
            key={study.src}
            className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm"
          >
            <div className="bg-slate-100 p-3">
              <video
                src={study.src}
                autoPlay={!reduceMotion}
                controls
                muted
                loop
                playsInline
                preload="metadata"
                aria-label={`${study.title} morphing animation`}
                className="mx-auto aspect-square w-full rounded-2xl bg-white object-contain"
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

      <p className="mt-4 rounded-2xl border border-slate-200 bg-[#f5f1e8] p-4 text-xs leading-5 text-slate-600">
        Archive note: the old character source images are not republished
        because their original credit and publication license were not retained.
        The abstract field above was created for this archive; the four geometric
        videos preserve the implementation and debugging record without the
        third-party artwork.
      </p>
    </section>
  );
}
