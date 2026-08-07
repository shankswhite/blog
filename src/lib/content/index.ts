import { getAllBlogs } from "../../../lib/getAllBlogs";
import { products } from "@/constants/products";
import type { Blog } from "@/types/blog";
import type { ProjectCard, Product } from "@/types/products";
import {
  getNotionProjects,
  getNotionWriting,
} from "@/lib/content/notion-cache";
import type { ProjectContent, WritingContent } from "@/types/content";

function newestFirst<T extends { date: string }>(left: T, right: T) {
  return Date.parse(right.date) - Date.parse(left.date);
}

const flagshipProjectSlugs = new Set([
  "live-service-anomaly-detection",
  "yolo-kan",
  "portfolio-companion",
]);

export async function getWritingCards(): Promise<Blog[]> {
  const local = (await getAllBlogs()).map<Blog>((entry) => ({
    ...entry,
    href: `/blog/${entry.slug}`,
    source: "local",
  }));
  const localSlugs = new Set(local.map(({ slug }) => slug));
  const notion = getNotionWriting().map<Blog>((entry) => {
    if (localSlugs.has(entry.slug)) {
      throw new Error(
        `Notion Writing slug "${entry.slug}" conflicts with a built-in article.`
      );
    }

    return {
      slug: entry.slug,
      title: entry.title,
      description: entry.description,
      date: entry.date,
      lastModified: entry.lastEditedAt,
      image: entry.coverUrl,
      tags: entry.tags,
      href: `/blog/${entry.slug}`,
      source: "notion",
    };
  });

  return [...local, ...notion].sort(newestFirst);
}

export function getNotionWritingBySlug(
  slug: string
): WritingContent | undefined {
  return getNotionWriting().find((entry) => entry.slug === slug);
}

function staticProjectCard(product: Product, index: number): ProjectCard {
  return {
    title: product.title,
    description: product.description,
    slug: product.slug,
    stack: product.stack,
    eyebrow: product.eyebrow,
    year: product.year,
    accent: product.accent,
    coverUrl: product.coverUrl,
    order: 100 + index,
    featured: flagshipProjectSlugs.has(product.slug),
    source: "local",
  };
}

function notionProjectCard(project: ProjectContent): ProjectCard {
  return {
    title: project.title,
    description: project.description,
    slug: project.slug,
    stack: project.stack,
    eyebrow: project.category,
    year: project.year,
    accent: project.accent,
    coverUrl: project.coverUrl,
    featured: project.featured,
    order: project.order,
    lastModified: project.lastEditedAt,
    source: "notion",
  };
}

export function getProjectCards(): ProjectCard[] {
  const notion = getNotionProjects();
  const notionBySlug = new Map(notion.map((project) => [project.slug, project]));

  const merged = products.map((product, index) => {
    const override = notionBySlug.get(product.slug);
    if (override) {
      notionBySlug.delete(product.slug);
      const card = notionProjectCard(override);
      return {
        ...card,
        order: override.order ?? 100 + index,
        featured: override.featured,
      };
    }
    return staticProjectCard(product, index);
  });

  const additions = Array.from(notionBySlug.values()).map(notionProjectCard);

  return [...merged, ...additions].sort((left, right) => {
    if (Boolean(left.featured) !== Boolean(right.featured)) {
      return left.featured ? -1 : 1;
    }

    const orderDifference =
      (left.order ?? Number.MAX_SAFE_INTEGER) -
      (right.order ?? Number.MAX_SAFE_INTEGER);
    if (orderDifference !== 0) return orderDifference;
    return left.title.localeCompare(right.title);
  });
}

export function getNotionProjectBySlug(
  slug: string
): ProjectContent | undefined {
  return getNotionProjects().find((entry) => entry.slug === slug);
}

export function getStaticProjectBySlug(slug: string): Product | undefined {
  return products.find((entry) => entry.slug === slug);
}
