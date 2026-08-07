import type { MetadataRoute } from "next";
import { products } from "@/constants/products";
import { getAllBlogs } from "../../lib/getAllBlogs";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://levon.blog";
  const blogs = await getAllBlogs();
  const staticRoutes = [
    "",
    "/about",
    "/projects",
    "/pathfinding",
    "/blog",
    "/chat",
    "/resume",
    "/contact",
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: route === "" ? ("weekly" as const) : ("monthly" as const),
      priority: route === "" ? 1 : 0.7,
    })),
    ...products.map((project) => ({
      url: `${baseUrl}/projects/${project.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...blogs.map((blog) => ({
      url: `${baseUrl}/blog/${blog.slug}`,
      lastModified: new Date(blog.date),
      changeFrequency: "yearly" as const,
      priority: 0.75,
    })),
  ];
}
