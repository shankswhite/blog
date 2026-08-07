import { LegacyMorphingStudy } from "@/components/legacy-classic/LegacyGraphics";
import { createPageMetadata } from "@/lib/siteMetadata";

export const metadata = createPageMetadata({
  title: "Beier-Neely Morphing — Legacy Blog",
  description:
    "The original five-sequence Beier-Neely morphing study, preserved with all 155 frames.",
  path: "/legacy/cg/morphing",
});

export default function LegacyMorphingPage() {
  return <LegacyMorphingStudy />;
}
