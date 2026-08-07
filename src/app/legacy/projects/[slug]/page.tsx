import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetail } from "@/components/ProjectDetail";
import { legacyProducts } from "@/constants/products";
import { createPageMetadata } from "@/lib/siteMetadata";

type LegacyProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return legacyProducts.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: LegacyProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = legacyProducts.find((item) => item.slug === slug);

  if (!project) return { title: "Legacy project not found" };

  const metadata = createPageMetadata({
    title: `${project.title} — Legacy Blog`,
    description: `A preserved project record from Levon Zhao's previous portfolio: ${project.description}`,
    path: `/legacy/projects/${project.slug}`,
  });

  return {
    ...metadata,
    alternates: { canonical: `/projects/${project.slug}` },
    robots: { index: false, follow: true },
  };
}

export default async function LegacyProjectPage({ params }: LegacyProjectPageProps) {
  const { slug } = await params;
  const project = legacyProducts.find((item) => item.slug === slug);

  if (!project) notFound();

  return (
    <ProjectDetail
      project={project}
      backHref="/legacy"
      backLabel="Legacy Blog"
      legacy
    />
  );
}
