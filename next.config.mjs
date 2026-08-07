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
        destination: "/legacy/yolo-kan",
        permanent: true,
      },
      {
        source: "/yolo",
        destination: "https://github.com/shankswhite/YOLOwithKAN",
        permanent: true,
      },
      {
        source: "/cg/Morphing",
        destination: "/legacy/cg/morphing",
        permanent: true,
      },
      {
        source: "/cg/morphing",
        destination: "/legacy/cg/morphing",
        permanent: true,
      },
      {
        source: "/cg/RayTracing",
        destination: "/legacy/cg/ray-tracing",
        permanent: true,
      },
      {
        source: "/cg",
        destination: "/legacy/cg",
        permanent: true,
      },
      {
        source: "/morphing.html",
        destination: "/legacy-original/morphing.html",
        permanent: true,
      },
      {
        source: "/CG/BeierNeely/:path*",
        destination: "/legacy-original/CG/BeierNeely/:path*",
        permanent: true,
      },
      {
        source: "/Research/Levon_Poster.pdf",
        destination: "/media/research/levon-yolo-kan-poster.pdf",
        permanent: true,
      },
      { source: "/chatbot", destination: "/legacy/chatbot", permanent: true },
      {
        source: "/ml4t",
        destination:
          "https://github.com/shankswhite/Machine-Learning-for-Trading-For-Sharing/tree/main",
        permanent: true,
      },
      {
        source: "/unity",
        destination: "https://github.com/shankswhite/CS6457---GDD",
        permanent: true,
      },
      {
        source: "/recipe",
        destination: "https://github.com/shankswhite/OnKitchen-Back-End",
        permanent: true,
      },
      {
        source: "/mahjong",
        destination: "https://github.com/shankswhite/MahjongCalculator",
        permanent: true,
      },
      {
        source: "/qa",
        destination: "https://github.com/shankswhite/CS6300-Group-Project",
        permanent: true,
      },
      {
        source: "/os",
        destination: "https://github.com/shankswhite/gios",
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
