import assert from "node:assert/strict";
import test from "node:test";

import {
  isStrictlyEnabled,
  parseAmplifyBuildWebhookUrl,
  parseNotionWebhookEvent,
  parseVerificationPayload,
  validateEventScope,
} from "./notion-webhook";

const workspaceId = "13950b26-c203-4f3b-b97d-93ec06319565";
const subscriptionId = "29d75c0d-5546-4414-8459-7b7a92f1fc4b";

function pageEvent(overrides: Record<string, unknown> = {}) {
  return {
    id: "56c3e00c-4f0c-4566-9676-4b058a50a03d",
    timestamp: "2026-08-07T12:00:00.000Z",
    workspace_id: workspaceId,
    subscription_id: subscriptionId,
    type: "page.content_updated",
    entity: {
      id: "0ef104cd-477e-80e1-8571-cfd10e92339a",
      type: "page",
    },
    ...overrides,
  };
}

test("feature flags are disabled unless the value is exactly true", () => {
  assert.equal(isStrictlyEnabled(undefined), false);
  assert.equal(isStrictlyEnabled("TRUE"), false);
  assert.equal(isStrictlyEnabled(" true "), false);
  assert.equal(isStrictlyEnabled("true"), true);
});

test("verification payload must contain only a bounded secret token", () => {
  assert.deepEqual(parseVerificationPayload({ verification_token: "secret" }), {
    kind: "verification",
    token: "secret",
  });
  assert.deepEqual(
    parseVerificationPayload({ verification_token: "secret", type: "page.created" }),
    { kind: "invalid_verification" },
  );
  assert.deepEqual(parseVerificationPayload({ verification_token: "" }), {
    kind: "invalid_verification",
  });
});

test("only the configured page and data source events are accepted", () => {
  assert.equal(parseNotionWebhookEvent(pageEvent()).ok, true);

  assert.equal(
    parseNotionWebhookEvent(
      pageEvent({
        type: "data_source.schema_updated",
        entity: {
          id: "153104cd-477e-80eb-ae76-e1c2a32c7b35",
          type: "data_source",
        },
      }),
    ).ok,
    true,
  );

  const unsupported = parseNotionWebhookEvent(
    pageEvent({ type: "comment.created" }),
  );
  assert.equal(unsupported.ok, false);
  if (!unsupported.ok) {
    assert.equal(unsupported.code, "unsupported_event_type");
  }
});

test("event and entity types must agree", () => {
  const result = parseNotionWebhookEvent(
    pageEvent({ entity: { id: workspaceId, type: "data_source" } }),
  );
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.code, "invalid_event");
  }
});

test("configured workspace and subscription scopes must match exactly", () => {
  const event = { workspaceId, subscriptionId };
  assert.deepEqual(validateEventScope(event, {}), { ok: true });
  assert.deepEqual(
    validateEventScope(event, { workspaceId, subscriptionId }),
    { ok: true },
  );
  assert.deepEqual(
    validateEventScope(event, {
      workspaceId: "00000000-0000-0000-0000-000000000000",
    }),
    { ok: false, code: "scope_mismatch", field: "workspace_id" },
  );
  assert.deepEqual(
    validateEventScope(event, { subscriptionId: "not-a-notion-id" }),
    {
      ok: false,
      code: "invalid_scope_configuration",
      field: "subscription_id",
    },
  );
});

test("build webhook configuration only accepts credential-free HTTPS URLs", () => {
  assert.equal(parseAmplifyBuildWebhookUrl(undefined).ok, false);
  assert.equal(
    parseAmplifyBuildWebhookUrl("http://example.com/build").ok,
    false,
  );
  assert.equal(
    parseAmplifyBuildWebhookUrl("https://user:pass@example.com/build").ok,
    false,
  );
  assert.equal(
    parseAmplifyBuildWebhookUrl("https://example.com/build?token=secret").ok,
    true,
  );
});
