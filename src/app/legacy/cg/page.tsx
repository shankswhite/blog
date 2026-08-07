import { LegacyGraphicsIndex } from "@/components/legacy-classic/LegacyGraphics";
import { createPageMetadata } from "@/lib/siteMetadata";

export const metadata = createPageMetadata({
  title: "Computer Graphics — Legacy Blog",
  description:
    "The Computer Graphics project index preserved from Levon Zhao's previous blog.",
  path: "/legacy/cg",
});

export default function LegacyComputerGraphicsPage() {
  return <LegacyGraphicsIndex />;
}
