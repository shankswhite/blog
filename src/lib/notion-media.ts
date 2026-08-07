const LEGACY_NOTION_S3_HOST = "s3.us-west-2.amazonaws.com";
const CURRENT_NOTION_S3_HOST =
  "prod-files-secure.s3.us-west-2.amazonaws.com";
const NOTION_FILE_PROXY_HOST = "file.notion.so";

const SAFE_MEDIA_EXTENSIONS = new Map<string, string>([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/gif", ".gif"],
  ["image/webp", ".webp"],
  ["image/avif", ".avif"],
  ["audio/mpeg", ".mp3"],
  ["audio/mp4", ".m4a"],
  ["audio/ogg", ".ogg"],
  ["audio/wav", ".wav"],
  ["video/mp4", ".mp4"],
  ["video/webm", ".webm"],
  ["video/quicktime", ".mov"],
  ["application/pdf", ".pdf"],
  ["text/plain", ".txt"],
]);

function hasAllQueryKeys(url: URL, expectedKeys: readonly string[]): boolean {
  const queryKeys = new Set(
    Array.from(url.searchParams.keys(), (key) => key.toLowerCase()),
  );
  return expectedKeys.every((key) => queryKeys.has(key));
}

/**
 * Accept only the exact HTTPS hosts and signed URL shapes used by Notion's
 * temporary file objects. Keeping this allowlist deliberately narrow prevents
 * the build process from becoming a general-purpose URL fetcher.
 */
export function parseTemporaryNotionMediaUrl(value: string): URL | null {
  let url: URL;
  try {
    url = new URL(value.replaceAll("&amp;", "&"));
  } catch {
    return null;
  }

  if (
    url.protocol !== "https:" ||
    url.username.length > 0 ||
    url.password.length > 0 ||
    url.hash.length > 0
  ) {
    return null;
  }

  const hostname = url.hostname.toLowerCase();
  const hasAwsSignature = hasAllQueryKeys(url, [
    "x-amz-algorithm",
    "x-amz-credential",
    "x-amz-date",
    "x-amz-expires",
    "x-amz-signature",
  ]);

  if (
    hostname === LEGACY_NOTION_S3_HOST &&
    url.pathname.startsWith("/secure.notion-static.com/") &&
    hasAwsSignature
  ) {
    return url;
  }

  if (
    hostname === CURRENT_NOTION_S3_HOST &&
    url.pathname.startsWith("/") &&
    url.pathname.length > 1 &&
    hasAwsSignature
  ) {
    return url;
  }

  if (
    hostname === NOTION_FILE_PROXY_HOST &&
    url.pathname.startsWith("/f/") &&
    hasAllQueryKeys(url, ["signature", "expirationtimestamp"])
  ) {
    return url;
  }

  return null;
}

/**
 * The saved extension is derived only from an allowlisted response MIME type.
 * In particular, executable HTML and SVG are rejected instead of being served
 * from the site's origin.
 */
export function mediaExtensionForContentType(
  value: string | null,
): string | undefined {
  const contentType = value?.split(";", 1)[0]?.trim().toLowerCase();
  return contentType ? SAFE_MEDIA_EXTENSIONS.get(contentType) : undefined;
}
