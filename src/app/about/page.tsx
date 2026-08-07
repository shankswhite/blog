import { Container } from "@/components/Container";
import About from "@/components/About";
import { PageHeader } from "@/components/PageHeader";
import { createPageMetadata } from "@/lib/siteMetadata";

export const metadata = createPageMetadata({
  title: "About",
  description:
    "Meet Levon Zhao, a game designer turned software engineer working across AI, games, and interactive systems.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <Container>
      <PageHeader
        eyebrow="About"
        title="From game systems to intelligent software."
        description={
          <p>
            I connect design intuition, quantitative evidence, and engineering
            craft to build systems people can understand and feel.
          </p>
        }
      />
      <About />
    </Container>
  );
}
