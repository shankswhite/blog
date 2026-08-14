"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { Footer } from "@/components/Footer";
import { MotionProvider } from "@/components/MotionProvider";

export function SiteFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLegacy = pathname === "/legacy" || pathname.startsWith("/legacy/");
  const isAiCompanion =
    pathname === "/ai-companion" || pathname.startsWith("/ai-companion/");

  if (isLegacy) {
    return <MotionProvider>{children}</MotionProvider>;
  }

  if (isAiCompanion) {
    return (
      <MotionProvider>
        <a
          href="#companion-workspace"
          className="fixed left-4 top-4 z-[200] -translate-y-24 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-lg focus:translate-y-0"
        >
          Skip to companion workspace
        </a>
        <div id="site-page-content" className="min-h-dvh">
          {children}
        </div>
      </MotionProvider>
    );
  }

  return (
    <MotionProvider>
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[200] -translate-y-24 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition focus:translate-y-0"
      >
        Skip to content
      </a>
      <div className="flex min-h-dvh bg-[#f0eee8] text-slate-900">
        <div id="site-navigation-region" className="contents">
          <Sidebar />
        </div>
        <div id="site-page-content" className="min-w-0 flex-1 lg:p-2 lg:pl-0">
          <div className="flex min-h-dvh flex-col overflow-hidden border-slate-200 bg-[#fffefa] lg:min-h-[calc(100dvh-1rem)] lg:rounded-2xl lg:border">
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
        </div>
      </div>
    </MotionProvider>
  );
}
