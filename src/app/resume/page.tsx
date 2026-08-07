import { Container } from "@/components/Container";
import { Heading } from "@/components/Heading";
import { Highlight } from "@/components/Highlight";
import { Paragraph } from "@/components/Paragraph";
import { WorkHistory } from "@/components/WorkHistory";
import { createPageMetadata } from "@/lib/siteMetadata";

export const metadata = createPageMetadata({
  title: "Resume",
  description:
    "Levon Zhao's work history - game design, software development, and machine learning.",
  path: "/resume",
});

export default function ResumePage() {
  return (
    <Container>
      <span className="text-4xl">💼</span>
      <Heading className="font-black">Work History</Heading>
      <Paragraph className="max-w-xl mt-4">
        From game design to software engineering, exploring the intersection of{" "}
        <Highlight>AI and gaming</Highlight> while building impactful products.
      </Paragraph>
      <WorkHistory />
    </Container>
  );
}
