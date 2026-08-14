import "server-only";

import { isIP } from "node:net";

import {
  AccessToken,
  RoomAgentDispatch,
  RoomConfiguration,
} from "livekit-server-sdk";
import { NextResponse } from "next/server";

import { getLiveKitRuntimeSecrets } from "@/lib/livekit-runtime-secrets";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const MAX_BODY_BYTES = 2 * 1024;
const TOKEN_TTL_SECONDS = 5 * 60;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_REQUESTS = 12;
const MAX_RATE_LIMIT_BUCKETS = 4_096;
const DEFAULT_AGENT_NAME = "kira-portfolio";
const AGENT_NAME_PATTERN = /^[A-Za-z0-9_.-]{1,64}$/;

type RateLimitBucket = {
  count: number;
  windowStartedAt: number;
};

type ErrorCode =
  | "invalid_origin"
  | "payload_too_large"
  | "unsupported_media_type"
  | "invalid_request_body"
  | "rate_limited"
  | "secure_configuration_unavailable"
  | "livekit_not_configured"
  | "livekit_configuration_invalid"
  | "token_generation_failed";

const rateLimitBuckets = new Map<string, RateLimitBucket>();

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();

  if (!isSameOriginRequest(request)) {
    return errorResponse(
      403,
      "invalid_origin",
      "This endpoint only accepts same-origin browser requests.",
      requestId,
    );
  }

  const rateLimit = claimRateLimitBucket(clientIp(request));
  if (!rateLimit.allowed) {
    return errorResponse(
      429,
      "rate_limited",
      "Too many token requests. Please try again shortly.",
      requestId,
      { "retry-after": String(rateLimit.retryAfterSeconds) },
    );
  }

  const body = await readLimitedBody(request, MAX_BODY_BYTES);
  if (body.kind === "too_large") {
    return errorResponse(
      413,
      "payload_too_large",
      "The request body is too large.",
      requestId,
    );
  }
  if (body.kind === "unreadable") {
    return errorResponse(
      400,
      "invalid_request_body",
      "The request body could not be read.",
      requestId,
    );
  }

  if (body.text.length > 0) {
    const mediaType = request.headers
      .get("content-type")
      ?.split(";", 1)[0]
      .trim()
      .toLowerCase();
    if (mediaType !== "application/json") {
      return errorResponse(
        415,
        "unsupported_media_type",
        "Use application/json for a non-empty request body.",
        requestId,
      );
    }

    try {
      const parsed = JSON.parse(body.text) as unknown;
      if (
        typeof parsed !== "object" ||
        parsed === null ||
        Array.isArray(parsed) ||
        Object.keys(parsed).length > 0
      ) {
        throw new TypeError("Expected an empty JSON object.");
      }
    } catch {
      return errorResponse(
        400,
        "invalid_request_body",
        "The request body must be an empty JSON object.",
        requestId,
      );
    }
  }

  let secrets: Awaited<ReturnType<typeof getLiveKitRuntimeSecrets>>;
  try {
    secrets = await getLiveKitRuntimeSecrets();
  } catch (error) {
    auditError(requestId, "secure_configuration_unavailable", error);
    return errorResponse(
      503,
      "secure_configuration_unavailable",
      "LiveKit configuration is temporarily unavailable.",
      requestId,
    );
  }

  if (!secrets.url || !secrets.apiKey || !secrets.apiSecret) {
    return errorResponse(
      503,
      "livekit_not_configured",
      "LiveKit is not configured for this deployment.",
      requestId,
    );
  }

  const url = parseLiveKitUrl(secrets.url);
  if (!url) {
    return errorResponse(
      503,
      "livekit_configuration_invalid",
      "The LiveKit server URL is not valid for this deployment.",
      requestId,
    );
  }

  const room = crypto.randomUUID();
  const identity = crypto.randomUUID();
  const configuredAgentName =
    process.env.LIVEKIT_AGENT_NAME?.trim() || DEFAULT_AGENT_NAME;
  if (!AGENT_NAME_PATTERN.test(configuredAgentName)) {
    return errorResponse(
      503,
      "livekit_configuration_invalid",
      "The LiveKit agent name is not valid for this deployment.",
      requestId,
    );
  }
  const expiresAtSeconds = Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS;

  try {
    const accessToken = new AccessToken(secrets.apiKey, secrets.apiSecret, {
      identity,
      ttl: TOKEN_TTL_SECONDS,
    });
    accessToken.addGrant({
      room,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });
    // A named dispatch prevents this portfolio session from being picked up by
    // an unrelated default worker that happens to share the LiveKit project.
    accessToken.roomConfig = new RoomConfiguration({
      agents: [new RoomAgentDispatch({ agentName: configuredAgentName })],
    });

    const token = await accessToken.toJwt();
    return jsonResponse(200, {
      token,
      url,
      room,
      identity,
      expiresAt: new Date(expiresAtSeconds * 1000).toISOString(),
    });
  } catch (error) {
    auditError(requestId, "token_generation_failed", error);
    return errorResponse(
      500,
      "token_generation_failed",
      "A LiveKit token could not be created.",
      requestId,
    );
  }
}

function isSameOriginRequest(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin || origin === "null") return false;

  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin") return false;

  try {
    const requestUrl = new URL(request.url);
    const forwardedHost = firstForwardedValue(
      request.headers.get("x-forwarded-host"),
    );
    const host = forwardedHost || request.headers.get("host") || requestUrl.host;
    const forwardedProtocol = firstForwardedValue(
      request.headers.get("x-forwarded-proto"),
    );
    const protocol = forwardedProtocol || requestUrl.protocol.slice(0, -1);
    if (protocol !== "http" && protocol !== "https") return false;

    const expectedOrigin = new URL(`${protocol}://${host}`).origin;
    return new URL(origin).origin === expectedOrigin;
  } catch {
    return false;
  }
}

function firstForwardedValue(value: string | null): string | undefined {
  return value?.split(",", 1)[0]?.trim() || undefined;
}

function parseLiveKitUrl(value: string): string | undefined {
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "wss:" && parsed.protocol !== "ws:") {
      return undefined;
    }
    if (
      !parsed.hostname ||
      parsed.username ||
      parsed.password ||
      parsed.pathname !== "/" ||
      parsed.search ||
      parsed.hash
    ) {
      return undefined;
    }
    if (process.env.NODE_ENV === "production" && parsed.protocol !== "wss:") {
      return undefined;
    }

    return parsed.toString().replace(/\/$/, "");
  } catch {
    return undefined;
  }
}

function clientIp(request: Request): string {
  const directHeaders = [
    request.headers.get("cf-connecting-ip"),
    request.headers.get("cloudfront-viewer-address"),
    request.headers.get("x-real-ip"),
  ];
  for (const value of directHeaders) {
    const ip = normalizeIp(value);
    if (ip) return ip;
  }

  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    for (const value of forwardedFor.split(",")) {
      const ip = normalizeIp(value);
      if (ip) return ip;
    }
  }

  return "unknown";
}

function normalizeIp(value: string | null): string | undefined {
  if (!value) return undefined;
  let candidate = value.trim();
  if (!candidate) return undefined;

  if (candidate.startsWith("[")) {
    const bracket = candidate.indexOf("]");
    if (bracket > 1) candidate = candidate.slice(1, bracket);
  } else {
    const ipv4WithPort = candidate.match(/^(\d{1,3}(?:\.\d{1,3}){3}):\d+$/);
    if (ipv4WithPort) candidate = ipv4WithPort[1];
  }

  return isIP(candidate) ? candidate : undefined;
}

function claimRateLimitBucket(ip: string):
  | { allowed: true }
  | { allowed: false; retryAfterSeconds: number } {
  const now = Date.now();
  pruneRateLimitBuckets(now);

  const current = rateLimitBuckets.get(ip);
  if (!current || now - current.windowStartedAt >= RATE_LIMIT_WINDOW_MS) {
    if (!current && rateLimitBuckets.size >= MAX_RATE_LIMIT_BUCKETS) {
      const oldestKey = rateLimitBuckets.keys().next().value as
        | string
        | undefined;
      if (oldestKey) rateLimitBuckets.delete(oldestKey);
    }
    rateLimitBuckets.set(ip, { count: 1, windowStartedAt: now });
    return { allowed: true };
  }

  if (current.count >= RATE_LIMIT_REQUESTS) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(
        1,
        Math.ceil(
          (RATE_LIMIT_WINDOW_MS - (now - current.windowStartedAt)) / 1000,
        ),
      ),
    };
  }

  current.count += 1;
  return { allowed: true };
}

function pruneRateLimitBuckets(now: number) {
  rateLimitBuckets.forEach((bucket, ip) => {
    if (now - bucket.windowStartedAt >= RATE_LIMIT_WINDOW_MS) {
      rateLimitBuckets.delete(ip);
    }
  });
}

async function readLimitedBody(
  request: Request,
  maxBytes: number,
): Promise<
  | { kind: "ok"; text: string }
  | { kind: "too_large" }
  | { kind: "unreadable" }
> {
  const declaredLengthHeader = request.headers.get("content-length");
  if (declaredLengthHeader !== null) {
    const declaredLength = Number(declaredLengthHeader);
    if (
      !Number.isInteger(declaredLength) ||
      declaredLength < 0 ||
      declaredLength > maxBytes
    ) {
      return declaredLength > maxBytes
        ? { kind: "too_large" }
        : { kind: "unreadable" };
    }
  }

  if (!request.body) return { kind: "ok", text: "" };

  const chunks: Uint8Array[] = [];
  const reader = request.body.getReader();
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > maxBytes) {
        await reader.cancel();
        return { kind: "too_large" };
      }
      chunks.push(value);
    }
  } catch {
    return { kind: "unreadable" };
  } finally {
    reader.releaseLock();
  }

  const bytes = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return { kind: "ok", text: new TextDecoder().decode(bytes).trim() };
}

function errorResponse(
  status: number,
  code: ErrorCode,
  message: string,
  requestId: string,
  additionalHeaders: Record<string, string> = {},
) {
  return jsonResponse(
    status,
    { ok: false, code, message, requestId },
    additionalHeaders,
  );
}

function jsonResponse(
  status: number,
  body: Record<string, unknown>,
  additionalHeaders: Record<string, string> = {},
) {
  return NextResponse.json(body, {
    status,
    headers: {
      "cache-control": "no-store, max-age=0",
      pragma: "no-cache",
      "x-content-type-options": "nosniff",
      ...additionalHeaders,
    },
  });
}

function auditError(requestId: string, code: ErrorCode, error: unknown) {
  // Never include SSM paths, credentials, token contents, or server URLs.
  console.error(
    "[livekit-token]",
    JSON.stringify({
      requestId,
      code,
      errorName: error instanceof Error ? error.name : "UnknownError",
    }),
  );
}
