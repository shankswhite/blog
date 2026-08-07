"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const CompanionShell = dynamic(
  () =>
    import("./companion/CompanionShell").then(
      (module) => module.CompanionShell
    ),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex h-full min-h-64 items-center justify-center rounded-[28px] border border-slate-200 bg-[#fbfaf6] text-sm text-slate-500 shadow-[0_24px_80px_-30px_rgba(15,23,42,0.45)]"
        role="status"
      >
        Loading companion…
      </div>
    ),
  }
);

const modalBackgroundIds = [
  "site-navigation-region",
  "site-page-content",
  "floating-chat-launcher",
];

function isolateModalBackground() {
  const snapshots = modalBackgroundIds.flatMap((id) => {
    const element = document.getElementById(id);
    if (!element) return [];

    const snapshot = {
      element,
      ariaHidden: element.getAttribute("aria-hidden"),
      hadInert: element.hasAttribute("inert"),
    };

    element.setAttribute("aria-hidden", "true");
    element.setAttribute("inert", "");
    return [snapshot];
  });

  return () => {
    snapshots.forEach(({ element, ariaHidden, hadInert }) => {
      if (ariaHidden === null) element.removeAttribute("aria-hidden");
      else element.setAttribute("aria-hidden", ariaHidden);

      if (!hadInert) element.removeAttribute("inert");
    });
  };
}

export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname() ?? "";
  const launcherRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    const restoreBackground = isolateModalBackground();

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        launcherRef.current?.focus();
        return;
      }

      if (event.key !== "Tab") return;
      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      restoreBackground();
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    // The router is external state; route changes must dismiss an open modal.
    setIsOpen(false);
  }, [pathname]);

  if (
    pathname === "/chat" ||
    pathname === "/legacy/ai-chatbot" ||
    pathname === "/legacy/pathfinding"
  ) {
    return null;
  }

  const close = () => {
    setIsOpen(false);
    window.setTimeout(() => launcherRef.current?.focus(), 0);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close companion backdrop"
              tabIndex={-1}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
              className="fixed inset-0 z-[110] cursor-default bg-slate-950/30 backdrop-blur-[2px] lg:bg-slate-950/10"
            />
            <motion.div
              ref={panelRef}
              tabIndex={-1}
              initial={{ opacity: 0, y: 18, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.97 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="fixed inset-x-3 bottom-3 top-3 z-[120] sm:inset-x-auto sm:bottom-24 sm:right-5 sm:top-auto sm:w-[420px] lg:right-7"
            >
              <CompanionShell onClose={close} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div id="floating-chat-launcher">
        <motion.button
          ref={launcherRef}
          type="button"
          onClick={() => setIsOpen(true)}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          aria-label="Open Levon AI companion"
          aria-expanded={isOpen}
          aria-controls="levon-companion"
          title="Ask Levon AI"
          className="group fixed bottom-4 right-4 z-[100] flex h-14 w-14 items-center justify-center rounded-full border border-slate-700 bg-slate-950 p-2 text-white shadow-[0_16px_42px_-16px_rgba(15,23,42,0.8)] transition hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 sm:bottom-6 sm:right-6"
        >
          <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-full border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 sm:block">
            Ask Levon AI
          </span>
          <span className="relative h-9 w-9 overflow-hidden rounded-full border border-white/20 bg-white">
            <Image
              src="/images/companion-cat.webp"
              alt=""
              fill
              sizes="36px"
              className="object-cover"
            />
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-slate-950 bg-emerald-400" />
          </span>
        </motion.button>
      </div>
    </>
  );
}
