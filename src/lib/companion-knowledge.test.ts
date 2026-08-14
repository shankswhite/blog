import assert from "node:assert/strict";
import test from "node:test";
import { getCompanionReply } from "@/lib/companion/knowledge";

const demoPrompts = [
  "What did Levon build at Activision?",
  "Show me the strongest AI projects",
  "What did the YOLO-KAN experiments find?",
  "用中文介绍 Levon 的 AI 工程经历",
];

test("the AI-project prompt returns a tailored, source-linked overview", () => {
  const reply = getCompanionReply("Show me the strongest AI projects");

  assert.match(reply.content, /Activision Blizzard AI Systems/);
  assert.match(reply.content, /YOLO-KAN/);
  assert.deepEqual(
    reply.sources.map((source) => source.href),
    [
      "/resume",
      "/projects/yolo-kan",
      "/projects/ml-trading",
      "/projects/portfolio-companion",
    ]
  );
});

test("every demo prompt has content and local source routes", () => {
  for (const prompt of demoPrompts) {
    const reply = getCompanionReply(prompt);

    assert.ok(reply.content.length > 80, prompt);
    assert.ok(reply.sources.length > 0, prompt);
    assert.ok(
      reply.sources.every((source) => source.href.startsWith("/")),
      prompt
    );
  }
});

test("demo prompts stay mapped to their distinct evidence nodes", () => {
  const expectedSources = [
    ["/resume"],
    [
      "/resume",
      "/projects/yolo-kan",
      "/projects/ml-trading",
      "/projects/portfolio-companion",
    ],
    ["/projects/yolo-kan"],
    ["/resume", "/about"],
  ];

  assert.deepEqual(
    demoPrompts.map((prompt) =>
      getCompanionReply(prompt).sources.map((source) => source.href)
    ),
    expectedSources
  );
});

test("Chinese questions receive a Chinese answer", () => {
  const reply = getCompanionReply("用中文介绍 Levon 的 AI 工程经历");

  assert.match(reply.content, /职业路径|经历/);
  assert.match(reply.content, /Activision Blizzard/);
});

test("natural Chinese AI-experience wording reaches the career overview", () => {
  const reply = getCompanionReply("Levon 的 AI 工程经验有哪些？");

  assert.match(reply.content, /职业路径/);
  assert.match(reply.content, /Handshake AI/);
  assert.match(reply.content, /Activision Blizzard/);
  assert.deepEqual(
    reply.sources.map((source) => source.href),
    ["/resume", "/about"]
  );
});

test("representative wording reaches every curated knowledge route", () => {
  const routes: Array<[prompt: string, expectedSources: string[]]> = [
    [
      "Tell me about the portfolio companion",
      ["/projects/portfolio-companion", "/legacy"],
    ],
    [
      "Explain the C pathfinding agents game",
      ["/projects/opengl-pathfinding-game"],
    ],
    [
      "Describe the distributed file system",
      ["/projects/distributed-file-system"],
    ],
    ["Job Comparator Android app", ["/projects/job-comparator"]],
    ["Q-learning trading work", ["/projects/ml-trading"]],
    ["OnKitchen recipe platform", ["/projects/recipe-app"]],
    ["3D climbing game", ["/projects/climbing-game"]],
    ["What is the legacy archive?", ["/legacy"]],
    ["What happened at Activision?", ["/resume"]],
    ["Handshake AI fellow", ["/resume"]],
    ["What is his technology stack?", ["/about", "/resume", "/projects"]],
    ["Summarize his career experience", ["/resume", "/about"]],
    ["Where did he go to school?", ["/resume", "/about"]],
    ["Explain object detection with KAN", ["/projects/yolo-kan"]],
    ["Dijkstra pathfinding visualizer", ["/projects/pathfinding"]],
    ["Beier-Neely image morphing", ["/projects/beier-neely-morphing"]],
    ["Mini Riichi Mahjong", ["/projects/mahjong"]],
    ["How can I contact him?", ["/contact", "/about"]],
    [
      "Show the strongest AI projects",
      [
        "/resume",
        "/projects/yolo-kan",
        "/projects/ml-trading",
        "/projects/portfolio-companion",
      ],
    ],
    [
      "Show the best work in the portfolio",
      [
        "/projects/yolo-kan",
        "/projects/pathfinding",
        "/projects/beier-neely-morphing",
        "/projects",
        "/legacy",
      ],
    ],
    ["Something else entirely", ["/about", "/projects"]],
  ];

  for (const [prompt, expectedSources] of routes) {
    const reply = getCompanionReply(prompt);
    const actualSources = reply.sources.map((source) => source.href);

    assert.ok(reply.content.length > 80, prompt);
    assert.deepEqual(actualSources, expectedSources, prompt);
    assert.equal(new Set(actualSources).size, actualSources.length, prompt);
  }
});
