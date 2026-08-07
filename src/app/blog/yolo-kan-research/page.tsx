import Link from "next/link";
import { BlogLayout } from "@/components/BlogLayout";
import { createPageMetadata } from "@/lib/siteMetadata";

const meta = {
  date: "2024-12-08",
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
});

export default function Page() {
  return (
    <BlogLayout meta={meta}>
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
        strongest configuration, KAN-2-5, reached <strong>65.83%</strong>, while
        KAN-2-7 produced the highest mAP@50 at <strong>54.48%</strong>. Across the
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
