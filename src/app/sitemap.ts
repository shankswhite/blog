import type { MetadataRoute } from "next";
import { legacyProducts, products } from "@/constants/products";
import { getAllBlogs } from "../../lib/getAllBlogs";
import { getNotionBlogs } from "../../lib/notion";
import { siteUrl } from "@/lib/siteUrl";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogs = await getAllBlogs();
  const notionBlogs = await getNotionBlogs();
  const staticRoutes = [
    "",
    "/about",
    "/projects",
    "/blog",
    "/chat",
    "/resume",
    "/contact",
    "/legacy",
    "/legacy/computer-graphics",
    "/legacy/ai-chatbot",
    "/legacy/pathfinding",
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: route === "" ? ("weekly" as const) : ("monthly" as const),
      priority: route === "" ? 1 : 0.7,
    })),
    ...products.map((project) => ({
      url: `${siteUrl}/projects/${project.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...legacyProducts.map((project) => ({
      url: `${siteUrl}/legacy/projects/${project.slug}`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    ...blogs.map((blog) => ({
      url: `${siteUrl}/blog/${blog.slug}`,
      lastModified: new Date(blog.date),
      changeFrequency: "yearly" as const,
      priority: 0.75,
    })),
    ...notionBlogs.map((blog) => ({
      url: `${siteUrl}/blog/notion/${blog.slug}`,
      lastModified: new Date(blog.date),
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}
