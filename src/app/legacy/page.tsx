import type { Metadata } from "next";
import { LegacyClassicHome } from "@/components/legacy-classic/LegacyClassicHome";

export const metadata: Metadata = {
  title: "Levon's AllBlue — Legacy Blog",
  description:
    "The original Levon's AllBlue portfolio, preserved inside the new site.",
  alternates: { canonical: "/legacy" },
};

export default function LegacyPage() {
  return <LegacyClassicHome />;
}
