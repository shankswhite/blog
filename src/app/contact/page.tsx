import { Contact } from "@/components/Contact";
import { Container } from "@/components/Container";
import { Heading } from "@/components/Heading";
import { Paragraph } from "@/components/Paragraph";
import { createPageMetadata } from "@/lib/siteMetadata";

export const metadata = createPageMetadata({
  title: "Contact",
  description:
    "Get in touch with Levon Zhao - software engineer, game designer, and ML enthusiast.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <Container>
      <span className="text-4xl">✉️</span>
      <Heading className="font-black mb-2">Contact Me</Heading>
      <Paragraph className="mb-10 max-w-xl">
        Send a note with the form, or email me directly at{" "}
        <a
          href="mailto:zhao.levon@gmail.com"
          className="font-semibold text-sky-700 underline decoration-sky-300 underline-offset-4"
        >
          zhao.levon@gmail.com
        </a>
        .
      </Paragraph>
      <Contact />
    </Container>
  );
}
