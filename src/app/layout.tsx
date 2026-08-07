import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { twMerge } from "tailwind-merge";
import { isProductionSite, siteUrl } from "@/lib/siteUrl";
import { SiteFrame } from "@/components/SiteFrame";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Levon Zhao — Games, AI & Software",
    template: "%s | Levon Zhao",
  },
  description:
    "Levon Zhao is a game designer turned software engineer exploring AI, games, computer graphics, and thoughtful product systems.",
  robots: isProductionSite
    ? { index: true, follow: true }
    : { index: false, follow: false, noarchive: true },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Levon Zhao — Games, AI & Software",
    description:
      "Research, interactive experiments, and software projects at the intersection of AI and games.",
    type: "website",
    url: "/",
    siteName: "Levon Zhao",
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
    title: "Levon Zhao — Games, AI & Software",
    description:
      "Research, interactive experiments, and software projects at the intersection of AI and games.",
    images: ["/og.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-[#f0eee8]">
      <body className={twMerge(inter.className, "min-h-dvh antialiased")}>
        <SiteFrame>{children}</SiteFrame>
      </body>
    </html>
  );
}
