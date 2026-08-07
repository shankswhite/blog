/** @type {import('next').NextConfig} */
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig = {
  outputFileTracingRoot: projectRoot,
  async redirects() {
    return [
      {
        source: "/yolo-kan",
        destination: "/legacy/projects/yolo-kan",
        permanent: true,
      },
      {
        source: "/yolo",
        destination: "/legacy/projects/yolo-kan",
        permanent: true,
      },
      {
        source: "/cg/Morphing",
        destination: "/legacy/projects/beier-neely-morphing",
        permanent: true,
      },
      {
        source: "/cg/RayTracing",
        destination: "/legacy/computer-graphics#ray-tracing",
        permanent: true,
      },
      {
        source: "/cg",
        destination: "/legacy/computer-graphics",
        permanent: true,
      },
      {
        source: "/morphing.html",
        destination: "/legacy/projects/beier-neely-morphing",
        permanent: true,
      },
      {
        source: "/CG/BeierNeely/:path*",
        destination: "/legacy/projects/beier-neely-morphing",
        permanent: true,
      },
      {
        source: "/Research/Levon_Poster.pdf",
        destination: "/media/research/levon-yolo-kan-poster.pdf",
        permanent: true,
      },
      { source: "/chatbot", destination: "/legacy/ai-chatbot", permanent: true },
      {
        source: "/ml4t",
        destination: "/legacy/projects/ml-trading",
        permanent: true,
      },
      {
        source: "/unity",
        destination: "/legacy/projects/climbing-game",
        permanent: true,
      },
      {
        source: "/recipe",
        destination: "/legacy/projects/recipe-app",
        permanent: true,
      },
      {
        source: "/mahjong",
        destination: "/legacy/projects/mahjong",
        permanent: true,
      },
      {
        source: "/qa",
        destination: "/legacy/projects/job-comparator",
        permanent: true,
      },
      {
        source: "/os",
        destination: "/legacy/projects/distributed-file-system",
        permanent: true,
      },
      {
        source: "/cgame",
        destination: "/legacy/projects/opengl-pathfinding-game",
        permanent: true,
      },
      { source: "/blog/clean-code", destination: "/blog", permanent: true },
      {
        source: "/blog/dark-mode-with-nextjs",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/blog/how-to-win-clients",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/blog/tailwindcss-tips-and-tricks",
        destination: "/blog",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
