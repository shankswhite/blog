export type CompanionEngagementEvent = {
  id: string;
  type: "page_view" | "message";
  path: string;
  role?: "user" | "assistant" | "system";
  channel?: "text" | "voice" | "page";
  content?: string;
  clientCreatedAt: string;
};

type QueuedEvent = {
  sessionId: string;
  event: CompanionEngagementEvent;
};

const queue: QueuedEvent[] = [];
const QUEUE_STORAGE_KEY = "kira.pendingEngagement.v1";
let flushTimer: number | null = null;
let flushing = false;
let lifecycleHooksInstalled = false;
let queueRestored = false;

function persistQueue() {
  if (typeof window === "undefined") return;
  try {
    if (queue.length === 0) {
      window.sessionStorage.removeItem(QUEUE_STORAGE_KEY);
      return;
    }
    window.sessionStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
  } catch {
    // The in-memory queue remains authoritative when browser storage is full
    // or unavailable.
  }
}

function restoreQueue() {
  if (queueRestored || typeof window === "undefined") return;
  queueRestored = true;
  try {
    const raw = window.sessionStorage.getItem(QUEUE_STORAGE_KEY);
    if (!raw || raw.length > 1_000_000) return;
    const stored = JSON.parse(raw) as unknown;
    if (!Array.isArray(stored)) return;
    for (const item of stored.slice(0, 500)) {
      if (
        item &&
        typeof item === "object" &&
        typeof (item as QueuedEvent).sessionId === "string" &&
        (item as QueuedEvent).event &&
        typeof (item as QueuedEvent).event.id === "string"
      ) {
        queue.push(item as QueuedEvent);
      }
    }
  } catch {
    window.sessionStorage.removeItem(QUEUE_STORAGE_KEY);
  }
}

function ensureLifecycleHooks() {
  if (lifecycleHooksInstalled || typeof window === "undefined") return;
  lifecycleHooksInstalled = true;
  restoreQueue();
  const flushWhenLeaving = () => {
    void flushCompanionEngagementEvents();
  };
  window.addEventListener("pagehide", flushWhenLeaving);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flushWhenLeaving();
  });
}

function scheduleFlush(delay = 700) {
  if (flushTimer || typeof window === "undefined") return;
  flushTimer = window.setTimeout(() => {
    flushTimer = null;
    void flushCompanionEngagementEvents();
  }, delay);
}

export function enqueueCompanionEngagementEvent(
  sessionId: string,
  event: CompanionEngagementEvent
) {
  if (!sessionId) return;
  ensureLifecycleHooks();
  queue.push({ sessionId, event });
  persistQueue();
  if (queue.length >= 10) void flushCompanionEngagementEvents();
  else scheduleFlush();
}

export async function flushCompanionEngagementEvents() {
  ensureLifecycleHooks();
  if (flushing || queue.length === 0) return;
  flushing = true;
  const sessionId = queue[0].sessionId;
  const batch: QueuedEvent[] = [];

  for (let index = 0; index < queue.length && batch.length < 10; ) {
    if (queue[index].sessionId === sessionId) {
      batch.push(...queue.splice(index, 1));
    } else {
      index += 1;
    }
  }
  persistQueue();

  try {
    const response = await fetch("/api/companion/events", {
      method: "POST",
      credentials: "same-origin",
      cache: "no-store",
      keepalive: true,
      signal: AbortSignal.timeout(8_000),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sessionId,
        events: batch.map((item) => item.event),
      }),
    });
    if (!response.ok) {
      // Retry transient storage/rate-limit failures. A deterministic 4xx means
      // this exact payload can never succeed; dropping it prevents a malformed
      // event from blocking every later interaction in the in-memory queue.
      if (response.status === 429 || response.status >= 500) {
        throw new Error("engagement_store_unavailable");
      }
    }
  } catch {
    queue.unshift(...batch);
    persistQueue();
    scheduleFlush(5_000);
  } finally {
    flushing = false;
    persistQueue();
    if (queue.length > 0 && !flushTimer) scheduleFlush();
  }
}
