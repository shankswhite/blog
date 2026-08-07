import { Container } from "@/components/Container";
import { Heading } from "@/components/Heading";
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
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-700">
        Selected work
      </p>
      <Heading className="mt-3 font-black">Projects with a point of view.</Heading>
      <p className="mb-10 mt-4 max-w-2xl text-base leading-7 text-slate-600">
        Research, games, and software experiments shaped by a game designer&apos;s
        instinct for systems, feedback, and player-facing clarity.
      </p>
      <Products />
    </Container>
  );
}
