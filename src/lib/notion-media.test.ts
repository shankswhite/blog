import assert from "node:assert/strict";
import test from "node:test";

import {
  mediaExtensionForContentType,
  parseTemporaryNotionMediaUrl,
} from "./notion-media";

const awsSignature =
  "X-Amz-Algorithm=AWS4-HMAC-SHA256&" +
  "X-Amz-Credential=credential&" +
  "X-Amz-Date=20260807T000000Z&" +
  "X-Amz-Expires=3600&" +
  "X-Amz-Signature=signature";

test("accepts the exact signed Notion S3 URL shapes", () => {
  assert.ok(
    parseTemporaryNotionMediaUrl(
      `https://s3.us-west-2.amazonaws.com/secure.notion-static.com/file.png?${awsSignature}`,
    ),
  );
  assert.ok(
    parseTemporaryNotionMediaUrl(
      `https://prod-files-secure.s3.us-west-2.amazonaws.com/workspace/file.png?${awsSignature}`,
    ),
  );
  assert.ok(
    parseTemporaryNotionMediaUrl(
      "https://file.notion.so/f/f/workspace/file.png?expirationTimestamp=1786067823044&signature=signed",
    ),
  );
});

test("rejects lookalike hosts and unsigned or insecure URLs", () => {
  const rejected = [
    `http://s3.us-west-2.amazonaws.com/secure.notion-static.com/file.png?${awsSignature}`,
    `https://s3.us-west-2.amazonaws.com.evil.example/secure.notion-static.com/file.png?${awsSignature}`,
    `https://s3.us-west-2.amazonaws.com/untrusted/secure.notion-static.com/file.png?${awsSignature}`,
    "https://prod-files-secure.attacker.example/file.png?X-Amz-Signature=signed",
    "https://file.notion.so/f/f/workspace/file.png?signature=missing-expiry",
  ];

  for (const value of rejected) {
    assert.equal(parseTemporaryNotionMediaUrl(value), null);
  }
});

test("derives extensions only from safe media MIME types", () => {
  assert.equal(mediaExtensionForContentType("image/png"), ".png");
  assert.equal(mediaExtensionForContentType("image/jpeg; charset=binary"), ".jpg");
  assert.equal(mediaExtensionForContentType("application/pdf"), ".pdf");
  assert.equal(mediaExtensionForContentType("image/svg+xml"), undefined);
  assert.equal(mediaExtensionForContentType("text/html"), undefined);
  assert.equal(mediaExtensionForContentType(null), undefined);
});
