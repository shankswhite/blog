/* eslint-disable @next/next/no-img-element -- the image is the fallback inside the preserved PDF viewer. */

import styles from "./LegacyYolo.module.scss";

const posterPdf = "/media/research/levon-yolo-kan-poster.pdf";

export function LegacyYolo() {
  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <h1>YOLO-KAN: A Computer Vision Architecture for Real-Time Object Detection</h1>
        <p>A Novel Approach based on KAN Networks</p>
      </header>

      <div className={styles.pdfContainer}>
        <object
          className={styles.pdfViewer}
          data={`${posterPdf}#toolbar=0&navpanes=0&view=FitH`}
          type="application/pdf"
          aria-label="YOLO-KAN research poster PDF"
        >
          <a href={posterPdf} target="_blank" rel="noopener noreferrer">
            <img
              src="/media/research/yolo-kan-poster.jpg"
              alt="YOLO-KAN research poster showing the architecture, ablation results, metrics, and activation heatmaps"
            />
          </a>
        </object>
      </div>
    </section>
  );
}
