"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode,
} from "react";
import type {
  LocalTrackPublication,
  Participant,
  RemoteParticipant,
  RemoteTrack,
  RemoteTrackPublication,
  Room,
  TranscriptionSegment as LiveKitTranscriptionSegment,
} from "livekit-client";
import { normalizeCompanionPrompt } from "@/lib/companion/history";
import {
  enqueueCompanionEngagementEvent,
  flushCompanionEngagementEvents,
} from "@/lib/companion/engagement-client";
import {
  collectCompanionPageContext,
  type CompanionPageContext,
} from "@/lib/companion/page-context";

export type VoiceSessionPhase =
  | "idle"
  | "connecting"
  | "connected"
  | "ending"
  | "error";

export type VoiceTranscriptSpeaker = "user" | "agent";

export type VoiceTranscriptSegment = {
  id: string;
  speaker: VoiceTranscriptSpeaker;
  text: string;
  isFinal: boolean;
  firstReceivedAt: number;
  lastReceivedAt: number;
};

export type KiraMessageChannel = "text" | "voice" | "page";

export type KiraMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  channel: KiraMessageChannel;
  isFinal: boolean;
  createdAt: number;
  path: string;
  deliveryStatus?: "pending" | "sent" | "failed";
};

type AgentState =
  | "initializing"
  | "listening"
  | "thinking"
  | "speaking"
  | "idle"
  | "offline";

export type VoiceSessionContextValue = {
  phase: VoiceSessionPhase;
  error: string | null;
  roomName: string | null;
  identity: string | null;
  sessionId: string;
  expiresAt: number | null;
  transcriptSegments: VoiceTranscriptSegment[];
  latestTranscript: VoiceTranscriptSegment | null;
  messages: KiraMessage[];
  currentPage: CompanionPageContext | null;
  agentReady: boolean;
  agentState: AgentState;
  isThinking: boolean;
  isSendingText: boolean;
  microphoneEnabled: boolean;
  /** Reserved for the deferred 3D lip-sync layer; remains zero in 2D mode. */
  mouthLevelRef: MutableRefObject<number>;
  canStart: boolean;
  canEnd: boolean;
  start: () => Promise<void>;
  end: () => Promise<void>;
  disableMicrophone: () => Promise<void>;
  toggleMicrophone: () => Promise<void>;
  sendText: (content: string, retryMessageId?: string) => Promise<void>;
  clearTranscript: () => void;
  resetConversation: () => Promise<void>;
};

export type VoiceSessionProviderProps = {
  children: ReactNode;
  tokenEndpoint?: string;
};

type SessionSnapshot = {
  phase: VoiceSessionPhase;
  error: string | null;
  roomName: string | null;
  identity: string | null;
  expiresAt: number | null;
};

type TokenPayload = {
  token: string;
  url: string;
  room: string;
  identity: string;
  expiresAt: number;
};

const INITIAL_SESSION: SessionSnapshot = {
  phase: "idle",
  error: null,
  roomName: null,
  identity: null,
  expiresAt: null,
};

const VoiceSessionContext = createContext<VoiceSessionContextValue | null>(
  null
);

class TokenRequestError extends Error {
  constructor(
    readonly status: number,
    readonly code: string
  ) {
    super(code);
  }
}

// LiveKit and the engagement APIs are HTTPS-only in production, so the Web
// Crypto UUID API is available anywhere this client can establish a session.
const createId = () => globalThis.crypto.randomUUID();
const MAX_LIVEKIT_TEXT_BYTES = 15_500;
const AGENT_READY_TIMEOUT_MS = 40_000;
const AGENT_READY_POLL_MS = 100;

function utf8Length(value: string) {
  return new TextEncoder().encode(value).byteLength;
}

function truncateUtf8(value: string, maxBytes: number) {
  let result = "";
  let length = 0;
  for (const character of Array.from(value)) {
    const nextLength = length + utf8Length(character);
    if (nextLength > maxBytes) break;
    result += character;
    length = nextLength;
  }
  return result;
}

function serializePageContext(context: CompanionPageContext) {
  const chunks = [...context.chunks];
  while (true) {
    const payload = JSON.stringify({ ...context, chunks });
    if (utf8Length(payload) <= MAX_LIVEKIT_TEXT_BYTES) return payload;
    if (chunks.length === 0) break;
    chunks.pop();
  }

  const minimal = JSON.stringify({
    ...context,
    path: truncateUtf8(context.path, 480),
    title: truncateUtf8(context.title, 320),
    highlight: truncateUtf8(context.highlight, 900),
    chunks: [],
  });
  return utf8Length(minimal) <= MAX_LIVEKIT_TEXT_BYTES ? minimal : null;
}

function serializeAtomicTextInput(
  text: string,
  context: CompanionPageContext | null
) {
  if (context) {
    const chunks = [...context.chunks];
    while (true) {
      const payload = JSON.stringify({
        v: 1,
        text,
        pageContext: { ...context, chunks },
      });
      if (utf8Length(payload) <= MAX_LIVEKIT_TEXT_BYTES) return payload;
      if (chunks.length === 0) break;
      chunks.pop();
    }
  }

  // A user prompt is independently bounded to 1,200 characters. If the page
  // snapshot cannot fit beside it, keep the turn valid and omit the snapshot.
  return JSON.stringify({ v: 1, text, pageContext: null });
}

function formatPageHighlight(context: CompanionPageContext) {
  return context.highlight.trim();
}

function normalizeExpiresAt(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value < 10_000_000_000 ? value * 1000 : value;
  }

  if (typeof value === "string" && value.trim()) {
    const numeric = Number(value);
    if (Number.isFinite(numeric)) {
      return numeric < 10_000_000_000 ? numeric * 1000 : numeric;
    }
    const parsed = Date.parse(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

async function requestToken(
  endpoint: string,
  signal: AbortSignal
): Promise<TokenPayload> {
  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      credentials: "same-origin",
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal,
    });
  } catch (error) {
    if (signal.aborted) throw error;
    throw new TokenRequestError(0, "network_error");
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    throw new TokenRequestError(response.status, "invalid_response");
  }

  if (!response.ok) {
    const code =
      body &&
      typeof body === "object" &&
      "error" in body &&
      typeof body.error === "string"
        ? body.error
        : "request_failed";
    throw new TokenRequestError(response.status, code);
  }

  if (!body || typeof body !== "object") {
    throw new TokenRequestError(response.status, "invalid_response");
  }

  const candidate = body as Record<string, unknown>;
  const expiresAt = normalizeExpiresAt(candidate.expiresAt);
  if (
    typeof candidate.token !== "string" ||
    !candidate.token ||
    typeof candidate.url !== "string" ||
    !candidate.url ||
    typeof candidate.room !== "string" ||
    !candidate.room ||
    typeof candidate.identity !== "string" ||
    !candidate.identity ||
    expiresAt === null
  ) {
    throw new TokenRequestError(response.status, "invalid_response");
  }

  return {
    token: candidate.token,
    url: candidate.url,
    room: candidate.room,
    identity: candidate.identity,
    expiresAt,
  };
}

function describeError(error: unknown) {
  if (error instanceof TokenRequestError) {
    if (error.status === 401 || error.status === 403) {
      return "KIRA access was not authorized.";
    }
    if (error.status === 429) {
      return "KIRA is busy. Please wait a moment and try again.";
    }
    if (error.code === "network_error") {
      return "The KIRA service could not be reached.";
    }
    return "A KIRA session could not be created.";
  }

  if (error instanceof DOMException && error.name === "NotAllowedError") {
    return "Microphone permission was denied. Text chat is still available.";
  }
  if (error instanceof DOMException && error.name === "NotFoundError") {
    return "No microphone was found. Text chat is still available.";
  }
  if (error instanceof Error && error.message === "agent_not_ready") {
    return "KIRA took too long to join. Please try again.";
  }
  if (error instanceof Error && error.message) return error.message;
  return "The KIRA session could not start.";
}

function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === "AbortError";
}

function readAgentState(participant: RemoteParticipant): AgentState {
  const value = participant.attributes["lk.agent.state"];
  if (
    value === "initializing" ||
    value === "listening" ||
    value === "thinking" ||
    value === "speaking" ||
    value === "idle"
  ) {
    return value;
  }
  return "initializing";
}

function isAgentInputReady(participant: RemoteParticipant) {
  const value = participant.attributes["lk.agent.state"];
  return (
    value === "listening" ||
    value === "thinking" ||
    value === "speaking" ||
    value === "idle"
  );
}

export function VoiceSessionProvider({
  children,
  tokenEndpoint = "/api/livekit/token",
}: VoiceSessionProviderProps) {
  const pathname = usePathname() ?? "/";
  const [session, setSession] = useState<SessionSnapshot>(INITIAL_SESSION);
  const [sessionId, setSessionId] = useState("");
  const [transcriptMap, setTranscriptMap] = useState(
    () => new Map<string, VoiceTranscriptSegment>()
  );
  const [messageMap, setMessageMap] = useState(
    () => new Map<string, KiraMessage>()
  );
  const [currentPage, setCurrentPage] =
    useState<CompanionPageContext | null>(null);
  const [agentReady, setAgentReady] = useState(false);
  const [agentState, setAgentState] = useState<AgentState>("offline");
  const [microphoneEnabled, setMicrophoneEnabledState] = useState(false);
  const [isSendingText, setIsSendingText] = useState(false);

  const phaseRef = useRef<VoiceSessionPhase>("idle");
  const mountedRef = useRef(false);
  const sessionIdRef = useRef("");
  const roomRef = useRef<Room | null>(null);
  const connectionPromiseRef = useRef<Promise<void> | null>(null);
  const runGenerationRef = useRef(0);
  const tokenAbortRef = useRef<AbortController | null>(null);
  const audioContainerRef = useRef<HTMLDivElement>(null);
  const mouthLevelRef = useRef(0);
  const agentReadyRef = useRef(false);
  const agentIdentityRef = useRef<string | null>(null);
  const pageContextRef = useRef<CompanionPageContext | null>(null);
  const lastPagePathRef = useRef<string | null>(null);
  const lastPageMessageRef = useRef<KiraMessage | null>(null);
  const lastRecordedPagePathRef = useRef<string | null>(null);
  const engagementActiveRef = useRef(false);
  const loggedFinalMessagesRef = useRef(new Set<string>());
  const textSendGenerationRef = useRef(0);
  const isSendingTextRef = useRef(false);
  const microphoneRequestGenerationRef = useRef(0);

  const transition = useCallback(
    (phase: VoiceSessionPhase, patch: Partial<SessionSnapshot> = {}) => {
      phaseRef.current = phase;
      setSession((current) => ({ ...current, ...patch, phase }));
    },
    []
  );

  const appendMessage = useCallback((message: KiraMessage) => {
    setMessageMap((current) => {
      const next = new Map(current);
      next.set(message.id, message);
      while (next.size > 100) {
        const first = next.keys().next().value as string | undefined;
        if (!first) break;
        next.delete(first);
      }
      return next;
    });
  }, []);

  const recordPageView = useCallback((context: CompanionPageContext) => {
    if (
      !engagementActiveRef.current ||
      lastRecordedPagePathRef.current === context.path
    ) {
      return;
    }
    lastRecordedPagePathRef.current = context.path;
    enqueueCompanionEngagementEvent(sessionIdRef.current, {
      id: createId(),
      type: "page_view",
      path: context.path,
      channel: "page",
      content: `${context.title}: ${context.highlight}`,
      clientCreatedAt: context.capturedAt,
    });
  }, []);

  const activateEngagement = useCallback(() => {
    if (engagementActiveRef.current) return;
    engagementActiveRef.current = true;
    const context = pageContextRef.current;
    if (context) recordPageView(context);
  }, [recordPageView]);

  const recordMessage = useCallback((message: KiraMessage) => {
    if (
      !engagementActiveRef.current ||
      !message.isFinal ||
      loggedFinalMessagesRef.current.has(message.id)
    ) {
      return;
    }
    loggedFinalMessagesRef.current.add(message.id);
    enqueueCompanionEngagementEvent(sessionIdRef.current, {
      // The UI message id also carries channel information (for example
      // `voice-<segment-id>`). Persistence uses a separate UUID so the strict
      // server contract never depends on transport-specific id formats.
      id: createId(),
      type: "message",
      path: message.path,
      role: message.role,
      channel: message.channel,
      content: message.content,
      clientCreatedAt: new Date(message.createdAt).toISOString(),
    });
  }, []);

  const clearPlayback = useCallback(() => {
    const container = audioContainerRef.current;
    if (container) {
      container.querySelectorAll("audio, video").forEach((element) => {
        if (element instanceof HTMLMediaElement) {
          element.pause();
          element.srcObject = null;
        }
      });
      container.replaceChildren();
    }
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscriptMap(new Map());
    setMessageMap((current) => {
      const next = new Map(current);
      for (const [id, message] of Array.from(next.entries())) {
        if (message.channel === "voice") next.delete(id);
      }
      return next;
    });
  }, []);

  const publishPageContext = useCallback(async () => {
    const room = roomRef.current;
    const context = pageContextRef.current;
    const destination = agentIdentityRef.current;
    if (!room || !context || !agentReadyRef.current || !destination) return;

    const payload = serializePageContext(context);
    if (!payload) return;
    await room.localParticipant.sendText(payload, {
      topic: "portfolio.page_context",
      destinationIdentities: [destination],
    });
  }, []);

  const applyPageContext = useCallback(
    (context: CompanionPageContext) => {
      pageContextRef.current = context;
      setCurrentPage(context);

      if (lastPagePathRef.current !== context.path) {
        lastPagePathRef.current = context.path;
        const pageMessage: KiraMessage = {
          id: `page-${createId()}`,
          role: "assistant",
          content: formatPageHighlight(context),
          channel: "page",
          isFinal: true,
          createdAt: Date.now(),
          path: context.path,
        };
        lastPageMessageRef.current = pageMessage;
        appendMessage(pageMessage);
        recordMessage(pageMessage);
        recordPageView(context);
      } else if (lastPageMessageRef.current) {
        // The second capture can contain late-rendered route content. Update the
        // existing page card rather than locking in the first fallback summary.
        const pageMessage = {
          ...lastPageMessageRef.current,
          content: formatPageHighlight(context),
        };
        lastPageMessageRef.current = pageMessage;
        appendMessage(pageMessage);
      }

      void publishPageContext().catch(() => undefined);
    },
    [appendMessage, publishPageContext, recordMessage, recordPageView]
  );

  useEffect(() => {
    mountedRef.current = true;
    let nextSessionId = "";
    try {
      nextSessionId = window.sessionStorage.getItem("kira.sessionId") ?? "";
      if (!nextSessionId) {
        nextSessionId = createId();
        window.sessionStorage.setItem("kira.sessionId", nextSessionId);
      }
    } catch {
      nextSessionId = createId();
    }
    sessionIdRef.current = nextSessionId;
    setSessionId(nextSessionId);
    void flushCompanionEngagementEvents();

    return () => {
      mountedRef.current = false;
      runGenerationRef.current += 1;
      tokenAbortRef.current?.abort();
      tokenAbortRef.current = null;

      const room = roomRef.current;
      roomRef.current = null;
      room?.removeAllListeners();
      if (room) void room.disconnect();

      clearPlayback();
      void flushCompanionEngagementEvents();
    };
  }, [clearPlayback]);

  useEffect(() => {
    const capture = () => {
      const context = collectCompanionPageContext(pathname);
      if (context) applyPageContext(context);
    };

    // Effects run after the new route has committed, so this immediate capture
    // removes the old-page window. Re-capture once for late-rendered content.
    pageContextRef.current = null;
    setCurrentPage(null);
    capture();
    const timer = window.setTimeout(capture, 700);

    return () => window.clearTimeout(timer);
  }, [applyPageContext, pathname]);

  const connect = useCallback(async () => {
    if (connectionPromiseRef.current) return connectionPromiseRef.current;
    if (roomRef.current) return;

    const abortController = new AbortController();
    tokenAbortRef.current?.abort();
    tokenAbortRef.current = abortController;
    const generation = ++runGenerationRef.current;
    const isCurrentRun = () =>
      mountedRef.current &&
      runGenerationRef.current === generation &&
      !abortController.signal.aborted;

    transition("connecting", {
      error: null,
      roomName: null,
      identity: null,
      expiresAt: null,
    });

    const connection = (async () => {
      let room: Room | null = null;
      try {
        const [tokenPayload, livekit] = await Promise.all([
          requestToken(tokenEndpoint, abortController.signal),
          import("livekit-client"),
        ]);
        if (!isCurrentRun()) return;

        const { Room: LiveKitRoom, RoomEvent, Track } = livekit;
        room = new LiveKitRoom();
        roomRef.current = room;

        const registerAgent = (participant: RemoteParticipant) => {
          if (!participant.isAgent || !isCurrentRun()) return;
          agentIdentityRef.current = participant.identity;
          const ready = isAgentInputReady(participant);
          agentReadyRef.current = ready;
          setAgentReady(ready);
          setAgentState(readAgentState(participant));
          if (ready) void publishPageContext().catch(() => undefined);
        };

        const onTrackSubscribed = (
          track: RemoteTrack,
          _publication: RemoteTrackPublication,
          _participant: RemoteParticipant
        ) => {
          if (!isCurrentRun() || track.kind !== Track.Kind.Audio) return;
          const element = track.attach();
          element.autoplay = true;
          element.setAttribute("playsinline", "true");
          audioContainerRef.current?.appendChild(element);
        };

        const onTrackUnsubscribed = (track: RemoteTrack) => {
          track.detach().forEach((element) => element.remove());
        };

        const onLocalTrackUnpublished = (
          publication: LocalTrackPublication
        ) => {
          if (publication.source === Track.Source.Microphone) {
            setMicrophoneEnabledState(false);
          }
        };

        const onTranscriptionReceived = (
          segments: LiveKitTranscriptionSegment[],
          participant?: Participant
        ) => {
          if (!isCurrentRun()) return;
          const speaker: VoiceTranscriptSpeaker =
            participant?.identity === room?.localParticipant.identity
              ? "user"
              : "agent";
          const now = Date.now();

          setTranscriptMap((current) => {
            const next = new Map(current);
            for (const segment of segments) {
              const text = segment.text.trim();
              if (!text) continue;
              const existing = next.get(segment.id);
              const normalized: VoiceTranscriptSegment = {
                id: segment.id,
                speaker,
                text,
                isFinal: segment.final,
                firstReceivedAt:
                  existing?.firstReceivedAt || segment.firstReceivedTime || now,
                lastReceivedAt: segment.lastReceivedTime || now,
              };
              next.set(segment.id, normalized);
            }
            return next;
          });

          for (const segment of segments) {
            const text = segment.text.trim();
            if (!text) continue;
            const message: KiraMessage = {
              id: `voice-${segment.id}`,
              role: speaker === "user" ? "user" : "assistant",
              content: text,
              channel: "voice",
              isFinal: segment.final,
              createdAt: segment.firstReceivedTime || now,
              path: pageContextRef.current?.path ?? "/",
            };
            appendMessage(message);
            recordMessage(message);
          }
        };

        const onParticipantDisconnected = (participant: RemoteParticipant) => {
          if (participant.identity !== agentIdentityRef.current) return;
          agentIdentityRef.current = null;
          agentReadyRef.current = false;
          setAgentReady(false);
          setAgentState("offline");
        };

        const onAttributesChanged = (
          changed: Record<string, string>,
          participant: Participant
        ) => {
          if (
            participant.identity === agentIdentityRef.current &&
            "lk.agent.state" in changed
          ) {
            const remoteParticipant = participant as RemoteParticipant;
            const ready = isAgentInputReady(remoteParticipant);
            agentReadyRef.current = ready;
            setAgentReady(ready);
            setAgentState(readAgentState(remoteParticipant));
            if (ready) void publishPageContext().catch(() => undefined);
          }
        };

        const onDisconnected = () => {
          if (!isCurrentRun()) return;
          if (roomRef.current === room) roomRef.current = null;
          room?.removeAllListeners();
          clearPlayback();
          agentIdentityRef.current = null;
          agentReadyRef.current = false;
          setAgentReady(false);
          setAgentState("offline");
          setMicrophoneEnabledState(false);

          if (phaseRef.current === "ending") {
            transition("idle", INITIAL_SESSION);
          } else {
            transition("error", {
              error: "The KIRA session disconnected.",
              roomName: null,
              identity: null,
              expiresAt: null,
            });
          }
        };

        room.on(RoomEvent.ParticipantConnected, registerAgent);
        room.on(RoomEvent.ParticipantDisconnected, onParticipantDisconnected);
        room.on(RoomEvent.ParticipantAttributesChanged, onAttributesChanged);
        room.on(RoomEvent.TrackSubscribed, onTrackSubscribed);
        room.on(RoomEvent.TrackUnsubscribed, onTrackUnsubscribed);
        room.on(RoomEvent.LocalTrackUnpublished, onLocalTrackUnpublished);
        room.on(RoomEvent.TrackMuted, (publication, participant) => {
          if (
            participant.isLocal &&
            publication.source === Track.Source.Microphone
          ) {
            setMicrophoneEnabledState(false);
          }
        });
        room.on(RoomEvent.MediaDevicesError, (_error, kind) => {
          if (!kind || kind === "audioinput") {
            setMicrophoneEnabledState(false);
          }
        });
        room.on(RoomEvent.TranscriptionReceived, onTranscriptionReceived);
        room.on(RoomEvent.Disconnected, onDisconnected);

        await room.connect(tokenPayload.url, tokenPayload.token);
        if (!isCurrentRun()) {
          room.removeAllListeners();
          await room.disconnect().catch(() => undefined);
          return;
        }

        room.remoteParticipants.forEach(registerAgent);

        await room.startAudio().catch(() => undefined);
        if (tokenAbortRef.current === abortController) {
          tokenAbortRef.current = null;
        }
        transition("connected", {
          error: null,
          roomName: tokenPayload.room,
          identity: tokenPayload.identity,
          expiresAt: tokenPayload.expiresAt,
        });
      } catch (error) {
        if (!isCurrentRun() || isAbortError(error)) return;
        tokenAbortRef.current = null;
        if (roomRef.current === room) roomRef.current = null;
        room?.removeAllListeners();
        if (room) await room.disconnect().catch(() => undefined);
        clearPlayback();
        transition("error", {
          error: describeError(error),
          roomName: null,
          identity: null,
          expiresAt: null,
        });
        throw error;
      }
    })();

    connectionPromiseRef.current = connection;
    try {
      await connection;
    } finally {
      if (connectionPromiseRef.current === connection) {
        connectionPromiseRef.current = null;
      }
    }
  }, [
    appendMessage,
    clearPlayback,
    publishPageContext,
    recordMessage,
    tokenEndpoint,
    transition,
  ]);

  const waitForAgent = useCallback(async () => {
    const generation = runGenerationRef.current;
    const deadline = Date.now() + AGENT_READY_TIMEOUT_MS;
    while (Date.now() < deadline) {
      if (agentReadyRef.current && agentIdentityRef.current) return;
      if (!mountedRef.current || generation !== runGenerationRef.current) {
        throw new DOMException("Session changed", "AbortError");
      }
      await new Promise((resolve) =>
        window.setTimeout(resolve, AGENT_READY_POLL_MS)
      );
    }
    throw new Error("agent_not_ready");
  }, []);

  const enableMicrophone = useCallback(async () => {
    const requestGeneration = ++microphoneRequestGenerationRef.current;
    const isCurrentRequest = () =>
      mountedRef.current &&
      microphoneRequestGenerationRef.current === requestGeneration;
    const context = collectCompanionPageContext(pathname);
    if (context) applyPageContext(context);
    activateEngagement();
    try {
      await connect();
      if (!isCurrentRequest()) return;
      await waitForAgent();
    } catch (error) {
      if (!isCurrentRequest()) return;
      if (!isAbortError(error)) {
        setSession((current) => ({
          ...current,
          error: describeError(error),
        }));
      }
      return;
    }
    if (!isCurrentRequest()) return;
    const room = roomRef.current;
    if (!room) throw new Error("The KIRA room is unavailable.");

    try {
      await room.localParticipant.setMicrophoneEnabled(true);
      if (!isCurrentRequest()) {
        await room.localParticipant
          .setMicrophoneEnabled(false)
          .catch(() => undefined);
        return;
      }
      await room.startAudio().catch(() => undefined);
      setMicrophoneEnabledState(true);
      setSession((current) => ({ ...current, error: null }));
    } catch (error) {
      setMicrophoneEnabledState(false);
      setSession((current) => ({ ...current, error: describeError(error) }));
    }
  }, [
    activateEngagement,
    applyPageContext,
    connect,
    pathname,
    waitForAgent,
  ]);

  const start = useCallback(async () => {
    await enableMicrophone();
  }, [enableMicrophone]);

  const disableMicrophone = useCallback(async () => {
    microphoneRequestGenerationRef.current += 1;
    const room = roomRef.current;
    if (room) {
      const { Track } = await import("livekit-client");
      const publication = room.localParticipant.getTrackPublication(
        Track.Source.Microphone
      );
      if (publication?.track) {
        await room.localParticipant
          .unpublishTrack(publication.track, true)
          .catch(() => undefined);
      } else {
        await room.localParticipant
          .setMicrophoneEnabled(false)
          .catch(() => undefined);
      }
    }
    setMicrophoneEnabledState(false);
  }, []);

  const toggleMicrophone = useCallback(async () => {
    if (microphoneEnabled) {
      await disableMicrophone();
      return;
    }
    await enableMicrophone();
  }, [disableMicrophone, enableMicrophone, microphoneEnabled]);

  const sendText = useCallback(
    async (content: string, retryMessageId?: string) => {
      const text = normalizeCompanionPrompt(content);
      if (!text || isSendingTextRef.current) return;
      isSendingTextRef.current = true;
      const context = collectCompanionPageContext(pathname);
      if (context) applyPageContext(context);
      activateEngagement();
      const sendGeneration = ++textSendGenerationRef.current;
      const isCurrentSend = () =>
        mountedRef.current &&
        textSendGenerationRef.current === sendGeneration;

      const message: KiraMessage = {
        id: retryMessageId ?? `text-${createId()}`,
        role: "user",
        content: text,
        channel: "text",
        isFinal: true,
        createdAt: Date.now(),
        path: context?.path ?? pageContextRef.current?.path ?? pathname,
        deliveryStatus: "pending",
      };
      appendMessage(message);
      setIsSendingText(true);

      try {
        await connect();
        if (!isCurrentSend()) return;
        await waitForAgent();
        if (!isCurrentSend()) return;
        const room = roomRef.current;
        const destination = agentIdentityRef.current;
        if (!room || !destination) throw new Error("agent_not_ready");
        await room.localParticipant.sendText(
          serializeAtomicTextInput(
            text,
            context ?? pageContextRef.current
          ),
          {
            topic: "lk.chat",
            destinationIdentities: [destination],
          }
        );
        if (!isCurrentSend()) return;
        const sentMessage = { ...message, deliveryStatus: "sent" as const };
        appendMessage(sentMessage);
        recordMessage(sentMessage);
        setSession((current) => ({ ...current, error: null }));
      } catch (error) {
        if (!isCurrentSend()) return;
        appendMessage({ ...message, deliveryStatus: "failed" });
        if (!isAbortError(error)) {
          setSession((current) => ({
            ...current,
            error: describeError(error),
          }));
        }
      } finally {
        if (
          mountedRef.current &&
          textSendGenerationRef.current === sendGeneration
        ) {
          isSendingTextRef.current = false;
          setIsSendingText(false);
        }
      }
    },
    [
      appendMessage,
      applyPageContext,
      activateEngagement,
      connect,
      pathname,
      recordMessage,
      waitForAgent,
    ]
  );

  const end = useCallback(async () => {
    if (phaseRef.current === "ending") return;
    const generation = ++runGenerationRef.current;
    microphoneRequestGenerationRef.current += 1;
    textSendGenerationRef.current += 1;
    connectionPromiseRef.current = null;
    tokenAbortRef.current?.abort();
    tokenAbortRef.current = null;
    transition("ending", { error: null });

    const room = roomRef.current;
    roomRef.current = null;
    room?.removeAllListeners();
    if (room) await room.disconnect().catch(() => undefined);
    clearPlayback();
    agentIdentityRef.current = null;
    agentReadyRef.current = false;
    setAgentReady(false);
    setAgentState("offline");
    setMicrophoneEnabledState(false);
    isSendingTextRef.current = false;
    setIsSendingText(false);

    if (mountedRef.current && runGenerationRef.current === generation) {
      transition("idle", INITIAL_SESSION);
    }
  }, [clearPlayback, transition]);

  const resetConversation = useCallback(async () => {
    await end();
    setTranscriptMap(new Map());
    loggedFinalMessagesRef.current.clear();
    const context = pageContextRef.current;
    if (context) {
      const pageMessage: KiraMessage = {
        id: `page-${createId()}`,
        role: "assistant",
        content: formatPageHighlight(context),
        channel: "page",
        isFinal: true,
        createdAt: Date.now(),
        path: context.path,
      };
      lastPageMessageRef.current = pageMessage;
      setMessageMap(new Map([[pageMessage.id, pageMessage]]));
      recordMessage(pageMessage);
    } else {
      setMessageMap(new Map());
    }
  }, [end, recordMessage]);

  const transcriptSegments = useMemo(
    () => Array.from(transcriptMap.values()),
    [transcriptMap]
  );
  const messages = useMemo(() => Array.from(messageMap.values()), [messageMap]);
  const latestTranscript =
    transcriptSegments[transcriptSegments.length - 1] ?? null;
  const canStart =
    !microphoneEnabled &&
    session.phase !== "connecting" &&
    session.phase !== "ending";
  const canEnd = session.phase === "connected";
  const isThinking = agentState === "thinking";

  const value = useMemo<VoiceSessionContextValue>(
    () => ({
      ...session,
      sessionId,
      transcriptSegments,
      latestTranscript,
      messages,
      currentPage,
      agentReady,
      agentState,
      isThinking,
      isSendingText,
      microphoneEnabled,
      mouthLevelRef,
      canStart,
      canEnd,
      start,
      end,
      disableMicrophone,
      toggleMicrophone,
      sendText,
      clearTranscript,
      resetConversation,
    }),
    [
      agentReady,
      agentState,
      canEnd,
      canStart,
      clearTranscript,
      currentPage,
      disableMicrophone,
      end,
      isSendingText,
      isThinking,
      latestTranscript,
      messages,
      microphoneEnabled,
      resetConversation,
      sendText,
      session,
      sessionId,
      start,
      toggleMicrophone,
      transcriptSegments,
    ]
  );

  return (
    <VoiceSessionContext.Provider value={value}>
      {children}
      <div
        ref={audioContainerRef}
        aria-hidden="true"
        className="hidden"
        data-voice-audio-output="true"
      />
    </VoiceSessionContext.Provider>
  );
}

export function useVoiceSession() {
  const context = useContext(VoiceSessionContext);
  if (!context) {
    throw new Error("useVoiceSession must be used within VoiceSessionProvider");
  }
  return context;
}

export function useVoiceMouthLevelRef() {
  return useVoiceSession().mouthLevelRef;
}
