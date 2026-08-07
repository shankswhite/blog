export type Blog = {
  title: string;
  description: string;
  date: string;
  slug: string;
  href: string;
  image?: string;
  tags: string[];
  lastModified?: string;
  source: "local" | "notion";
};
