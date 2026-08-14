export const COMPANION_MESSAGE_MAX_LENGTH = 1200;
export const COMPANION_HISTORY_MAX_MESSAGES = 24;

type CompanionHistoryEntry = {
  role: "user" | "assistant";
};

export function normalizeCompanionPrompt(content: string) {
  let normalized = content.trim().slice(0, COMPANION_MESSAGE_MAX_LENGTH);

  // JavaScript slices UTF-16 code units. Avoid returning half of a surrogate
  // pair when a programmatic caller submits content beyond the textarea limit.
  const lastCodeUnit = normalized.charCodeAt(normalized.length - 1);
  if (lastCodeUnit >= 0xd800 && lastCodeUnit <= 0xdbff) {
    normalized = normalized.slice(0, -1);
  }

  return normalized;
}

export function beginCompanionTurn<T extends CompanionHistoryEntry>(
  current: readonly T[],
  userMessage: T
) {
  const settledCapacity = COMPANION_HISTORY_MAX_MESSAGES - 2;
  let settled = current.slice(-settledCapacity);

  // When receiving legacy or externally restored history, keep the visible
  // window aligned to a user message instead of exposing an orphaned answer.
  while (settled[0]?.role === "assistant") {
    settled = settled.slice(1);
  }

  return [...settled, userMessage];
}

export function appendCompanionMessage<T extends CompanionHistoryEntry>(
  current: readonly T[],
  message: T
) {
  return [...current, message].slice(-COMPANION_HISTORY_MAX_MESSAGES);
}
