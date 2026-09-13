import type { Metadata } from "next";
import { authorName, siteName } from "./siteIdentity";
import { toMetadataDateTime } from "./metadataDate";

type PageMetadataInput = {
  title: string;
  absoluteTitle?: boolean;
  description: string;
  path: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  image?:
    | string
    | {
        url: string;
        width?: number;
        height?: number;
        alt?: string;
      };
};

const socialImage = {
  url: "/og.jpg",
  width: 1730,
  height: 909,
  alt: "Levon Zhao — Games, AI and Software",
};

export function createPageMetadata({
  title,
  absoluteTitle = false,
  description,
  path,
  type = "website",
  publishedTime,
  modifiedTime,
  tags,
  image,
}: PageMetadataInput): Metadata {
  const imageMetadata = image
    ? [typeof image === "string" ? { url: image, alt: title } : image]
    : [socialImage];

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName,
      type,
      images: imageMetadata,
      ...(type === "article"
        ? {
            publishedTime: toMetadataDateTime(publishedTime),
            modifiedTime: toMetadataDateTime(modifiedTime),
            tags,
            authors: [authorName],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageMetadata,
    },
  };
}
