import assert from "node:assert/strict";
import test from "node:test";
import { createArticleStructuredData, createSiteStructuredData, serializeStructuredData } from "./structuredData";

test("CMS strings cannot close the JSON-LD script and round-trip unchanged", () => {
  const value = { headline: '</script><script>alert("test")</script>', description: "AI < graphics & games" };
  const serialized = serializeStructuredData(value);
  assert.equal(serialized.includes("<"), false);
  assert.deepEqual(JSON.parse(serialized), value);
});

test("article and site identity resolve to the same author and canonical origin", () => {
  const origin = "https://www.levon.blog";
  const site = createSiteStructuredData(origin);
  const graph = createArticleStructuredData(origin, {
    path: "/blog/example",
    title: "An experiment",
    date: "2025-02-01",
    image: "/media/experiment.png",
  });
  const article = graph["@graph"][0];
  assert.equal(article["@type"], "BlogPosting");
  assert.equal(article.author?.["@id"], site["@graph"][1]["@id"]);
  assert.equal(article.mainEntityOfPage?.["@id"], "https://www.levon.blog/blog/example");
  assert.equal(article.image, "https://www.levon.blog/media/experiment.png");
  assert.equal("dateModified" in article, false, "do not fabricate a modification date");
  assert.equal(graph["@graph"][1].itemListElement?.[2].item, article.url);
});

test("Notion modification dates and external covers are preserved", () => {
  const article = createArticleStructuredData("https://preview.example", {
    path: "/blog/notion-note",
    title: "A published note",
    date: "2025-01-01",
    modifiedDate: "2025-02-01T12:00:00Z",
    image: "https://images.example/cover.jpg",
  })["@graph"][0];
  assert.equal(article.dateModified, "2025-02-01T12:00:00Z");
  assert.equal(article.image, "https://images.example/cover.jpg");
  assert.equal(article.author?.url, "https://preview.example/about");
});
