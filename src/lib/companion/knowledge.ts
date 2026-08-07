export type CompanionSource = {
  label: string;
  href: string;
  kind: "Profile" | "Resume" | "Project" | "Article" | "Contact";
};

export type CompanionReply = {
  content: string;
  sources: CompanionSource[];
};

const sources = {
  about: { label: "About Levon", href: "/about", kind: "Profile" },
  resume: { label: "Work history", href: "/resume", kind: "Resume" },
  projects: { label: "Selected projects", href: "/projects", kind: "Project" },
  yolo: {
    label: "YOLO-KAN research",
    href: "/projects/yolo-kan",
    kind: "Project",
  },
  pathfinding: {
    label: "Pathfinding visualizer",
    href: "/projects/pathfinding",
    kind: "Project",
  },
  graphics: {
    label: "Beier-Neely morphing",
    href: "/projects/beier-neely-morphing",
    kind: "Article",
  },
  mahjong: {
    label: "Mini Riichi Mahjong",
    href: "/projects/mahjong",
    kind: "Project",
  },
  contact: { label: "Contact Levon", href: "/contact", kind: "Contact" },
} as const satisfies Record<string, CompanionSource>;

const includesAny = (value: string, terms: string[]) =>
  terms.some((term) => value.includes(term));

export function getCompanionReply(message: string): CompanionReply {
  const normalized = message.trim().toLowerCase();
  const isChinese = /[\u3400-\u9fff]/.test(message);

  if (
    includesAny(normalized, [
      "skill",
      "stack",
      "technology",
      "技能",
      "技术栈",
      "会什么",
    ])
  ) {
    return {
      content: isChinese
        ? "Levon 的能力横跨 **软件工程、机器学习与游戏开发**：\n\n- 语言：C/C++、Java、Python、C#、TypeScript、JavaScript、SQL\n- 前端与后端：React、Next.js、Spring Boot\n- AI / 数据：PyTorch、NumPy、Pandas，以及 AWS Bedrock\n- 游戏与工具：Unity、Unreal Engine、Docker、Git、AWS\n\n他的优势不是单独掌握某个框架，而是能把玩法设计、数据分析和工程实现连成一条完整链路。"
        : "Levon works across **software engineering, machine learning, and game development**:\n\n- Languages: C/C++, Java, Python, C#, TypeScript, JavaScript, and SQL\n- Product engineering: React, Next.js, and Spring Boot\n- AI and data: PyTorch, NumPy, Pandas, and AWS Bedrock\n- Games and tooling: Unity, Unreal Engine, Docker, Git, and AWS\n\nHis differentiator is connecting game design, data analysis, and implementation rather than treating them as separate disciplines.",
      sources: [sources.about, sources.resume, sources.projects],
    };
  }

  if (
    includesAny(normalized, [
      "experience",
      "game design",
      "last war",
      "im30",
      "tap4fun",
      "经历",
      "游戏设计",
      "工作",
    ])
  ) {
    return {
      content: isChinese
        ? "Levon 曾在 **IM30 / Tap4fun** 担任高级游戏设计师，参与全球头部策略游戏项目的关卡与玩法设计。作品集记录的重点包括：\n\n- 参与月流水超过 2,000 万美元项目的玩法设计\n- 用 SQL 与 Python 分析玩法数据并推动迭代\n- 将设计、实验和数据验证结合起来\n\n之后，他把这套产品与系统思维带入了软件工程、AI 和计算机图形学项目。"
        : "Levon worked as a **Senior Game Designer at IM30 / Tap4fun**, contributing to level and gameplay systems for a globally successful strategy title. The portfolio highlights:\n\n- Gameplay work on a project generating more than $20M in monthly revenue\n- SQL and Python analysis used to guide iteration\n- A product process that connects design, experimentation, and evidence\n\nHe later carried that systems mindset into software engineering, AI, and computer graphics projects.",
      sources: [sources.resume, sources.about],
    };
  }

  if (
    includesAny(normalized, [
      "education",
      "school",
      "georgia",
      "gatech",
      "northeastern",
      "教育",
      "学校",
      "学历",
    ])
  ) {
    return {
      content: isChinese
        ? "Levon 在 **Georgia Tech** 与 **Northeastern University** 学习计算机科学，课程与项目覆盖操作系统、算法、人工智能、机器学习交易、游戏开发和计算机图形学。\n\n这也解释了作品集为什么同时包含研究海报、算法可视化、游戏和全栈项目。"
        : "Levon studies computer science through **Georgia Tech** and **Northeastern University**, with coursework and projects spanning operating systems, algorithms, AI, machine-learning-for-trading, game development, and computer graphics.\n\nThat mix is why the portfolio includes research, algorithm visualizations, games, and full-stack work.",
      sources: [sources.resume, sources.about],
    };
  }

  if (includesAny(normalized, ["yolo", "kan", "object detection", "目标检测"])) {
    return {
      content: isChinese
        ? "**YOLO-KAN** 研究把 Kolmogorov-Arnold Network 模块引入 YOLO11n，并在 Microsoft COCO 上进行消融实验。研究海报记录的结果包括：\n\n- 最佳实验精度达到 **65.83%**，相对基线提升最高 **1.84 个百分点**\n- KAN-2-5 在准确率与特征关注范围之间取得了较好的平衡\n- Flatten 层的结构会显著影响 KAN 模块效果\n- 在提升准确率的同时，网络层数从 319 降至 299\n\n项目页保留了完整研究海报与 GitHub 链接。"
        : "**YOLO-KAN** introduces Kolmogorov-Arnold Network modules into YOLO11n and evaluates them on Microsoft COCO. The research poster reports:\n\n- A best precision of **65.83%**, up to **1.84 percentage points** over the baseline\n- KAN-2-5 providing the best balance between accuracy and feature focus\n- Flatten-layer design materially affecting KAN performance\n- Network depth reduced from 319 to 299 layers while improving accuracy\n\nThe project page includes the complete poster and GitHub source.",
      sources: [sources.yolo],
    };
  }

  if (
    includesAny(normalized, [
      "pathfinding",
      "dijkstra",
      "a*",
      "jump point",
      "寻路",
      "最短路径",
    ])
  ) {
    return {
      content: isChinese
        ? "Pathfinding Visualizer 是一个可交互的算法实验，比较 **Dijkstra、A\* 与 Jump Point Search**。你可以重新生成障碍地图、逐步查看搜索前沿，或直接播放到最短路径。\n\n迁移后保留了原有交互，但把它纳入统一的项目叙事和旧 URL 兼容规则。"
        : "The Pathfinding Visualizer is an interactive comparison of **Dijkstra, A*, and Jump Point Search**. You can regenerate obstacles, step through each search frontier, or play directly to the shortest path.\n\nThe migration preserves the interaction while placing it inside a clearer project story and keeping the legacy URL working.",
      sources: [sources.pathfinding],
    };
  }

  if (
    includesAny(normalized, [
      "morph",
      "graphics",
      "beier",
      "neely",
      "图形",
      "变形",
      "动画",
    ])
  ) {
    return {
      content: isChinese
        ? "旧站的 **Beier-Neely 图像变形实验** 是这次迁移的重点内容之一。Levon 用 26 组线对完成角色变形，并记录了三个关键调试结论：\n\n1. 图像矩阵坐标与几何坐标的行列定义不同\n2. 浮点坐标转整数方式不一致会导致画面抖动\n3. `clamp`、取整策略与线性插值能明显改善稳定性\n\n新站把 155 张逐帧 JPG 压缩成 5 段轻量循环动画，并将原始实验记录整理成结构化案例。"
        : "The old site's **Beier-Neely image-morphing experiment** is a key migrated case study. Levon used 26 line pairs for the character morph and documented three important debugging lessons:\n\n1. Image-matrix coordinates and geometric coordinates use different row/column conventions\n2. Inconsistent float-to-integer conversion creates visible frame jitter\n3. `clamp`, rounding strategy, and linear interpolation materially improve stability\n\nThe new site compresses 155 JPEG frames into five lightweight looping videos and restructures the original notes into a readable case study.",
      sources: [sources.graphics],
    };
  }

  if (includesAny(normalized, ["mahjong", "麻将", "riichi"])) {
    return {
      content: isChinese
        ? "Mini Riichi Mahjong 支持单人对战 3 个 AI 对手，可随机或自定义发牌。它获得了课程 **Best Course Project**，后来被教师用作课程材料。"
        : "Mini Riichi Mahjong supports a single player against three AI opponents with randomized or custom tile deals. It received the course's **Best Course Project** recognition and was later used as course material.",
      sources: [sources.mahjong],
    };
  }

  if (
    includesAny(normalized, [
      "contact",
      "email",
      "hire",
      "collaborate",
      "联系",
      "邮箱",
      "合作",
    ])
  ) {
    return {
      content: isChinese
        ? "最方便的方式是通过联系页给 Levon 留言，也可以从侧栏访问 GitHub 或 LinkedIn。若是合作邀请，建议在消息中说明项目目标、时间范围和希望他参与的部分。"
        : "The easiest route is the contact page; GitHub and LinkedIn are also available from the sidebar. For collaboration inquiries, it helps to include the goal, timeframe, and the part you would like Levon to own.",
      sources: [sources.contact, sources.about],
    };
  }

  if (
    includesAny(normalized, ["project", "portfolio", "best work", "项目", "作品"])
  ) {
    return {
      content: isChinese
        ? "如果只看三个代表项目，我建议从这里开始：\n\n1. **YOLO-KAN** — 研究与机器学习实验设计\n2. **Pathfinding Visualizer** — 算法、交互与可视化\n3. **Beier-Neely Morphing** — 计算机图形学与调试过程\n\n再补充 Mini Riichi Mahjong，可以看到 Levon 如何把游戏设计经验带入工程实现。"
        : "If you only have time for three projects, start with:\n\n1. **YOLO-KAN** — research and ML experimentation\n2. **Pathfinding Visualizer** — algorithms, interaction, and visualization\n3. **Beier-Neely Morphing** — computer graphics and debugging process\n\nAdd Mini Riichi Mahjong to see how Levon's game-design background informs implementation.",
      sources: [sources.yolo, sources.pathfinding, sources.graphics, sources.projects],
    };
  }

  return {
    content: isChinese
      ? "我是 Levon 的作品集 companion，可以根据站内整理过的资料介绍他的 **经历、技能、研究和项目**。\n\n你可以试着问：\n- YOLO-KAN 的实验结果是什么？\n- 他做过哪些游戏与算法项目？\n- Beier-Neely 变形实验解决了什么问题？\n- 如何联系 Levon？"
      : "I am Levon's portfolio companion, grounded in the material curated on this site. I can help with his **experience, skills, research, and projects**.\n\nTry asking:\n- What did the YOLO-KAN experiments find?\n- Which game and algorithm projects stand out?\n- What was learned from the Beier-Neely morphing project?\n- How can I contact Levon?",
    sources: [sources.about, sources.projects],
  };
}
