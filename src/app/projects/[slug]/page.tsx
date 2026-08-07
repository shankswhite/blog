import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetail } from "@/components/ProjectDetail";
import { products } from "@/constants/products";
import { createPageMetadata } from "@/lib/siteMetadata";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = products.find((item) => item.slug === slug);

  if (!project) return { title: "Project not found" };

  return createPageMetadata({
    title: project.title,
    description: project.description,
    path: `/projects/${project.slug}`,
  });
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = products.find((item) => item.slug === slug);

  if (!project) notFound();

  return <ProjectDetail project={project} />;
}
