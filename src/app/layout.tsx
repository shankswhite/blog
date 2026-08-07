import { Sidebar } from "@/components/Sidebar";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { twMerge } from "tailwind-merge";
import { Footer } from "@/components/Footer";
import { FloatingChat } from "@/components/FloatingChat";
import { CompanionProvider } from "@/components/companion/CompanionContext";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://levon.blog";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Levon Zhao — Games, AI & Software",
    template: "%s | Levon Zhao",
  },
  description:
    "Levon Zhao is a game designer turned software engineer exploring AI, games, computer graphics, and thoughtful product systems.",
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
        url: "/og.png",
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
    images: ["/og.png"],
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
        <CompanionProvider>
          <div className="flex min-h-dvh bg-[#f0eee8] text-slate-900">
            <Sidebar />
            <div className="min-w-0 flex-1 lg:p-2 lg:pl-0">
              <div className="min-h-dvh overflow-hidden border-slate-200 bg-[#fffefa] lg:rounded-2xl lg:border">
                {children}
                <Footer />
              </div>
            </div>
          </div>
          <FloatingChat />
        </CompanionProvider>
      </body>
    </html>
  );
}
