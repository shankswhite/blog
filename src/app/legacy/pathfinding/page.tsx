import Link from "next/link";
import { IconArrowUpRight } from "@tabler/icons-react";
import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import PathFindingComponent from "@/components/PathFinding/PathFindingComponent";
import { createPageMetadata } from "@/lib/siteMetadata";

export const metadata = createPageMetadata({
  title: "Pathfinding Lab — Legacy Blog",
  description:
    "The migrated, browser-local pathfinding lab comparing Dijkstra and A* on a 20 by 20 grid, with the old JPS control preserved as a documented compatibility mode.",
  path: "/legacy/pathfinding",
});

export default function LegacyPathfindingPage() {
  return (
    <Container>
      <PageHeader
        eyebrow="Legacy Blog / Interactive Lab"
        title="Watch a search become a route."
        description={
          <p>
            The original interactive grid is preserved without its old cloud
            dependency. Dijkstra and A* now run entirely in the browser; the
            former JPS control remains as a clearly labeled A* compatibility
            mode rather than silently calling the retired service.
          </p>
        }
        aside={
          <Link
            href="/legacy/projects/pathfinding"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-sky-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            Read project note
            <IconArrowUpRight size={15} />
          </Link>
        }
      />
      <PathFindingComponent />
    </Container>
  );
}
