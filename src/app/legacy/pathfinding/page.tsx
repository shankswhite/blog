import PathFindingComponent from "@/components/PathFinding/PathFindingComponent";
import { createPageMetadata } from "@/lib/siteMetadata";

export const metadata = createPageMetadata({
  title: "Pathfinding — Legacy Blog",
  description:
    "The original 20 by 20 pathfinding interface, restored with browser-local Dijkstra, A*, and JPS-compatible controls.",
  path: "/legacy/pathfinding",
});

export default function LegacyPathfindingPage() {
  return <PathFindingComponent />;
}
