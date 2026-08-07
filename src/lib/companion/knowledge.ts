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
  companion: {
    label: "Portfolio AI Companion",
    href: "/projects/portfolio-companion",
    kind: "Project",
  },
  trading: {
    label: "Machine Learning for Trading",
    href: "/projects/ml-trading",
    kind: "Project",
  },
  recipe: {
    label: "OnKitchen recipe platform",
    href: "/projects/recipe-app",
    kind: "Project",
  },
  climbing: {
    label: "3D climbing & shooting game",
    href: "/projects/climbing-game",
    kind: "Project",
  },
  openglPathfinding: {
    label: "Pathfinding Agents Game",
    href: "/projects/opengl-pathfinding-game",
    kind: "Project",
  },
  distributed: {
    label: "Distributed File System",
    href: "/projects/distributed-file-system",
    kind: "Project",
  },
  jobComparator: {
    label: "Job Comparator App",
    href: "/projects/job-comparator",
    kind: "Project",
  },
  legacy: {
    label: "Legacy Blog archive",
    href: "/legacy",
    kind: "Article",
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
      "companion",
      "chatbot",
      "assistant",
      "digital me",
      "聊天机器人",
      "数字分身",
      "助手",
    ])
  ) {
    return {
      content: isChinese
        ? "**Portfolio AI Companion** 是旧站登录式 Bedrock 聊天机器人的重新设计。旧版通过 Amplify Authenticator 与 AWS Bedrock 回答简历问题；新版公开模式改用整理过的双语知识层，不要求登录，也不会调用付费 AI 后端。\n\n它覆盖经历、技能与 11 个项目，并把回答链接回对应页面。这样做牺牲了开放式生成能力，但换来了更清晰的范围、更快的响应、可预测的答案和更好的隐私。"
        : "The **Portfolio AI Companion** redesigns the old site's login-gated Bedrock chatbot. The original used Amplify Authenticator and AWS Bedrock for résumé questions; the new public mode uses a curated bilingual knowledge layer, requires no account, and does not call a paid AI backend.\n\nIt covers experience, skills, and 11 project records, linking answers back to their source pages. The trade-off is deliberate: less open-ended generation in exchange for clear scope, speed, privacy, and predictable answers.",
      sources: [sources.companion, sources.legacy],
    };
  }

  if (
    includesAny(normalized, [
      "opengl",
      "c pathfinding",
      "pathfinding agents",
      "agents game",
      "cgame",
      "dfs",
      "bfs",
      "c语言寻路",
      "搜索代理游戏",
    ])
  ) {
    return {
      content: isChinese
        ? "**Pathfinding Agents Game** 是较早的 C / OpenGL 团队项目，与网页可视化器是两个不同作品。玩家在 20×20 地图上放置最多 10 个障碍，选择 DFS、BFS、Greedy 或 A* 代理，并逐回合观察路线与得分。\n\n重点是把算法表现变成玩法：玩家不只是观看搜索，而是通过障碍主动改变代理的决策环境。"
        : "The **Pathfinding Agents Game** is an earlier C/OpenGL team project, distinct from the web visualizer. Players place up to ten obstacles on a 20×20 map, select a DFS, BFS, Greedy, or A* agent, and advance the game round by round while watching the route and score.\n\nIts core idea is algorithm behavior as gameplay: the player actively changes the agent's decision environment rather than only watching a search.",
      sources: [sources.openglPathfinding],
    };
  }

  if (
    includesAny(normalized, [
      "distributed",
      "grpc",
      "file system",
      "filesystem",
      "分布式",
      "文件系统",
    ])
  ) {
    return {
      content: isChinese
        ? "**Distributed File System** 使用 C++ 与 gRPC 实现同步、异步 RPC 文件服务，并针对小文件、大文件及最高 100 个并发客户端进行压力测试。项目关注请求处理方式、并发度、吞吐与可预测性之间的工程权衡。\n\n原课程仓库目前不是公开资源，因此迁移站保留了完整项目记录，但没有提供失效的公开 GitHub 链接。"
        : "The **Distributed File System** uses C++ and gRPC to implement synchronous and asynchronous file-service RPCs. It was tested with small and large files and stress runs of up to 100 concurrent clients, focusing on trade-offs among request handling, concurrency, throughput, and predictable behavior.\n\nThe original course repository is not public, so the migration preserves the project record without presenting a broken public GitHub link.",
      sources: [sources.distributed],
    };
  }

  if (
    includesAny(normalized, [
      "job comparator",
      "job comparison",
      "android",
      "sqlite",
      "offer comparison",
      "职位比较",
      "工作比较",
    ])
  ) {
    return {
      content: isChinese
        ? "**Job Comparator App** 是一个采用测试驱动开发的 Android 职位比较工具。旧站资料记录了 100% 黑盒测试覆盖、80% 分支覆盖；将持久化从 SharedPreferences 重构为 SQLite 后，数据包体积减少了 90%。"
        : "The **Job Comparator App** is an Android offer-comparison workflow built with test-driven development. The preserved portfolio record reports 100% black-box coverage and 80% branch coverage; moving persistence from SharedPreferences to SQLite reduced the stored data package size by 90%.",
      sources: [sources.jobComparator],
    };
  }

  if (
    includesAny(normalized, [
      "trading",
      "q-learning",
      "q learner",
      "random forest",
      "quantitative",
      "交易",
      "量化",
    ])
  ) {
    return {
      content: isChinese
        ? "**Machine Learning for Trading** 比较了决策树、随机森林与 Q-learning 交易策略。作品集记录的结果是在保守设置下，两年样本内累计收益 170%，样本外收益 14%。更重要的结论是：训练表现不能替代泛化验证，因此两段结果会同时展示。"
        : "**Machine Learning for Trading** compares decision trees, random forests, and a Q-learning policy. The portfolio reports a 170% cumulative in-sample return over two years and 14% out of sample under a conservative setup. The more important lesson is methodological: training performance is not treated as proof of generalization, so both periods stay visible.",
      sources: [sources.trading],
    };
  }

  if (
    includesAny(normalized, [
      "recipe",
      "onkitchen",
      "spring boot",
      "mongodb",
      "食谱",
      "菜谱",
    ])
  ) {
    return {
      content: isChinese
        ? "**OnKitchen** 是 React、Spring Boot 与 MongoDB 组成的全栈食谱管理平台，前端曾部署在 S3，后端部署在 Elastic Beanstalk。项目还把发布流程从 6 个手工步骤压缩到 2 个。"
        : "**OnKitchen** is a full-stack recipe platform built with React, Spring Boot, and MongoDB, with the frontend hosted on S3 and the backend on Elastic Beanstalk. The project also reduced the release workflow from six manual steps to two.",
      sources: [sources.recipe],
    };
  }

  if (
    includesAny(normalized, [
      "climbing",
      "shooting game",
      "unity",
      "root motion",
      "攀爬",
      "射击游戏",
    ])
  ) {
    return {
      content: isChinese
        ? "**3D Climbing & Shooting Game** 是 Unity 团队原型。Levon 用 C# 实现角色、镜头与控制核心，包括基于物理的攀爬和 Root Motion 动画；团队邀请 10 多名玩家测试，并在 Georgia Tech Project Showcase 展示。"
        : "The **3D Climbing & Shooting Game** is a Unity team prototype. Levon implemented the character, camera, and core controls in C#, including physics-based climbing and root-motion animation. The team tested with more than ten players and presented the work at the Georgia Tech Project Showcase.",
      sources: [sources.climbing],
    };
  }

  if (
    includesAny(normalized, [
      "legacy",
      "archive",
      "old blog",
      "previous site",
      "旧博客",
      "旧站",
      "归档",
    ])
  ) {
    return {
      content: isChinese
        ? "**Legacy Blog** 是旧作品集在新站中的完整归档副本，包含旧首页内容、研究海报、图形学实验、本地运行的寻路交互、项目记录和 AI Chatbot 的安全替代。\n\n迁移例外也被明确记录：无公开许可的背景音乐与角色素材被移除；公开界面不调用旧 Bedrock / Cognito / API Gateway 后端；旧仓库缺失的 Ray Tracing 实现不会被虚构。旧仓库与旧 Amplify 应用继续保留作为回滚副本。"
        : "The **Legacy Blog** is an in-site archive of the previous portfolio, including the original homepage material, research poster, graphics experiment, browser-local pathfinding interaction, project records, and a safe substitute for the old AI chatbot.\n\nIts exceptions are explicit: background music and character media without publishable rights are removed; the public interface does not call the old Bedrock, Cognito, or API Gateway backend; and the missing Ray Tracing implementation is not invented. The old repository and Amplify app remain intact as a rollback copy.",
      sources: [sources.legacy],
    };
  }

  if (
    includesAny(normalized, [
      "activision",
      "blizzard",
      "microsoft gaming",
      "xbox summit",
      "动视",
      "暴雪",
    ])
  ) {
    return {
      content: isChinese
        ? "Levon 于 **2025 年 5 月至 2026 年 1 月**在 **Activision Blizzard（Microsoft Gaming）**担任 **Data Science（AI Systems）Intern**。他在 Databricks 与 Azure 上构建 PB 级异常检测流程，监控 50 多个在线服务 KPI；并把 RAG、Deep Research、LangGraph 与 Slack MCP Agent 组合成分析工作流，使分析响应延迟降低 40% 以上。\n\n他还用 Airflow 与 GitHub Actions 将流程从 POC 产品化为每日自动报告。该项目是唯一入选 2025 Microsoft Xbox Game Studios Data & Applied Science Summit 的实习生项目。"
        : "Levon worked at **Activision Blizzard (Microsoft Gaming)** as a **Data Science (AI Systems) Intern** from **May 2025 to January 2026**. He built a PB-scale anomaly-detection pipeline on Databricks and Azure monitoring more than 50 live-service KPIs, then combined RAG, Deep Research, LangGraph, and a Slack-based MCP agent into an investigation workflow that reduced analyst response latency by over 40%.\n\nHe also productionized the POC with Airflow and GitHub Actions for daily automated reporting. It was the only intern project selected for the 2025 Microsoft Xbox Game Studios Data & Applied Science Summit.",
      sources: [sources.resume],
    };
  }

  if (
    includesAny(normalized, [
      "handshake ai",
      "ai fellow",
      "ivy program",
      "模型评测",
      "盲测",
    ])
  ) {
    return {
      content: isChinese
        ? "Levon 自 **2026 年 4 月**起在 **Handshake AI Ivy Program** 担任 **AI Fellow**。工作包括：对前沿 LLM 的多步骤任务进行盲测，按照推理、指令遵循、事实性与鲁棒性评分；通过结构化 rubric 做模型间对比；记录失败模式与交互轨迹，为偏好优化及 RLHF / DPO 类对齐数据提供依据。"
        : "Levon has served as an **AI Fellow in Handshake AI's Ivy Program** since **April 2026**. The work includes blind evaluations of frontier LLMs on multi-step tasks, structured scoring across reasoning, instruction-following, factuality, and robustness, head-to-head model comparisons, and documenting failure patterns and interaction trajectories that support preference-tuning and RLHF/DPO-style alignment data.",
      sources: [sources.resume],
    };
  }

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
      "career",
      "经历",
      "游戏设计",
      "工作",
    ])
  ) {
    return {
      content: isChinese
        ? "Levon 的职业路径从在线游戏系统延伸到生产级 AI 与模型评测：\n\n- **Handshake AI（2026–至今）**：AI Fellow，负责前沿 LLM 盲测、结构化比较与失败模式分析\n- **Activision Blizzard / Microsoft Gaming（2025–26）**：Data Science（AI Systems）Intern，构建 PB 级异常检测与分析 Agent 工作流\n- **IM30 / Tap4fun（2019–22）**：高级游戏设计与游戏数据工程，参与月流水 2,000 万美元以上的在线策略游戏\n\n贯穿这些经历的是同一套工作方法：把产品判断、数据反馈与可运行系统连接起来。"
        : "Levon's career moves from live-game systems into production AI and model evaluation:\n\n- **Handshake AI (2026–present):** AI Fellow working on blind frontier-LLM evaluations, structured comparisons, and failure analysis\n- **Activision Blizzard / Microsoft Gaming (2025–26):** Data Science (AI Systems) Intern building PB-scale anomaly detection and analyst-agent workflows\n- **IM30 / Tap4fun (2019–22):** senior game design and game-data engineering on a live strategy title generating more than $20M in monthly revenue\n\nThe through-line is a practice of connecting product judgment, evidence, and working systems.",
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
        ? "Levon 于 **2026 年 5 月**完成 **Georgia Tech** 与 **Northeastern University** 的计算机科学硕士阶段学习，课程与项目覆盖操作系统、算法、人工智能、机器学习交易、GPU/CUDA、游戏开发和计算机图形学。\n\n这也解释了作品集为什么同时包含研究、算法可视化、游戏和全栈系统。"
        : "Levon completed his computer-science master's studies at **Georgia Tech** and **Northeastern University** in **May 2026**, with coursework and projects spanning operating systems, algorithms, AI, machine-learning-for-trading, GPU/CUDA, game development, and computer graphics.\n\nThat mix is why the portfolio includes research, algorithm visualizations, games, and full-stack systems.",
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
        ? "Pathfinding Visualizer 是一个完全在浏览器本地运行的算法实验，比较 **Dijkstra 与 A\***。你可以重新生成障碍地图、逐步查看搜索前沿，或直接播放到最短路径。旧站的 JPS 选项也被保留，但界面会明确标注它使用 A\* 兼容回退，不会暗中调用旧 API。"
        : "The Pathfinding Visualizer is a browser-local comparison of **Dijkstra and A***. You can regenerate obstacles, step through each search frontier, or play directly to the shortest path. The old JPS option is preserved as an explicitly labeled A* compatibility fallback, with no hidden call to the retired API.",
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
        ? "旧站的 **Beier-Neely 图像变形实验** 是这次迁移的重点内容之一。Levon 用线对完成图像变形，并记录了三个关键调试结论：\n\n1. 图像矩阵坐标与几何坐标的行列定义不同\n2. 浮点坐标转整数方式不一致会导致画面抖动\n3. `clamp`、取整策略与线性插值能明显改善稳定性\n\n新站保留了 4 段几何变换动画，并用原创抽象图替代缺少可发布授权与署名的旧角色素材。"
        : "The old site's **Beier-Neely image-morphing experiment** is a key migrated case study. Levon used line pairs for the warp and documented three important debugging lessons:\n\n1. Image-matrix coordinates and geometric coordinates use different row/column conventions\n2. Inconsistent float-to-integer conversion creates visible frame jitter\n3. `clamp`, rounding strategy, and linear interpolation materially improve stability\n\nThe new site keeps four geometric transformation videos and uses an original abstract visual in place of the old character media whose publishable license and credit were not retained.",
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
      sources: [
        sources.yolo,
        sources.pathfinding,
        sources.graphics,
        sources.projects,
        sources.legacy,
      ],
    };
  }

  return {
    content: isChinese
      ? "我是 Levon 的作品集 companion，可以根据站内整理过的资料介绍他的 **经历、技能、研究和项目**。\n\n你可以试着问：\n- YOLO-KAN 的实验结果是什么？\n- 他做过哪些游戏与算法项目？\n- Beier-Neely 变形实验解决了什么问题？\n- 如何联系 Levon？"
      : "I am Levon's portfolio companion, grounded in the material curated on this site. I can help with his **experience, skills, research, and projects**.\n\nTry asking:\n- What did the YOLO-KAN experiments find?\n- Which game and algorithm projects stand out?\n- What was learned from the Beier-Neely morphing project?\n- How can I contact Levon?",
    sources: [sources.about, sources.projects],
  };
}
