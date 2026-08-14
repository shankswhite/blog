import type { Metadata } from "next";

type PageMetadataInput = {
  title: string;
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
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: "Levon Zhao",
      type,
      images: imageMetadata,
      ...(type === "article"
        ? {
            publishedTime,
            modifiedTime,
            tags,
            authors: ["Levon Zhao"],
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
