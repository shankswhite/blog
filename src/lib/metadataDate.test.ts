import assert from "node:assert/strict";
import test from "node:test";
import { toMetadataDateTime } from "./metadataDate";

test("does not fabricate a date or timezone for missing, invalid, or ambiguous source values", () => {
  for (const value of [undefined, "", "2025-02-29", "2025-02-30", "not-a-date", "2026-09-13T12:00:00"]) {
    assert.equal(toMetadataDateTime(value), value);
  }
});
