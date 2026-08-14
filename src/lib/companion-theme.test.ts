import assert from "node:assert/strict";
import test from "node:test";
import { resolveCompanionTheme } from "./companion/theme";

test("resolves each supported AI companion deep-link theme", () => {
  assert.equal(resolveCompanionTheme("rift"), "rift");
  assert.equal(resolveCompanionTheme("operator"), "operator");
  assert.equal(resolveCompanionTheme("dual"), "dual");
});

test("uses the first repeated query value and safely falls back", () => {
  assert.equal(resolveCompanionTheme(["operator", "dual"]), "operator");
  assert.equal(resolveCompanionTheme("unknown"), "rift");
  assert.equal(resolveCompanionTheme(undefined), "rift");
  assert.equal(resolveCompanionTheme([]), "rift");
});
