import assert from "node:assert/strict";
import test from "node:test";
import {
  appendCompanionMessage,
  beginCompanionTurn,
  COMPANION_HISTORY_MAX_MESSAGES,
  COMPANION_MESSAGE_MAX_LENGTH,
  normalizeCompanionPrompt,
} from "./companion/history";

type TestMessage = {
  id: string;
  role: "user" | "assistant";
};

test("keeps complete turns while the thirteenth reply is pending", () => {
  const settled: TestMessage[] = Array.from({ length: 12 }, (_, index) => [
    { id: `u${index + 1}`, role: "user" as const },
    { id: `a${index + 1}`, role: "assistant" as const },
  ]).flat();

  const pending = beginCompanionTurn(settled, {
    id: "u13",
    role: "user",
  });

  assert.equal(pending.length, COMPANION_HISTORY_MAX_MESSAGES - 1);
  assert.deepEqual(
    pending.map(({ id }) => id),
    [
      "u2",
      "a2",
      "u3",
      "a3",
      "u4",
      "a4",
      "u5",
      "a5",
      "u6",
      "a6",
      "u7",
      "a7",
      "u8",
      "a8",
      "u9",
      "a9",
      "u10",
      "a10",
      "u11",
      "a11",
      "u12",
      "a12",
      "u13",
    ]
  );

  const completed = appendCompanionMessage(pending, {
    id: "a13",
    role: "assistant",
  });
  assert.equal(completed.length, COMPANION_HISTORY_MAX_MESSAGES);
  assert.equal(completed[0]?.id, "u2");
  assert.equal(completed.at(-1)?.id, "a13");
});

test("realigns a restored window that starts with an orphaned answer", () => {
  const pending = beginCompanionTurn<TestMessage>(
    [
      { id: "a1", role: "assistant" },
      { id: "u2", role: "user" },
      { id: "a2", role: "assistant" },
    ],
    { id: "u3", role: "user" }
  );

  assert.deepEqual(
    pending.map(({ id }) => id),
    ["u2", "a2", "u3"]
  );
});

test("normalizes whitespace and never splits a UTF-16 surrogate pair", () => {
  const prefix = "x".repeat(COMPANION_MESSAGE_MAX_LENGTH - 1);
  const normalized = normalizeCompanionPrompt(`  ${prefix}🚀overflow  `);

  assert.equal(normalized, prefix);
  assert.equal(normalized.length, COMPANION_MESSAGE_MAX_LENGTH - 1);
  assert.equal(normalizeCompanionPrompt("  hello  "), "hello");
});
