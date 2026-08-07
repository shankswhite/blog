/** @type {import('next').NextConfig} */
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig = {
  outputFileTracingRoot: projectRoot,
  async redirects() {
    return [
      { source: "/yolo-kan", destination: "/projects/yolo-kan", permanent: true },
      { source: "/yolo", destination: "/projects/yolo-kan", permanent: true },
      {
        source: "/cg/Morphing",
        destination: "/projects/beier-neely-morphing",
        permanent: true,
      },
      {
        source: "/cg/RayTracing",
        destination: "/projects",
        permanent: true,
      },
      {
        source: "/cg",
        destination: "/projects/beier-neely-morphing",
        permanent: true,
      },
      { source: "/chatbot", destination: "/chat", permanent: true },
      { source: "/ml4t", destination: "/projects/ml-trading", permanent: true },
      { source: "/unity", destination: "/projects/climbing-game", permanent: true },
      { source: "/recipe", destination: "/projects/recipe-app", permanent: true },
      { source: "/mahjong", destination: "/projects/mahjong", permanent: true },
      {
        source: "/qa",
        destination: "/projects",
        permanent: true,
      },
      {
        source: "/os",
        destination: "/projects",
        permanent: true,
      },
      {
        source: "/cgame",
        destination: "https://github.com/shankswhite/CS5008GroupProject",
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
