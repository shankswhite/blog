import "server-only";

import { createHmac, randomBytes } from "node:crypto";
import { isIP } from "node:net";
import { NextResponse } from "next/server";

import {
  CompanionEngagementConfigurationError,
  storeCompanionLead,
  type CompanionLead,
} from "@/lib/companion-engagement-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const MAX_BODY_BYTES = 16 * 1024;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_REQUESTS = 5;
const MAX_RATE_LIMIT_BUCKETS = 4_096;
const DEFAULT_FORMSPREE_ID = "mpqqwdgr";
const FORMSPREE_ID_PATTERN = /^[A-Za-z0-9_-]{4,64}$/;
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const PATH_CONTROL_CHARACTER_PATTERN = /[\u0000-\u001f\u007f]/;
const TEXT_CONTROL_CHARACTER_PATTERN =
  /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const rateLimitSalt = randomBytes(32);

type RateLimitBucket = {
  count: number;
  windowStartedAt: number;
};

type LeadPayload = CompanionLead & { website: string };

type ErrorCode =
  | "invalid_origin"
  | "unsupported_media_type"
  | "payload_too_large"
  | "invalid_request_body"
  | "rate_limited"
  | "storage_not_configured"
  | "storage_unavailable";

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

  const rateLimit = claimRateLimitBucket(rateLimitKey(request));
  if (!rateLimit.allowed) {
    return errorResponse(
      429,
      "rate_limited",
      "Too many lead requests. Please try again later.",
      requestId,
      { "retry-after": String(rateLimit.retryAfterSeconds) },
    );
  }

  if (mediaType(request) !== "application/json") {
    return errorResponse(
      415,
      "unsupported_media_type",
      "Use application/json.",
      requestId,
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

  const payload = parsePayload(body.text);
  if (!payload) {
    return errorResponse(
      400,
      "invalid_request_body",
      "The lead payload is invalid.",
      requestId,
    );
  }

  // Silently accept honeypot submissions without persisting or notifying.
  if (payload.website) {
    return jsonResponse(201, {
      ok: true,
      stored: true,
      notified: true,
      requestId,
    });
  }

  try {
    const { website: _website, ...lead } = payload;
    const result = await storeCompanionLead(lead);
    const notified = result.inserted
      ? await notifyFormspree(lead, requestId)
      : false;

    return jsonResponse(notified ? 201 : 202, {
      ok: true,
      stored: true,
      notified,
      duplicate: !result.inserted,
      requestId,
    });
  } catch (error) {
    const configurationError =
      error instanceof CompanionEngagementConfigurationError;
    auditError(
      requestId,
      configurationError ? "storage_not_configured" : "storage_unavailable",
      error,
    );
    return errorResponse(
      503,
      configurationError ? "storage_not_configured" : "storage_unavailable",
      configurationError
        ? "Companion lead storage is not configured."
        : "Companion lead storage is temporarily unavailable.",
      requestId,
    );
  }
}

function parsePayload(text: string): LeadPayload | undefined {
  let candidate: unknown;
  try {
    candidate = JSON.parse(text);
  } catch {
    return undefined;
  }

  if (
    !isRecord(candidate) ||
    !hasOnlyKeys(candidate, [
      "sessionId",
      "id",
      "name",
      "email",
      "interest",
      "message",
      "consent",
      "website",
      "path",
    ]) ||
    typeof candidate.sessionId !== "string" ||
    !UUID_PATTERN.test(candidate.sessionId) ||
    typeof candidate.id !== "string" ||
    !UUID_PATTERN.test(candidate.id) ||
    typeof candidate.name !== "string" ||
    typeof candidate.email !== "string" ||
    typeof candidate.interest !== "string" ||
    typeof candidate.message !== "string" ||
    candidate.consent !== true ||
    typeof candidate.website !== "string" ||
    !isSafePath(candidate.path)
  ) {
    return undefined;
  }

  const name = candidate.name.trim();
  const email = candidate.email.trim();
  const interest = candidate.interest.trim();
  const message = candidate.message.trim();
  const website = candidate.website?.trim() ?? "";

  if (
    name.length > 80 ||
    email.length > 254 ||
    interest.length > 120 ||
    message.length > 2_000 ||
    website.length > 200 ||
    TEXT_CONTROL_CHARACTER_PATTERN.test(name) ||
    TEXT_CONTROL_CHARACTER_PATTERN.test(email) ||
    TEXT_CONTROL_CHARACTER_PATTERN.test(interest) ||
    TEXT_CONTROL_CHARACTER_PATTERN.test(message) ||
    !email ||
    !EMAIL_PATTERN.test(email)
  ) {
    return undefined;
  }

  return {
    sessionId: candidate.sessionId.toLowerCase(),
    id: candidate.id.toLowerCase(),
    name,
    email,
    interest,
    message,
    consent: true,
    website,
    path: candidate.path,
  };
}

async function notifyFormspree(lead: CompanionLead, requestId: string) {
  const formId =
    process.env.COMPANION_LEAD_FORMSPREE_ID?.trim() || DEFAULT_FORMSPREE_ID;
  if (!FORMSPREE_ID_PATTERN.test(formId)) {
    auditNotificationFailure(requestId, "InvalidFormspreeId");
    return false;
  }

  try {
    const response = await fetch(`https://formspree.io/f/${formId}`, {
      method: "POST",
      cache: "no-store",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        name: lead.name,
        email: lead.email,
        interest: lead.interest,
        message: lead.message,
        path: lead.path,
        _subject: "New AI companion lead",
      }),
      signal: AbortSignal.timeout(8_000),
    });

    if (!response.ok) {
      auditNotificationFailure(requestId, `FormspreeHttp${response.status}`);
      return false;
    }
    return true;
  } catch (error) {
    auditNotificationFailure(
      requestId,
      error instanceof Error ? error.name : "UnknownError",
    );
    return false;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasOnlyKeys(
  value: Record<string, unknown>,
  allowedKeys: string[],
) {
  return Object.keys(value).every((key) => allowedKeys.includes(key));
}

function isSafePath(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    value.length <= 1_024 &&
    value.startsWith("/") &&
    !value.startsWith("//") &&
    !value.includes("?") &&
    !value.includes("#") &&
    !PATH_CONTROL_CHARACTER_PATTERN.test(value)
  );
}

function mediaType(request: Request) {
  return request.headers
    .get("content-type")
    ?.split(";", 1)[0]
    .trim()
    .toLowerCase();
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

    return new URL(origin).origin === new URL(`${protocol}://${host}`).origin;
  } catch {
    return false;
  }
}

function firstForwardedValue(value: string | null) {
  return value?.split(",", 1)[0]?.trim() || undefined;
}

function clientIp(request: Request) {
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

function normalizeIp(value: string | null) {
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

function rateLimitKey(request: Request) {
  return createHmac("sha256", rateLimitSalt)
    .update(clientIp(request))
    .digest("base64url");
}

function claimRateLimitBucket(key: string):
  | { allowed: true }
  | { allowed: false; retryAfterSeconds: number } {
  const now = Date.now();
  pruneRateLimitBuckets(now);
  const current = rateLimitBuckets.get(key);

  if (!current || now - current.windowStartedAt >= RATE_LIMIT_WINDOW_MS) {
    if (!current && rateLimitBuckets.size >= MAX_RATE_LIMIT_BUCKETS) {
      const oldestKey = rateLimitBuckets.keys().next().value as
        | string
        | undefined;
      if (oldestKey) rateLimitBuckets.delete(oldestKey);
    }
    rateLimitBuckets.set(key, { count: 1, windowStartedAt: now });
    return { allowed: true };
  }

  if (current.count >= RATE_LIMIT_REQUESTS) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(
        1,
        Math.ceil(
          (RATE_LIMIT_WINDOW_MS - (now - current.windowStartedAt)) / 1_000,
        ),
      ),
    };
  }

  current.count += 1;
  return { allowed: true };
}

function pruneRateLimitBuckets(now: number) {
  rateLimitBuckets.forEach((bucket, key) => {
    if (now - bucket.windowStartedAt >= RATE_LIMIT_WINDOW_MS) {
      rateLimitBuckets.delete(key);
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
  // Never log lead fields, paths, IP addresses, headers, or request bodies.
  console.error(
    "[companion-lead]",
    JSON.stringify({
      requestId,
      code,
      errorName: error instanceof Error ? error.name : "UnknownError",
    }),
  );
}

function auditNotificationFailure(requestId: string, errorName: string) {
  console.error(
    "[companion-lead-notification]",
    JSON.stringify({ requestId, code: "notification_failed", errorName }),
  );
}
