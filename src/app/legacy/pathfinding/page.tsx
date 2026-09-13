import PathFindingComponent from "@/components/PathFinding/PathFindingComponent";
import { createPageMetadata } from "@/lib/siteMetadata";

export const metadata = createPageMetadata({
  title: "Pathfinding — Legacy Blog",
  description:
    "The original 20 by 20 pathfinding interface, restored with browser-local Dijkstra, A*, and JPS-compatible controls.",
  path: "/legacy/pathfinding",
});

export default function LegacyPathfindingPage() {
  return (
    <>
      <h1 className="px-4 pt-6 text-2xl font-bold leading-snug sm:px-8">
        Pathfinding Lab
      </h1>
      <PathFindingComponent />
    </>
  );
}
