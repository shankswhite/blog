import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentMarkdown } from "@/components/ContentMarkdown";
import { ProjectDetail } from "@/components/ProjectDetail";
import {
  getNotionProjectBySlug,
  getProjectCards,
  getStaticProjectBySlug,
} from "@/lib/content";
import { createPageMetadata } from "@/lib/siteMetadata";
import type { Product } from "@/types/products";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getProjectCards().map((project) => ({ slug: project.slug }));
}

function notionProjectToProduct(
  project: NonNullable<ReturnType<typeof getNotionProjectBySlug>>
): Product {
  return {
    title: project.title,
    description: project.description,
    slug: project.slug,
    stack: project.stack,
    eyebrow: project.category,
    year: project.year,
    accent: project.accent,
    coverUrl: project.coverUrl,
    href: project.externalUrl,
    actionLabel:
      project.actionLabel ??
      (project.externalUrl ? "Open project link" : undefined),
    content: <ContentMarkdown markdown={project.markdown} />,
  };
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const notionProject = getNotionProjectBySlug(slug);
  const project = notionProject ?? getStaticProjectBySlug(slug);

  if (!project) return { title: "Project not found" };

  return createPageMetadata({
    title: project.title,
    description: project.description,
    path: `/projects/${project.slug}`,
    image: notionProject?.coverUrl,
    modifiedTime: notionProject?.lastEditedAt,
  });
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const notionProject = getNotionProjectBySlug(slug);
  const project = notionProject
    ? notionProjectToProduct(notionProject)
    : getStaticProjectBySlug(slug);

  if (!project) notFound();

  return <ProjectDetail project={project} />;
}
