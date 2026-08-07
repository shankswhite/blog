import { LegacyRayTracingRecord } from "@/components/legacy-classic/LegacyGraphics";
import { createPageMetadata } from "@/lib/siteMetadata";

export const metadata = createPageMetadata({
  title: "Ray Tracing Demo — Legacy Blog",
  description:
    "An honest archive record for the Ray Tracing entry whose implementation was missing from the previous blog repository.",
  path: "/legacy/cg/ray-tracing",
});

export default function LegacyRayTracingPage() {
  return <LegacyRayTracingRecord />;
}
