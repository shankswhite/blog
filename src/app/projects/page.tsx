import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import { Products } from "@/components/Products";
import { createPageMetadata } from "@/lib/siteMetadata";

export const metadata = createPageMetadata({
  title: "Projects",
  description:
    "Selected AI research, interactive algorithms, computer graphics, games, and full-stack projects by Levon Zhao.",
  path: "/projects",
});

export default function Projects() {
  return (
    <Container>
      <PageHeader
        eyebrow="Selected work"
        title="Projects with a point of view."
        description={
          <p>
            Research, games, and software experiments shaped by a game
            designer&apos;s instinct for systems, feedback, and player-facing
            clarity.
          </p>
        }
      />
      <Products />
    </Container>
  );
}
