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
  metrics?: ProjectMetric[];
  content: React.ReactNode;
};
