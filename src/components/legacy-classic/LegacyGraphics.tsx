"use client";

/* eslint-disable @next/next/no-img-element -- this route intentionally preserves the original CG page's plain image slideshow. */

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./LegacyGraphics.module.scss";

const FRAME_COUNT = 31;
const FRAME_INTERVAL_MS = 100;

const studies = [
  {
    folder: "miku",
    title: "Miku && Tianyi",
    alt: "Miku and Tianyi character morphing",
  },
  {
    folder: "translate",
    title: "F_translated",
    alt: "Beier-Neely translation test",
  },
  {
    folder: "translate_scale",
    title: "F_translated_scale",
    alt: "Beier-Neely translation and scale test",
  },
  {
    folder: "scale",
    title: "F_scale_2d",
    alt: "Beier-Neely two-dimensional scale test",
  },
  {
    folder: "rotate",
    title: "F_rotated",
    alt: "Beier-Neely rotation test",
  },
] as const;

function frameSource(folder: string, frame: number) {
  return `/legacy-original/CG/BeierNeely/${folder}/output_${String(frame).padStart(2, "0")}.jpg`;
}

export function LegacyGraphicsIndex() {
  const articles = [
    {
      title: "Beier Neely Morphing",
      summary:
        "Beier Neely Morphing is a technique to create a smooth transition between two images.",
      publishDate: "2025-02-01",
      href: "/legacy/cg/morphing",
    },
    {
      title: "Ray Tracing Demo",
      summary: "Ray Tracing Project",
      publishDate: "2025-02-02",
      href: "/legacy/cg/ray-tracing",
    },
  ] as const;

  return (
    <div className={`${styles.page} ${styles.indexPage}`}>
      <h1>Computer Graphics Projects</h1>
      <div className={styles.articleList}>
        {articles.map((article) => (
          <Link
            key={article.href}
            href={article.href}
            className={styles.articleCard}
          >
            <div className={styles.articleContent}>
              <h2>{article.title}</h2>
              <p className={styles.summary}>{article.summary}</p>
              <time className={styles.publishDate} dateTime={article.publishDate}>
                {article.publishDate}
              </time>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function LegacyMorphingStudy() {
  const [currentFrame, setCurrentFrame] = useState(0);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) return;

    const interval = window.setInterval(() => {
      setCurrentFrame((frame) => (frame + 1) % FRAME_COUNT);
    }, FRAME_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, []);

  const imageFor = (folder: string) => frameSource(folder, currentFrame);

  return (
    <article className={`${styles.page} ${styles.morphingPage}`}>
      <h1>Beier Neely Morphing</h1>
      <h2>{studies[0].title}</h2>
      <div className={styles.imageContainer}>
        <img
          src={imageFor(studies[0].folder)}
          alt={`${studies[0].alt}, frame ${currentFrame + 1} of ${FRAME_COUNT}`}
        />
      </div>
      <p className={styles.description}>
        I just tried two times since I applied 26 Line Pairs for transform the
        image. The result is ...good except the leg part. There is a little
        ghosting effect on the left leg. I have tried using different number
        of line pairs (ex: only 1 line for each leg, or 8 lines for each leg),
        the results are nearly the same.
      </p>
      <div className={styles.longFormCopy}>
        <p>
          In this project, I understood and implemented the core concepts of the
          Beier-Neely Morphing algorithm. This algorithm introduces one or more
          intermediate frame Line Pairs to find the position of each pixel in
          the target image within the intermediate frame, and then performs
          color dissolve to achieve the morphing effect.
        </p>
        <p>
          About LinePairs. I chose different LinePairs for different
          transformation effects and recorded the data in the record.xlsx file.
          For the humanoid (miku) figure transformation, I selected 26 LinePairs
          to achieve the effect.
        </p>
        <p>
          About the algorithm. As the authors said, color dissolve is the
          easiest part. It only requires proportional color value distribution
          based on the intermediate frame. The difficult part is how to find
          the intermediate frame&apos;s LinePairs and how to warp based on these
          LinePairs.
        </p>
        <p>
          For generating intermediate frame LinePairs, I tried multiple blending
          methods, including linear, sine, and some similar ones. In the end, I
          found that the linear method worked best with the least distortion.
          Simple makes beautiful, right?
        </p>
        <p>
          In the construction of the warp function, I encountered many
          challenges. First, I spent about an hour just to realize the coordinate
          mismatch issue. The Eigen matrix&apos;s coordinate distribution is more
          like the traditional computer science format, where row represents the
          row, and col represents the column. However, in the algorithm&apos;s
          computation, it uses geometric coordinates, which are the opposite of
          Eigen&apos;s format.
        </p>
        <p>
          Second, I noticed an abnormal shaking issue in the intermediate frames
          during morphing. This problem was caused by inconsistent ways of
          converting double format coordinates to int format during computation.
          In the end, I used clamp together with the floor function to fix this
          problem.
        </p>
        <p>
          Finally, my function performed well in translation morphing, but only
          moderately well in scaling, and had an unexpected rotation direction
          issue in rotation morphing. I ruled out the possibility of errors in
          intermediate frame LinePair generation and the Dissolve function, so I
          suspect that this was caused by the warp function. I even feel that it
          might be due to a bias in the implementation of getPosition. Since I
          spent too much time on this without making progress, I decided to use
          my current algorithm to create a similar morphing effect for my
          favorite anime characters Miku and Tianyi. Although it doesn&apos;t look
          perfect, I am really happy.
        </p>
      </div>

      <h2>{studies[1].title}</h2>
      <div className={styles.imageContainer}>
        <img
          src={imageFor(studies[1].folder)}
          alt={`${studies[1].alt}, frame ${currentFrame + 1} of ${FRAME_COUNT}`}
        />
      </div>
      <p className={styles.description}>
        In my initial attempts, the first half of the animation would show
        up-and-down shaking. Initially, I guessed it was due to the line pair
        length, but after multiple adjustments, we found no difference. Then
        we tried various ways to optimize: including adding multiple line
        pairs for stabilization, using different algorithms to calculate the
        coordinates endpoint of intermediate line pairs. Finally, we found
        that after adjusting the std::clamp algorithm and changing the warp
        coordinate calculation to rounding method, we achieved the smoothest
        effect.
      </p>

      {studies.slice(2, 4).map((study) => (
        <div className={styles.sequenceFragment} key={study.folder}>
          <h2>{study.title}</h2>
          <div className={styles.imageContainer}>
            <img
              src={imageFor(study.folder)}
              alt={`${study.alt}, frame ${currentFrame + 1} of ${FRAME_COUNT}`}
            />
          </div>
          <p className={styles.description} />
        </div>
      ))}

      <h2>{studies[4].title}</h2>
      <div className={styles.imageContainer}>
        <img
          src={imageFor(studies[4].folder)}
          alt={`${studies[4].alt}, frame ${currentFrame + 1} of ${FRAME_COUNT}`}
        />
      </div>
      <p className={styles.description}>
        I have tried different implementation for warp coordinate calculation,
        but the result is still not perfect. The rotation direction is opposite
        to the expected direction.
      </p>
    </article>
  );
}

export function LegacyRayTracingRecord() {
  return (
    <div className={`${styles.page} ${styles.rayPage}`}>
      <Link href="/legacy/cg" className={styles.backLink}>
        ← Computer Graphics Projects
      </Link>

      <section className={styles.rayRecord}>
        <p className={styles.recordLabel}>Legacy archive record</p>
        <h1>Ray Tracing Demo</h1>
        <p className={styles.rayLead}>Ray Tracing Project</p>
        <div className={styles.missingPanel}>
          <span className={styles.missingMark} aria-hidden="true">
            !
          </span>
          <div>
            <h2>The original implementation is missing.</h2>
            <p>
              The previous Computer Graphics page linked to a dynamic
              <code> RayTracing </code> component, but that component, its
              article, and its render assets are not present in the deployed
              repository. The old button therefore opened a broken route.
            </p>
            <p>
              This working archive page preserves the original project entry
              without inventing results that were never published.
            </p>
          </div>
        </div>
        <div className={styles.rayActions}>
          <Link href="/legacy/cg" className={styles.primaryAction}>
            Back to Computer Graphics
          </Link>
          <Link href="/legacy/cg/morphing" className={styles.secondaryAction}>
            Open Beier-Neely Morphing
          </Link>
        </div>
      </section>
    </div>
  );
}
