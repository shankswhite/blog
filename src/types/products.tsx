export type ProjectMetric = {
  value: string;
  label: string;
};

export type Product = {
  title: string;
  description: string;
  href?: string;
  actionLabel?: string;
  availabilityNote?: string;
  slug: string;
  stack: string[];
  eyebrow: string;
  year: string;
  accent: "red" | "sky" | "violet" | "amber" | "emerald" | "slate";
  coverUrl?: string;
  metrics?: ProjectMetric[];
  content: React.ReactNode;
};

export type ProjectCard = Omit<
  Product,
  "content" | "metrics" | "href" | "actionLabel" | "availabilityNote"
> & {
  coverUrl?: string;
  featured?: boolean;
  order?: number;
  lastModified?: string;
  source: "local" | "notion";
};
