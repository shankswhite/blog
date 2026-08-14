import assert from "node:assert/strict";
import test from "node:test";
import { createPageMetadata } from "./siteMetadata";

test("preserves dimensions and alt text for a structured social image", () => {
  const metadata = createPageMetadata({
    title: "AI Companion",
    description: "Interactive portfolio companion",
    path: "/ai-companion",
    image: {
      url: "/images/ai-companion/ai-companion-og.jpg",
      width: 1672,
      height: 941,
      alt: "KIRA Signal Deck",
    },
  });

  assert.deepEqual(metadata.openGraph?.images, [
    {
      url: "/images/ai-companion/ai-companion-og.jpg",
      width: 1672,
      height: 941,
      alt: "KIRA Signal Deck",
    },
  ]);
  assert.deepEqual(metadata.twitter?.images, [
    {
      url: "/images/ai-companion/ai-companion-og.jpg",
      width: 1672,
      height: 941,
      alt: "KIRA Signal Deck",
    },
  ]);
});

test("keeps the legacy string image API backward compatible", () => {
  const metadata = createPageMetadata({
    title: "Example page",
    description: "Example description",
    path: "/example",
    image: "/example.jpg",
  });

  assert.deepEqual(metadata.openGraph?.images, [
    { url: "/example.jpg", alt: "Example page" },
  ]);
  assert.deepEqual(metadata.twitter?.images, [
    { url: "/example.jpg", alt: "Example page" },
  ]);
});
