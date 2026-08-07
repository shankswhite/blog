import assert from "node:assert/strict";
import test from "node:test";
import { normalizeNotionMarkdown } from "@/components/ContentMarkdown";

test("normalizes Notion callouts and toggles without dropping their content", () => {
  const normalized = normalizeNotionMarkdown(
    '<callout icon="💡">Important **note**</callout>\n' +
      "<details><summary>Read more</summary>Nested content</details>"
  );

  assert.match(normalized, /> Important \*\*note\*\*/);
  assert.match(normalized, /#### Read more/);
  assert.match(normalized, /Nested content/);
});

test("turns Notion file-like tags into portable safe markup", () => {
  const normalized = normalizeNotionMarkdown(
    '<file src="/notion-generated/report.pdf">Report</file>\n' +
      '<audio src="/notion-generated/sample.mp3">Sample</audio>'
  );

  assert.match(normalized, /\[Report\]\(\/notion-generated\/report\.pdf\)/);
  assert.match(normalized, /<audio controls/);
  assert.match(normalized, /\/notion-generated\/sample\.mp3/);
});
