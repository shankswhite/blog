export interface BlogMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  lastModified?: string;
  image: string;
  tags: string[];
}

const blogs: BlogMeta[] = [
  {
    slug: "deferred-3d-avatar",
    title: "Deferring KIRA’s 3D Avatar Until the First Conversation",
    description:
      "How two React states defer KIRA’s WebGL avatar until first use, preserve it after closing, and make its lifecycle observable in the browser.",
    date: "2026-09-13",
    image: "/images/ai-companion/ai-companion-og.jpg",
    tags: ["React", "Next.js", "WebGL", "Performance"],
  },
  {
    slug: "beier-neely-image-morphing",
    title: "Debugging a Beier-Neely Image Morph",
    description:
      "What 26 line pairs, five transformation studies, and several coordinate bugs taught me about image warping.",
    date: "2025-02-01",
    lastModified: "2026-09-13",
    image: "/media/morphing/warp-study.png",
    tags: ["Computer Graphics", "C++", "Image Processing"],
  },
  {
    slug: "yolo-kan-research",
    title: "YOLO-KAN: What the Ablation Experiments Taught Me",
    description:
      "Introducing Kolmogorov-Arnold Network modules into YOLO11n and testing the architectural trade-offs.",
    date: "2024-12-08",
    lastModified: "2026-09-13",
    image: "/media/research/yolo-kan-poster.jpg",
    tags: ["Computer Vision", "KAN", "YOLO", "Research"],
  },
];

export async function getAllBlogs(): Promise<BlogMeta[]> {
  return [...blogs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}
