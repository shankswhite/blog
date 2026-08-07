import { permanentRedirect } from "next/navigation";

export default function PathFindingRedirectPage() {
  permanentRedirect("/legacy/pathfinding");
}
