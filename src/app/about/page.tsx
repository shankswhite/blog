import { Container } from "@/components/Container";
import { Heading } from "@/components/Heading";
import About from "@/components/About";
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
      <span className="text-4xl">💬</span>
      <Heading className="font-black">About Me</Heading>
      <About />
    </Container>
  );
}
