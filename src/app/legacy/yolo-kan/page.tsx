import type { Metadata } from "next";
import { LegacyYolo } from "@/components/legacy-classic/LegacyYolo";

export const metadata: Metadata = {
  title: "YOLO-KAN — Legacy Blog",
  description:
    "The original YOLO-KAN research-poster viewer preserved inside Levon's Legacy Blog.",
  alternates: { canonical: "/legacy/yolo-kan" },
};

export default function LegacyYoloPage() {
  return <LegacyYolo />;
}
