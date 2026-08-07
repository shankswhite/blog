import type { Product } from "@/types/products";

export const products: Product[] = [
  {
    href: "/resume#activision",
    actionLabel: "View the work experience",
    title: "Live-Service Anomaly Detection",
    description:
      "A production AI investigation system for PB-scale game telemetry, monitoring 50+ service KPIs and shortening analyst response latency by more than 40%.",
    stack: ["Databricks", "Azure", "Python", "Airflow", "LangGraph"],
    slug: "live-service-anomaly-detection",
    eyebrow: "Production AI Systems",
    year: "2025",
    accent: "emerald",
    metrics: [
      { value: "PB-scale", label: "telemetry analyzed" },
      { value: "50+", label: "live-service KPIs" },
      { value: "40%+", label: "lower response latency" },
    ],
    content: (
      <>
        <p>
          At Activision Blizzard, the practical challenge was not simply
          detecting an unusual metric. Analysts needed to understand which live
          service changed, gather relevant context, and move from an alert to a
          useful investigation while the signal was still actionable.
        </p>
        <p>
          The resulting workflow processed PB-scale telemetry in Databricks and
          Azure and monitored more than 50 service KPIs. Anomaly signals were
          connected to a research layer combining retrieval, deep-research
          patterns, LangGraph orchestration, and a Slack-based MCP agent. That
          reduced analyst response latency by more than 40%.
        </p>
        <p>
          Airflow and GitHub Actions moved the system from a proof of concept to
          daily automated reporting. The work was the only intern project
          selected for the 2025 Microsoft Xbox Game Studios Data &amp; Applied
          Science Summit. This public case study intentionally omits proprietary
          data, model settings, and internal service details.
        </p>
      </>
    ),
  },
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
    href: "/legacy/pathfinding",
    actionLabel: "Open the interactive lab",
    title: "Pathfinding Visualizer",
    description:
      "A browser-local search lab that exposes every Dijkstra and A* exploration step while preserving the old JPS control as a documented compatibility mode.",
    stack: ["TypeScript", "React", "Algorithms", "Visualization"],
    slug: "pathfinding",
    eyebrow: "Interactive Algorithms",
    year: "2024",
    accent: "sky",
    metrics: [
      { value: "3", label: "search modes" },
      { value: "20×20", label: "interactive grid" },
      { value: "Stepwise", label: "search playback" },
    ],
    content: (
      <>
        <p>
          Pathfinding algorithms are easiest to understand when their search
          frontier is visible. This lab turns Dijkstra and A* into an
          interactive 20×20 grid with generated obstacles, visited nodes,
          candidate nodes, and the final shortest path. The archived JPS
          selector is retained as an explicitly labeled A* fallback because
          the original implementation only existed behind the retired API.
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
    href: "/chat",
    actionLabel: "Open the companion",
    title: "Portfolio AI Companion",
    description:
      "A bilingual, source-linked guide that turns a static portfolio into a focused conversation about the work.",
    stack: ["Next.js", "TypeScript", "Information Design", "AI UX"],
    slug: "portfolio-companion",
    eyebrow: "Conversational Interface",
    year: "2024–26",
    accent: "sky",
    metrics: [
      { value: "2", label: "languages" },
      { value: "0", label: "sign-ins required" },
      { value: "Linked", label: "answer sources" },
    ],
    content: (
      <>
        <p>
          The first version of this portfolio assistant used AWS Bedrock to
          answer résumé questions behind an authenticated form. For the new
          site, the experience was reframed around a simpler product question:
          how can a visitor understand the most relevant evidence in a few
          minutes, without creating an account?
        </p>
        <p>
          The current public mode uses a curated bilingual knowledge layer. It
          recognizes questions about Levon&apos;s experience, skills, research,
          and projects, then links each answer back to the relevant page. That
          makes the scope explicit and keeps the interaction fast, predictable,
          and privacy-conscious.
        </p>
        <p>
          The interface is available as both a focused full-page experience and
          a floating panel throughout the site. Keyboard navigation, clear
          source labels, mobile layouts, and reduced-motion preferences are
          treated as core interaction requirements rather than polish.
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
        <p>
          The character sequence also retained a small ghosting artifact around
          the left leg. Comparing a single leg line pair with a denser set of
          eight produced nearly the same result, suggesting that the remaining
          issue lived in the warp behavior rather than simply in line-pair
          count.
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
  {
    href: "https://github.com/shankswhite/CS5008GroupProject",
    actionLabel: "View source on GitHub",
    title: "Pathfinding Agents Game",
    description:
      "A C and OpenGL game that lets players place obstacles and compare how search agents navigate a 20×20 grid.",
    stack: ["C", "OpenGL", "DFS / BFS", "A*"],
    slug: "opengl-pathfinding-game",
    eyebrow: "Algorithms as Gameplay",
    year: "Coursework",
    accent: "emerald",
    metrics: [
      { value: "20×20", label: "grid map" },
      { value: "10", label: "player obstacles" },
      { value: "4+", label: "search agents" },
    ],
    content: (
      <>
        <p>
          This earlier team project turns pathfinding into a game rather than a
          passive visualization. Players choose an algorithm-controlled agent,
          place up to ten obstacles, and advance the simulation one round at a
          time while the score tracks the route taken.
        </p>
        <p>
          The interface and rendering were built in C with OpenGL. The project
          compares depth-first search, breadth-first search, Greedy search, and
          A* inside the same 20×20 environment, making algorithm behavior
          visible through player-agent interaction.
        </p>
        <p>
          It is distinct from the newer web Pathfinding Visualizer: this version
          emphasizes game rules, scoring, obstacle placement, and a custom
          desktop rendering loop.
        </p>
      </>
    ),
  },
  {
    title: "Distributed File System",
    description:
      "A C++ and gRPC file service exploring synchronous and asynchronous RPCs, concurrency, and workload-aware testing.",
    stack: ["C++", "gRPC", "Distributed Systems", "Stress Testing"],
    slug: "distributed-file-system",
    eyebrow: "Systems Engineering",
    year: "Coursework",
    accent: "slate",
    metrics: [
      { value: "100", label: "concurrent clients" },
      { value: "2", label: "RPC modes" },
      { value: "Small→Large", label: "file workloads" },
    ],
    availabilityNote:
      "The original course repository is not public; the project record is preserved here from the previous portfolio.",
    content: (
      <>
        <p>
          This systems project implements a distributed file service in C++
          with gRPC. Both synchronous and asynchronous RPC paths were used to
          examine how request handling changes as concurrency increases.
        </p>
        <p>
          Testing covered small and large file workloads and stress runs with
          up to 100 concurrent clients. The work focused on practical trade-offs
          between throughput, coordination, and predictable behavior under
          load.
        </p>
      </>
    ),
  },
  {
    title: "Job Comparator App",
    description:
      "An Android job-comparison workflow built with test-driven development and a leaner SQLite persistence model.",
    stack: ["Android", "Java", "SQLite", "TDD"],
    slug: "job-comparator",
    eyebrow: "Test-Driven Product",
    year: "Coursework",
    accent: "violet",
    metrics: [
      { value: "100%", label: "black-box coverage" },
      { value: "80%", label: "branch coverage" },
      { value: "−90%", label: "data package size" },
    ],
    availabilityNote:
      "The original course repository is not public; the project record is preserved here from the previous portfolio.",
    content: (
      <>
        <p>
          Levon led the development of an Android application for comparing job
          offers across compensation and preference criteria. The team used
          test-driven development to turn the product rules into explicit,
          verifiable behavior.
        </p>
        <p>
          The test suite reached full black-box coverage and 80% branch
          coverage. Moving persistence from SharedPreferences to SQLite reduced
          the stored data package size by 90% while giving the comparison data a
          clearer structure.
        </p>
      </>
    ),
  },
];

export const legacyProjectSlugs = [
  "yolo-kan",
  "pathfinding",
  "beier-neely-morphing",
  "mahjong",
  "ml-trading",
  "recipe-app",
  "climbing-game",
  "opengl-pathfinding-game",
  "distributed-file-system",
  "job-comparator",
] as const;

export const legacyProducts = products.filter(({ slug }) =>
  (legacyProjectSlugs as readonly string[]).includes(slug)
);
