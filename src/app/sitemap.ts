import type { MetadataRoute } from "next";
import { getProjectCards, getWritingCards } from "@/lib/content";
import { siteUrl } from "@/lib/siteUrl";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [writing, projects] = await Promise.all([
    getWritingCards(),
    Promise.resolve(getProjectCards()),
  ]);
  const staticRoutes = [
    "",
    "/about",
    "/projects",
    "/blog",
    "/chat",
    "/resume",
    "/contact",
    "/legacy",
    "/legacy/yolo-kan",
    "/legacy/cg",
    "/legacy/chatbot",
    "/legacy/pathfinding",
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route}`,
      changeFrequency: route === "" ? ("weekly" as const) : ("monthly" as const),
      priority: route === "" ? 1 : 0.7,
    })),
    ...projects.map((project) => ({
      url: `${siteUrl}/projects/${project.slug}`,
      ...(project.lastModified
        ? { lastModified: new Date(project.lastModified) }
        : {}),
      changeFrequency: "monthly" as const,
      priority: project.featured ? 0.85 : 0.7,
    })),
    ...writing.map((entry) => ({
      url: `${siteUrl}${entry.href}`,
      lastModified: new Date(entry.lastModified || entry.date),
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
  ];
}
