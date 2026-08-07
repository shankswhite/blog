import type { Product } from "@/types/products";

export const products: Product[] = [
  {
    href: "https://github.com/shankswhite/YOLOwithKAN",
    actionLabel: "View source on GitHub",
    title: "YOLO-KAN",
    description:
      "Researching how Kolmogorov-Arnold Network modules can improve YOLO11n accuracy while reducing network depth.",
    stack: ["Python", "PyTorch", "YOLO11", "KAN"],
    slug: "yolo-kan",
    eyebrow: "ML Research",
    year: "2024",
    accent: "red",
    metrics: [
      { value: "65.83%", label: "best precision" },
      { value: "+1.84pp", label: "peak improvement" },
      { value: "299", label: "reduced layer count" },
    ],
    content: (
      <>
        <p>
          This research asks a concrete architecture question: can a
          Kolmogorov-Arnold Network (KAN) module improve YOLO&apos;s feature
          extraction without making the detector deeper? The study introduces
          KAN modules into a YOLO11n backbone and evaluates several
          serialization and flatten-layer strategies on Microsoft COCO.
        </p>
        <p>
          The strongest configuration reached 65.83% precision, with the
          largest observed improvement at 1.84 percentage points over the
          baseline. The experiments also showed that flatten-layer design has
          a meaningful effect on KAN performance; KAN-2-5 produced the best
          balance between accuracy and useful feature focus.
        </p>
        <p>
          The result is not simply a higher score. The simplified architecture
          reduced the network from 319 to 299 layers, supporting the project&apos;s
          original goal of improving accuracy while reducing depth.
        </p>
      </>
    ),
  },
  {
    href: "/pathfinding",
    actionLabel: "Open the interactive lab",
    title: "Pathfinding Visualizer",
    description:
      "An interactive search lab that exposes each exploration step across Dijkstra, A*, and Jump Point Search.",
    stack: ["TypeScript", "React", "Algorithms", "Visualization"],
    slug: "pathfinding",
    eyebrow: "Interactive Algorithms",
    year: "2024",
    accent: "sky",
    metrics: [
      { value: "3", label: "search algorithms" },
      { value: "20×20", label: "interactive grid" },
      { value: "Stepwise", label: "search playback" },
    ],
    content: (
      <>
        <p>
          Pathfinding algorithms are easiest to understand when their search
          frontier is visible. This lab turns Dijkstra, A*, and Jump Point
          Search into an interactive 20×20 grid with generated obstacles,
          visited nodes, candidate nodes, and the final shortest path.
        </p>
        <p>
          Visitors can regenerate a map, switch algorithms, advance one step at
          a time, or animate directly to the result. Each state uses a distinct
          visual treatment, making the trade-off between exhaustive and
          heuristic search tangible rather than abstract.
        </p>
      </>
    ),
  },
  {
    href: "/blog/beier-neely-image-morphing",
    actionLabel: "Read the case study",
    title: "Beier-Neely Image Morphing",
    description:
      "A computer graphics experiment in line-pair warping, coordinate systems, interpolation, and artifact reduction.",
    stack: ["C++", "Eigen", "Computer Graphics", "Image Processing"],
    slug: "beier-neely-morphing",
    eyebrow: "Computer Graphics",
    year: "2025",
    accent: "violet",
    metrics: [
      { value: "26", label: "line pairs" },
      { value: "31", label: "frames per test" },
      { value: "5", label: "morph studies" },
    ],
    content: (
      <>
        <p>
          This project implements the core Beier-Neely morphing pipeline:
          interpolate corresponding line pairs, warp each source toward an
          intermediate geometry, and dissolve the two color fields into a new
          frame. The character study uses 26 line pairs to control both broad
          silhouette changes and local features.
        </p>
        <p>
          The most important work happened in debugging. Image matrices use
          row-column coordinates while the algorithm is expressed in geometric
          x-y coordinates; mixing the two produced incorrect warps. A second
          source of visible jitter came from inconsistent conversion of
          floating-point positions to integer pixels. Applying a consistent
          clamp and rounding strategy made translation substantially smoother.
        </p>
        <p>
          Linear interpolation produced the least distortion among the tested
          intermediate-line strategies. Translation became stable, while scale
          and rotation exposed remaining limitations in the warp function. The
          case study keeps those imperfect results because they make the
          engineering process—and the next questions—visible.
        </p>
      </>
    ),
  },
  {
    href: "https://github.com/shankswhite/MahjongCalculator",
    actionLabel: "View source on GitHub",
    title: "Mini Riichi Mahjong",
    description:
      "A single-player Riichi Mahjong game against three AI opponents, recognized as the course's best project.",
    stack: ["Python", "Tkinter", "Game AI"],
    slug: "mahjong",
    eyebrow: "Game Development",
    year: "2023",
    accent: "amber",
    metrics: [
      { value: "3", label: "AI opponents" },
      { value: "Best", label: "course project" },
    ],
    content: (
      <>
        <p>
          Mini Riichi Mahjong supports a single player against three AI
          opponents, with either randomized or customizable tile deals. The
          implementation turns a rules-dense tabletop game into explicit state,
          turn, scoring, and opponent systems.
        </p>
        <p>
          The project was selected as the course&apos;s Best Course Project and
          later used by the professor as course material. Levon&apos;s experience as
          a certified professional Mahjong player helped keep the mechanics and
          strategic decisions authentic.
        </p>
      </>
    ),
  },
  {
    href: "https://github.com/shankswhite/Machine-Learning-for-Trading-For-Sharing",
    actionLabel: "View source on GitHub",
    title: "Machine Learning for Trading",
    description:
      "A quantitative trading study using decision trees, random forests, and Q-learning under conservative evaluation constraints.",
    stack: ["Python", "NumPy", "Pandas", "Q-Learning"],
    slug: "ml-trading",
    eyebrow: "Applied Machine Learning",
    year: "2024",
    accent: "emerald",
    metrics: [
      { value: "170%", label: "in-sample return" },
      { value: "14%", label: "out-of-sample return" },
    ],
    content: (
      <>
        <p>
          This study compares decision trees, random forests, and a Q-learner
          in a quantitative trading workflow. It covers feature construction,
          policy learning, transaction-aware evaluation, and the gap between
          in-sample and out-of-sample behavior.
        </p>
        <p>
          The reported strategy achieved a 170% cumulative in-sample return
          over two years and 14% out of sample under a conservative setup. The
          more useful takeaway is methodological: strong training performance
          is not treated as evidence of generalization, so both periods remain
          visible in the result.
        </p>
      </>
    ),
  },
  {
    href: "https://github.com/shankswhite/OnKitchen-Back-End",
    actionLabel: "View source on GitHub",
    title: "OnKitchen Recipe Platform",
    description:
      "A full-stack recipe workflow built with React, Spring Boot, MongoDB, and an AWS deployment pipeline.",
    stack: ["React", "Spring Boot", "MongoDB", "AWS"],
    slug: "recipe-app",
    eyebrow: "Full-Stack Product",
    year: "2024",
    accent: "amber",
    metrics: [{ value: "6→2", label: "deployment steps" }],
    content: (
      <>
        <p>
          OnKitchen combines a React interface, Java Spring Boot services, and
          MongoDB persistence into a recipe-management workflow. The frontend
          was hosted on Amazon S3 and the backend on Elastic Beanstalk.
        </p>
        <p>
          Alongside the product work, the deployment process was reduced from
          six manual steps to two, making releases faster and less error-prone.
        </p>
      </>
    ),
  },
  {
    href: "https://github.com/shankswhite/CS6457---GDD",
    actionLabel: "View source on GitHub",
    title: "3D Climbing & Shooting Game",
    description:
      "A Unity game prototype with physics-based climbing, root-motion animation, playtesting, and a multidisciplinary team.",
    stack: ["Unity", "C#", "Physics", "Animation"],
    slug: "climbing-game",
    eyebrow: "Game Engineering",
    year: "2024",
    accent: "slate",
    metrics: [
      { value: "10+", label: "playtesters" },
      { value: "3D", label: "movement system" },
    ],
    content: (
      <>
        <p>
          Built with a multidisciplinary team, this Unity prototype combines
          climbing and shooting in a 3D environment. Levon implemented core
          character, camera, and control systems in C#, including physics-based
          climbing and root-motion animation.
        </p>
        <p>
          The team ran playtests with more than ten players and presented the
          project at the Georgia Tech Project Showcase. Feedback was used to
          tune movement readability, control feel, and level pacing.
        </p>
      </>
    ),
  },
];
