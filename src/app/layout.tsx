import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { twMerge } from "tailwind-merge";
import { isProductionSite, siteUrl } from "@/lib/siteUrl";
import { SiteFrame } from "@/components/SiteFrame";
import { VoiceSessionProvider } from "@/components/companion-voice";
import { FloatingChat } from "@/components/FloatingChat";
import { FloatingAvatarChat } from "@/components/FloatingAvatarChat";
import { StructuredData } from "@/components/StructuredData";
import { siteDescription, siteName } from "@/lib/siteIdentity";
import { createSiteStructuredData } from "@/lib/structuredData";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Levon's Blog | AllBlue",
    template: "%s | Levon Blog",
  },
  description: siteDescription,
  // Public ownership proof for the site's Google Search Console property.
  verification: isProductionSite
    ? { google: "xA4ObnaAuuthUZfhX-UYsEu7RvPsWi3SwonNoH6TUn0" }
    : undefined,
  robots: isProductionSite
    ? { index: true, follow: true }
    : { index: false, follow: false, noarchive: true },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Levon's Blog | AllBlue",
    description: siteDescription,
    type: "website",
    url: "/",
    siteName,
    images: [
      {
        url: "/og.jpg",
        width: 1730,
        height: 909,
        alt: "Levon Zhao — Games, AI and Software",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Levon's Blog | AllBlue",
    description: siteDescription,
    images: ["/og.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const avatarModelUrl =
    process.env.NEXT_PUBLIC_COMPANION_AVATAR_URL?.trim() ?? "";
  const avatar3DEnabled =
    process.env.NEXT_PUBLIC_COMPANION_3D_ENABLED === "true" &&
    avatarModelUrl.startsWith("https://");

  return (
    <html lang="en" className="bg-[#f0eee8]" data-scroll-behavior="smooth">
      <body className={twMerge(inter.className, "min-h-dvh antialiased")}>
        <StructuredData data={createSiteStructuredData(siteUrl)} />
        <VoiceSessionProvider avatarAudioEnabled={avatar3DEnabled}>
          <SiteFrame>{children}</SiteFrame>
          {avatar3DEnabled ? (
            <FloatingAvatarChat modelUrl={avatarModelUrl} />
          ) : (
            <FloatingChat />
          )}
        </VoiceSessionProvider>
      </body>
    </html>
  );
}
