import assert from "node:assert/strict";
import test from "node:test";
import { formatDate } from "../../lib/formatDate";

test("keeps existing date-only article dates in UTC", () => {
  assert.equal(formatDate("2025-02-01"), "February 1, 2025");
  assert.equal(formatDate("2024-12-08"), "December 8, 2024");
  assert.equal(formatDate("2024-02-29"), "February 29, 2024");
});

test("formats Notion timestamps and resolves explicit offsets to UTC", () => {
  assert.equal(formatDate("2025-02-01T12:00:00.000Z"), "February 1, 2025");
  assert.equal(formatDate("2025-02-01T00:30:00+08:00"), "January 31, 2025");
  assert.equal(formatDate("2025-02-01T23:30:00-08:00"), "February 2, 2025");
  assert.equal(formatDate("2025-02-01T23:30:00"), "February 1, 2025");
});

test("does not invent a date for invalid or impossible values", () => {
  for (const value of [
    "",
    "not-a-date",
    "2025-02-29",
    "2025-02-30T12:00:00Z",
    "2025-13-01",
    "2025-02-01T25:00:00Z",
  ]) {
    assert.equal(formatDate(value), "Date unavailable", value);
  }
});
