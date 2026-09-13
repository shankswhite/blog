import { authorName, authorProfiles, siteDescription, siteName } from "./siteIdentity";

export function serializeStructuredData(value: unknown): string {
  // CMS titles and descriptions must never terminate the JSON-LD script tag.
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function createSiteStructuredData(origin: string) {
  const home = new URL("/", origin).href;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${home}#website`,
        url: home,
        name: siteName,
        alternateName: ["levon.blog", "Levon Zhao"],
        description: siteDescription,
        inLanguage: "en",
        publisher: { "@id": `${home}#person` },
      },
      {
        "@type": "Person",
        "@id": `${home}#person`,
        name: authorName,
        url: new URL("/about", origin).href,
        sameAs: authorProfiles,
      },
    ] as const,
  };
}

type ArticleInput = {
  path: string;
  title: string;
  description?: string;
  date: string;
  modifiedDate?: string;
  image?: string;
  tags?: string[];
};

export function createArticleStructuredData(origin: string, article: ArticleInput) {
  const home = new URL("/", origin).href;
  const url = new URL(article.path, origin).href;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        url,
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        headline: article.title,
        description: article.description,
        datePublished: article.date,
        ...(article.modifiedDate ? { dateModified: article.modifiedDate } : {}),
        author: {
          "@type": "Person",
          "@id": `${home}#person`,
          name: authorName,
          url: new URL("/about", origin).href,
        },
        isPartOf: { "@id": `${home}#website` },
        ...(article.image ? { image: new URL(article.image, origin).href } : {}),
        ...(article.tags?.length ? { keywords: article.tags.join(", ") } : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: siteName, item: home },
          { "@type": "ListItem", position: 2, name: "Blog", item: new URL("/blog", origin).href },
          { "@type": "ListItem", position: 3, name: article.title, item: url },
        ],
      },
    ] as const,
  };
}
