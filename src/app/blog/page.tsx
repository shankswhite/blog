import { Blogs } from "@/components/Blogs";
import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import { getWritingCards } from "@/lib/content";
import { createPageMetadata } from "@/lib/siteMetadata";

export const metadata = createPageMetadata({
  title: "Writing",
  description:
    "Research notes and engineering postmortems on AI, computer graphics, games, and production systems.",
  path: "/blog",
});

export default async function Blog() {
  const writing = await getWritingCards();

  return (
    <Container>
      <PageHeader
        eyebrow="Field notes"
        title="Writing from the workbench."
        description={
          <p>
            Research notes and honest postmortems on AI, computer graphics, and
            the systems behind games and software.
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
