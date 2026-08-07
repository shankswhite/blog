export interface BlogMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  image: string;
  tags: string[];
}

const blogs: BlogMeta[] = [
  {
    slug: "beier-neely-image-morphing",
    title: "Debugging a Beier-Neely Image Morph",
    description:
      "What 26 line pairs, five transformation studies, and several coordinate bugs taught me about image warping.",
    date: "2025-02-01",
    image: "/media/morphing/miku-midpoint.jpg",
    tags: ["Computer Graphics", "C++", "Image Processing"],
  },
  {
    slug: "yolo-kan-research",
    title: "YOLO-KAN: What the Ablation Experiments Taught Me",
    description:
      "Introducing Kolmogorov-Arnold Network modules into YOLO11n and testing the architectural trade-offs.",
    date: "2024-12-08",
    image: "/media/research/yolo-kan-poster.jpg",
    tags: ["Computer Vision", "KAN", "YOLO", "Research"],
  },
];

export async function getAllBlogs(): Promise<BlogMeta[]> {
  return [...blogs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}
