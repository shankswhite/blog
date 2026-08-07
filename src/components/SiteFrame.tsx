"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { Footer } from "@/components/Footer";
import { FloatingChat } from "@/components/FloatingChat";
import { CompanionProvider } from "@/components/companion/CompanionContext";
import { MotionProvider } from "@/components/MotionProvider";

export function SiteFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLegacy = pathname === "/legacy" || pathname.startsWith("/legacy/");

  if (isLegacy) {
    return (
      <MotionProvider>
        {children}
      </MotionProvider>
    );
  }

  return (
    <MotionProvider>
      <CompanionProvider>
        <a
          href="#main-content"
          className="fixed left-4 top-4 z-[200] -translate-y-24 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition focus:translate-y-0"
        >
          Skip to content
        </a>
        <div className="flex min-h-dvh bg-[#f0eee8] text-slate-900">
          <Sidebar />
          <div className="min-w-0 flex-1 lg:p-2 lg:pl-0">
            <div className="flex min-h-dvh flex-col overflow-hidden border-slate-200 bg-[#fffefa] lg:min-h-[calc(100dvh-1rem)] lg:rounded-2xl lg:border">
              <div className="flex-1">{children}</div>
              <Footer />
            </div>
          </div>
        </div>
        <FloatingChat />
      </CompanionProvider>
    </MotionProvider>
  );
}
