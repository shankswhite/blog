import Link from "next/link";
import { Blogs } from "@/components/Blogs";
import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import { getWritingCards } from "@/lib/content";
import { createPageMetadata } from "@/lib/siteMetadata";

export const metadata = createPageMetadata({
  title: "Levon Blog — Research & Engineering Notes",
  absoluteTitle: true,
  description:
    "Read Levon Blog by Levon Zhao: hands-on research notes and engineering postmortems on AI, computer graphics, games, and production systems.",
  path: "/blog",
});

export default async function Blog() {
  const writing = await getWritingCards();

  return (
    <Container>
      <PageHeader
        eyebrow="Research & engineering notes"
        title="Levon Blog"
        description={
          <p>
            Research notes and honest postmortems by{" "}
            <Link
              href="/about"
              className="font-medium text-slate-800 underline decoration-slate-300 underline-offset-4 transition hover:text-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              Levon Zhao
            </Link>{" "}
            on AI, computer graphics, and the systems behind games and software.
          </p>
        }
      />

      {writing.length > 0 ? (
        <Blogs blogs={writing} />
      ) : (
        <p className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
          No published notes yet.
        </p>
      )}
    </Container>
  );
}
