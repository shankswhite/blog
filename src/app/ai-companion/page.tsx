import { CompanionPage } from "@/components/companion/CompanionPage";
import { createPageMetadata } from "@/lib/siteMetadata";

export const metadata = createPageMetadata({
  title: "AI Companion",
  description:
    "Explore Levon Zhao's game design, AI research, software projects, and experience through a source-linked portfolio companion.",
  path: "/ai-companion",
});

export default function AiCompanionPage() {
  return <CompanionPage />;
}
