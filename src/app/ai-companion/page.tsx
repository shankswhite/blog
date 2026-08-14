import { AiCompanionExperience } from "@/components/ai-companion/AiCompanionExperience";
import { resolveCompanionTheme } from "@/lib/companion/theme";
import { createPageMetadata } from "@/lib/siteMetadata";

export const metadata = createPageMetadata({
  title: "AI Companion",
  description:
    "Meet Levon's interactive AI companion through an anime-inspired, story-driven experience.",
  path: "/ai-companion",
  image: {
    url: "/images/ai-companion/ai-companion-og.jpg",
    width: 1672,
    height: 941,
    alt: "KIRA Signal Deck AI companion interface with an original anime navigator",
  },
});

type AiCompanionPageProps = {
  searchParams: Promise<{ theme?: string | string[] }>;
};

export default async function AiCompanionPage({
  searchParams,
}: AiCompanionPageProps) {
  const requestedTheme = (await searchParams).theme;

  return (
    <AiCompanionExperience
      initialTheme={resolveCompanionTheme(requestedTheme)}
    />
  );
}
