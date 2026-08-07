import PathFindingComponent from "@/components/PathFinding/PathFindingComponent";
import { createPageMetadata } from "@/lib/siteMetadata";

export const metadata = createPageMetadata({
  title: "Pathfinding Visualizer",
  description:
    "Step through Dijkstra, A*, and Jump Point Search on an interactive 20 by 20 grid.",
  path: "/pathfinding",
});

export default function PathFindingPage() {
  return (
    <div className="w-full h-full overflow-auto bg-neutral-100 p-4">
      <PathFindingComponent />
    </div>
  );
}
