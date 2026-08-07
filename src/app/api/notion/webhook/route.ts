import "server-only";

import { verifyWebhookSignature } from "@notionhq/client";
import { NextResponse } from "next/server";

import {
  isStrictlyEnabled,
  parseAmplifyBuildWebhookUrl,
  parseNotionWebhookEvent,
  parseVerificationPayload,
  validateEventScope,
  type NotionWebhookEvent,
} from "@/lib/notion-webhook";
import {
  getNotionWebhookRuntimeSecrets,
  storeNotionWebhookVerificationToken,
} from "@/lib/runtime-secrets";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 256 * 1024;
const BUILD_WEBHOOK_TIMEOUT_MS = 10_000;
const EVENT_DEDUPLICATION_WINDOW_MS = 24 * 60 * 60 * 1000;
const claimedEventIds = new Map<string, number>();

type AuditAction =
  | "rejected"
  | "setup_token_stored"
  | "auto_publish_disabled"
  | "duplicate_ignored"
  | "build_triggered"
  | "build_trigger_failed";

type AuditResponse = {
  ok: boolean;
  code: string;
  action: AuditAction;
  auditId: string;
  eventId?: string;
  eventType?: string;
};

export async function POST(request: Request) {
  const auditId = crypto.randomUUID();
  const declaredLength = Number(request.headers.get("content-length"));

  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    return respond(413, {
      ok: false,
      code: "payload_too_large",
      action: "rejected",
      auditId,
    });
  }

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return respond(400, {
      ok: false,
      code: "body_read_failed",
      action: "rejected",
      auditId,
    });
  }

  if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
    return respond(413, {
      ok: false,
      code: "payload_too_large",
      action: "rejected",
      auditId,
    });
  }

  const initialJson = parseJson(rawBody);
  const verification = parseVerificationPayload(initialJson.value);

  if (verification.kind !== "not_verification") {
    if (!isStrictlyEnabled(process.env.NOTION_WEBHOOK_SETUP_MODE)) {
      return respond(403, {
        ok: false,
        code: "setup_mode_disabled",
        action: "rejected",
        auditId,
      });
    }

    if (verification.kind === "invalid_verification") {
      return respond(400, {
        ok: false,
        code: "invalid_verification_payload",
        action: "rejected",
        auditId,
      });
    }

    try {
      await storeNotionWebhookVerificationToken(verification.token);
    } catch {
      return respond(503, {
        ok: false,
        code: "verification_token_storage_failed",
        action: "rejected",
        auditId,
      });
    }

    auditLog({
      auditId,
      action: "setup_token_stored",
      code: "verification_token_stored",
      status: 200,
    });

    return respond(200, {
      ok: true,
      code: "verification_token_stored",
      action: "setup_token_stored",
      auditId,
    });
  }

  let runtimeSecrets: Awaited<
    ReturnType<typeof getNotionWebhookRuntimeSecrets>
  >;
  try {
    runtimeSecrets = await getNotionWebhookRuntimeSecrets();
  } catch {
    return respond(503, {
      ok: false,
      code: "secure_configuration_unavailable",
      action: "rejected",
      auditId,
    });
  }

  const verificationToken = runtimeSecrets.verificationToken;
  if (!verificationToken) {
    return respond(503, {
      ok: false,
      code: "verification_token_not_configured",
      action: "rejected",
      auditId,
    });
  }

  const signature = request.headers.get("x-notion-signature");
  let signatureIsValid = false;
  try {
    signatureIsValid = await verifyWebhookSignature({
      body: rawBody,
      signature,
      verificationToken,
    });
  } catch {
    return respond(500, {
      ok: false,
      code: "signature_verification_failed",
      action: "rejected",
      auditId,
    });
  }

  if (!signatureIsValid) {
    return respond(401, {
      ok: false,
      code: "invalid_signature",
      action: "rejected",
      auditId,
    });
  }

  if (!initialJson.ok) {
    return respond(400, {
      ok: false,
      code: "invalid_json",
      action: "rejected",
      auditId,
    });
  }

  const parsedEvent = parseNotionWebhookEvent(initialJson.value);
  if (!parsedEvent.ok) {
    return respond(parsedEvent.code === "unsupported_event_type" ? 422 : 400, {
      ok: false,
      code: parsedEvent.code,
      action: "rejected",
      auditId,
    });
  }

  const event = parsedEvent.event;
  const scope = validateEventScope(event, {
    workspaceId: optionalEnv(process.env.NOTION_WEBHOOK_WORKSPACE_ID),
    subscriptionId: optionalEnv(
      process.env.NOTION_WEBHOOK_SUBSCRIPTION_ID,
    ),
  });

  if (!scope.ok) {
    return respond(scope.code === "scope_mismatch" ? 403 : 500, {
      ok: false,
      code: scope.code,
      action: "rejected",
      auditId,
      eventId: event.id,
      eventType: event.type,
    });
  }

  const autoPublishEnabled = isStrictlyEnabled(
    process.env.NOTION_AUTO_PUBLISH_ENABLED,
  );
  if (!autoPublishEnabled) {
    auditEvent(auditId, event, "auto_publish_disabled", 202);
    return respond(202, {
      ok: true,
      code: "auto_publish_disabled",
      action: "auto_publish_disabled",
      auditId,
      eventId: event.id,
      eventType: event.type,
    });
  }

  if (
    !isStrictlyEnabled(
      process.env.NOTION_ALLOW_BEST_EFFORT_DEDUPLICATION,
    )
  ) {
    auditEvent(auditId, event, "auto_publish_disabled", 202);
    return respond(202, {
      ok: true,
      code: "best_effort_deduplication_not_acknowledged",
      action: "auto_publish_disabled",
      auditId,
      eventId: event.id,
      eventType: event.type,
    });
  }

  const buildWebhook = parseAmplifyBuildWebhookUrl(
    runtimeSecrets.amplifyBuildWebhookUrl,
  );
  if (!buildWebhook.ok) {
    return respond(buildWebhook.code === "missing_build_webhook" ? 503 : 500, {
      ok: false,
      code: buildWebhook.code,
      action: "rejected",
      auditId,
      eventId: event.id,
      eventType: event.type,
    });
  }

  if (!claimEvent(event.id)) {
    auditEvent(auditId, event, "duplicate_ignored", 200);
    return respond(200, {
      ok: true,
      code: "duplicate_event_ignored",
      action: "duplicate_ignored",
      auditId,
      eventId: event.id,
      eventType: event.type,
    });
  }

  let upstreamStatus: number;
  try {
    const buildResponse = await fetch(buildWebhook.url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{}",
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(BUILD_WEBHOOK_TIMEOUT_MS),
    });
    upstreamStatus = buildResponse.status;

    if (!buildResponse.ok) {
      claimedEventIds.delete(event.id);
      auditEvent(auditId, event, "build_trigger_failed", 502, {
        upstreamStatus,
      });
      return respond(502, {
        ok: false,
        code: "build_webhook_rejected",
        action: "build_trigger_failed",
        auditId,
        eventId: event.id,
        eventType: event.type,
      });
    }
  } catch (error) {
    claimedEventIds.delete(event.id);
    auditEvent(auditId, event, "build_trigger_failed", 502, {
      errorName: error instanceof Error ? error.name : "UnknownError",
    });
    return respond(502, {
      ok: false,
      code: "build_webhook_unreachable",
      action: "build_trigger_failed",
      auditId,
      eventId: event.id,
      eventType: event.type,
    });
  }

  auditEvent(auditId, event, "build_triggered", 200, { upstreamStatus });
  return respond(200, {
    ok: true,
    code: "build_triggered",
    action: "build_triggered",
    auditId,
    eventId: event.id,
    eventType: event.type,
  });
}

function claimEvent(eventId: string): boolean {
  const now = Date.now();
  claimedEventIds.forEach((claimedAt, id) => {
    if (now - claimedAt > EVENT_DEDUPLICATION_WINDOW_MS) {
      claimedEventIds.delete(id);
    }
  });

  if (claimedEventIds.has(eventId)) return false;
  claimedEventIds.set(eventId, now);
  return true;
}

function respond(status: number, body: AuditResponse) {
  if (body.action === "rejected") {
    auditLog({
      auditId: body.auditId,
      eventId: body.eventId,
      eventType: body.eventType,
      action: body.action,
      code: body.code,
      status,
    });
  }

  return NextResponse.json(body, {
    status,
    headers: {
      "cache-control": "no-store",
      "x-notion-webhook-audit-id": body.auditId,
    },
  });
}

function auditEvent(
  auditId: string,
  event: NotionWebhookEvent,
  action: AuditAction,
  status: number,
  extra: Record<string, string | number> = {},
) {
  auditLog({
    auditId,
    eventId: event.id,
    eventType: event.type,
    action,
    code: action,
    status,
    ...extra,
  });
}

function auditLog(entry: Record<string, unknown>) {
  // Never include raw bodies, signatures, verification tokens, or webhook URLs.
  console.info("[notion-webhook]", JSON.stringify(entry));
}

function parseJson(rawBody: string):
  | { ok: true; value: unknown }
  | { ok: false; value: undefined } {
  try {
    return { ok: true, value: JSON.parse(rawBody) as unknown };
  } catch {
    return { ok: false, value: undefined };
  }
}

function optionalEnv(value: string | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}
