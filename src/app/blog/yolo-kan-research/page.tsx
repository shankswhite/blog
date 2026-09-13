import Link from "next/link";
import { BlogLayout } from "@/components/BlogLayout";
import { createPageMetadata } from "@/lib/siteMetadata";

const meta = {
  date: "2024-12-08",
  modifiedDate: "2026-09-13",
  title: "YOLO-KAN: What the Ablation Experiments Taught Me",
  description:
    "A concise research note on introducing Kolmogorov-Arnold Network modules into YOLO11n, testing flatten strategies, and reading the resulting trade-offs.",
  image: "/media/research/yolo-kan-poster.jpg",
  tags: ["Computer Vision", "KAN", "YOLO", "Research"],
};

export const metadata = createPageMetadata({
  title: meta.title,
  description: meta.description,
  path: "/blog/yolo-kan-research",
  type: "article",
  publishedTime: meta.date,
  modifiedTime: meta.modifiedDate,
  image: meta.image,
  tags: meta.tags,
});

export default function Page() {
  return (
    <BlogLayout meta={meta} path="/blog/yolo-kan-research">
      <p>
        The goal of this research was deliberately narrow: <strong>improve YOLO11n
        accuracy while reducing network depth</strong>. Kolmogorov-Arnold Networks
        (KANs) were a promising candidate because they replace fixed node
        activations with learnable functions on edges, potentially extracting
        richer features without simply stacking more layers.
      </p>

      <h2>From an MLP block to a KAN block</h2>
      <p>
        I introduced KAN modules into the YOLO backbone, then compared several
        ways of serializing feature maps before they entered the KAN layer:
      </p>
      <ul>
        <li>depthwise flattening;</li>
        <li>max-pool flattening; and</li>
        <li>convolutional flattening with different kernel sizes.</li>
      </ul>
      <p>
        This detail mattered more than expected. The flatten structure
        materially changed both the accuracy curve and the spatial features
        emphasized by the detector.
      </p>

      <h2>What the experiments showed</h2>
      <p>
        The baseline YOLO11n reached <strong>63.99% precision</strong>. The
        highest-precision configuration, KAN-2-5, reached <strong>65.83%</strong>.
        In the full ablation table, KAN-1-7 produced the highest mAP@50 at
        <strong> 54.51%</strong>; KAN-2-7 reached <strong>54.48%</strong>. Across the
        experiments, the largest precision gain was <strong>1.84 percentage
        points</strong>.
      </p>
      <p>
        The simplified architecture also reduced the layer count from
        <strong> 319 to 299</strong>. That result supported the original
        hypothesis: the KAN structure could improve feature extraction without
        depending on a deeper network.
      </p>

      <h2>Heatmaps revealed the trade-off</h2>
      <p>
        The heatmaps made the model behavior easier to interpret. YOLO11n
        focused mainly on the train&apos;s most obvious features. KAN-2-5 attended to
        both the train and useful background context. With the larger KAN-2-7
        receptive field, attention spread further into non-primary regions.
      </p>
      <p>
        That made KAN-2-5 the best overall balance in this study—not because it
        won every metric, but because it improved accuracy without losing focus.
      </p>

      <h2>The practical lesson</h2>
      <p>
        Adding a new module is only the beginning of an architecture experiment.
        <strong> How data is reshaped before the module can determine whether the
        module works at all.</strong> In this project, flatten-layer design was as
        important as the KAN block itself.
      </p>

      <h2>Reading and reproducing the results</h2>
      <p>
        These figures are the observations reported in the original research
        poster for Microsoft COCO and YOLO11n. KAN-2-5 uses two KAN modules with
        a 5 × 5 convolutional flatten layer. Its precision gain came with
        <strong> 49.24% recall</strong>, compared with <strong>49.49%</strong> for
        the baseline. The poster also reports increased computational cost for
        the KAN variants despite their reduced layer count. Accuracy, recall,
        and computation therefore need to be assessed together.
      </p>
      <p>
        The <Link href="https://github.com/shankswhite/YOLOwithKAN">public
        YOLO-KAN repository</Link> contains model checkpoints and an entry point
        for evaluation. In the linked revision, <Link href="https://github.com/shankswhite/YOLOwithKAN/blob/0f5e5a1fd9f4979d5aaa737a9ded39ae22ed8dd3/val.py">val.py</Link> uses
        a 640-pixel image size, batch size 64, and JSON prediction export.
        Before rerunning, update the local dataset and checkpoint paths,
        verify the intended evaluation split, and review the <code>resume=True</code>{" "}
        setting in <Link href="https://github.com/shankswhite/YOLOwithKAN/blob/0f5e5a1fd9f4979d5aaa737a9ded39ae22ed8dd3/train.py">train.py</Link>.
        The checked-in <Link href="https://github.com/shankswhite/YOLOwithKAN/blob/0f5e5a1fd9f4979d5aaa737a9ded39ae22ed8dd3/ultralytics/cfg/datasets/coco.yaml">COCO configuration</Link>{" "}
        points both <code>train</code> and <code>val</code> to <code>train2017.txt</code>.
        This repository snapshot does not establish which split was used for
        the original poster. Reproducing that table requires confirming the
        original run configuration and matching checkpoints.
      </p>
      <p>
        <Link href="/projects/yolo-kan">
          Explore the project page and complete research poster
        </Link>
        , or{" "}
        <Link href="/media/research/levon-yolo-kan-poster.pdf">
          open the original PDF
        </Link>
        .
      </p>
    </BlogLayout>
  );
}
