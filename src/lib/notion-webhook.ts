export const ALLOWED_NOTION_WEBHOOK_EVENT_TYPES = [
  "page.created",
  "page.content_updated",
  "page.properties_updated",
  "page.deleted",
  "page.undeleted",
  "page.moved",
  "data_source.content_updated",
  "data_source.schema_updated",
] as const;

export type AllowedNotionWebhookEventType =
  (typeof ALLOWED_NOTION_WEBHOOK_EVENT_TYPES)[number];

export type NotionWebhookEvent = {
  id: string;
  timestamp: string;
  workspaceId: string;
  subscriptionId: string;
  type: AllowedNotionWebhookEventType;
  entity: {
    id: string;
    type: "page" | "data_source";
  };
};

export type WebhookEventParseResult =
  | { ok: true; event: NotionWebhookEvent }
  | {
      ok: false;
      code: "invalid_event" | "unsupported_event_type";
      detail: string;
    };

export type VerificationPayloadResult =
  | { kind: "verification"; token: string }
  | { kind: "invalid_verification" }
  | { kind: "not_verification" };

export type ScopeValidationResult =
  | { ok: true }
  | {
      ok: false;
      code: "invalid_scope_configuration" | "scope_mismatch";
      field: "workspace_id" | "subscription_id";
    };

const notionIdPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const allowedEventTypes = new Set<string>(
  ALLOWED_NOTION_WEBHOOK_EVENT_TYPES,
);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isStrictlyEnabled(value: string | undefined): boolean {
  return value === "true";
}

export function parseVerificationPayload(
  parsedBody: unknown,
): VerificationPayloadResult {
  if (!isRecord(parsedBody) || !("verification_token" in parsedBody)) {
    return { kind: "not_verification" };
  }

  const keys = Object.keys(parsedBody);
  const token = parsedBody.verification_token;

  if (
    keys.length !== 1 ||
    typeof token !== "string" ||
    token.length === 0 ||
    token.length > 2_048
  ) {
    return { kind: "invalid_verification" };
  }

  return { kind: "verification", token };
}

export function parseNotionWebhookEvent(
  parsedBody: unknown,
): WebhookEventParseResult {
  if (!isRecord(parsedBody)) {
    return invalidEvent("Body must be a JSON object.");
  }

  const type = parsedBody.type;
  if (typeof type !== "string") {
    return invalidEvent("Event type is required.");
  }

  if (!allowedEventTypes.has(type)) {
    return {
      ok: false,
      code: "unsupported_event_type",
      detail: "This signed event type is not configured to trigger publishing.",
    };
  }

  if (
    !isNotionId(parsedBody.id) ||
    typeof parsedBody.timestamp !== "string" ||
    !Number.isFinite(Date.parse(parsedBody.timestamp)) ||
    !isNotionId(parsedBody.workspace_id) ||
    !isNotionId(parsedBody.subscription_id) ||
    !isRecord(parsedBody.entity) ||
    !isNotionId(parsedBody.entity.id)
  ) {
    return invalidEvent("Event metadata is missing or malformed.");
  }

  const expectedEntityType = type.startsWith("page.")
    ? "page"
    : "data_source";

  if (parsedBody.entity.type !== expectedEntityType) {
    return invalidEvent("Event entity type does not match the event type.");
  }

  return {
    ok: true,
    event: {
      id: parsedBody.id,
      timestamp: parsedBody.timestamp,
      workspaceId: parsedBody.workspace_id,
      subscriptionId: parsedBody.subscription_id,
      type: type as AllowedNotionWebhookEventType,
      entity: {
        id: parsedBody.entity.id,
        type: expectedEntityType,
      },
    },
  };
}

export function validateEventScope(
  event: Pick<NotionWebhookEvent, "workspaceId" | "subscriptionId">,
  configuredScope: {
    workspaceId?: string;
    subscriptionId?: string;
  },
): ScopeValidationResult {
  const checks = [
    {
      field: "workspace_id" as const,
      configured: configuredScope.workspaceId,
      received: event.workspaceId,
    },
    {
      field: "subscription_id" as const,
      configured: configuredScope.subscriptionId,
      received: event.subscriptionId,
    },
  ];

  for (const check of checks) {
    if (check.configured === undefined || check.configured.length === 0) {
      continue;
    }

    if (!isNotionId(check.configured)) {
      return {
        ok: false,
        code: "invalid_scope_configuration",
        field: check.field,
      };
    }

    if (check.configured !== check.received) {
      return { ok: false, code: "scope_mismatch", field: check.field };
    }
  }

  return { ok: true };
}

export function parseAmplifyBuildWebhookUrl(
  rawValue: string | undefined,
):
  | { ok: true; url: URL }
  | { ok: false; code: "missing_build_webhook" | "invalid_build_webhook" } {
  if (rawValue === undefined || rawValue.length === 0) {
    return { ok: false, code: "missing_build_webhook" };
  }

  try {
    const url = new URL(rawValue);
    if (
      url.protocol !== "https:" ||
      url.username.length > 0 ||
      url.password.length > 0 ||
      url.hash.length > 0
    ) {
      return { ok: false, code: "invalid_build_webhook" };
    }

    return { ok: true, url };
  } catch {
    return { ok: false, code: "invalid_build_webhook" };
  }
}

function invalidEvent(detail: string): WebhookEventParseResult {
  return { ok: false, code: "invalid_event", detail };
}

function isNotionId(value: unknown): value is string {
  return typeof value === "string" && notionIdPattern.test(value);
}
