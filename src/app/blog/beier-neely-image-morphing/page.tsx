import Link from "next/link";
import { BlogLayout } from "@/components/BlogLayout";
import { MorphingShowcase } from "@/components/MorphingShowcase";
import { createPageMetadata } from "@/lib/siteMetadata";

const meta = {
  date: "2025-02-01",
  title: "Debugging a Beier-Neely Image Morph",
  description:
    "What 26 line pairs, five transformation studies, and several coordinate bugs taught me about image warping.",
  image: "/media/morphing/miku-midpoint.jpg",
  tags: ["Computer Graphics", "C++", "Image Processing"],
};

export const metadata = createPageMetadata({
  title: meta.title,
  description: meta.description,
  path: "/blog/beier-neely-image-morphing",
  type: "article",
});

export default function Page() {
  return (
    <BlogLayout meta={meta}>
      <p>
        Beier-Neely morphing creates a smooth transition between two images by
        using corresponding line pairs as geometric constraints. Each
        intermediate frame interpolates those lines, warps both source images
        toward the new geometry, and then dissolves their color values.
      </p>
      <p>
        For the character study, I placed <strong>26 line pairs</strong> around
        the silhouette and important local features. More lines gave me control,
        but they also made errors easier to amplify.
      </p>

      <h2>The first bug was a coordinate convention</h2>
      <p>
        Eigen image matrices are addressed as rows and columns. The morphing
        equations are expressed in geometric x-y coordinates. I initially
        treated those conventions as interchangeable, which sent otherwise
        correct calculations into the wrong image axes.
      </p>
      <p>
        The fix was simple once the problem was visible: define one conversion
        boundary and keep every warp calculation in a consistent coordinate
        system.
      </p>

      <h2>Jitter came from integer conversion</h2>
      <p>
        The translated sequence shook vertically during its early frames.
        Changing line-pair length did not help, nor did adding more pairs for
        stabilization.
      </p>
      <p>
        The actual cause was inconsistent conversion from floating-point warp
        positions to integer pixels. Some paths truncated, others rounded, and
        boundary handling differed. A consistent <code>clamp</code> and rounding
        strategy produced the smoothest translation.
      </p>

      <h2>Linear interpolation won</h2>
      <p>
        I tried several strategies for generating intermediate line pairs,
        including sine-shaped blends. Linear interpolation produced the least
        distortion. It was also the easiest behavior to reason about while
        debugging—simple made the system more legible.
      </p>

      <h2>Imperfect results are still useful results</h2>
      <p>
        Translation became stable, while scale remained only moderately
        successful. Rotation moved in the opposite direction from the expected
        result, pointing to a remaining issue in the warp or position
        calculation.
      </p>
      <p>
        Those outputs remain in the case study. They document the boundary
        between what the implementation solved and what should be investigated
        next.
      </p>

      <MorphingShowcase />

      <p>
        <Link href="/projects/beier-neely-morphing">
          Read the structured project case study
        </Link>
        .
      </p>
    </BlogLayout>
  );
}
