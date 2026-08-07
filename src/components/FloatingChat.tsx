"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { IconSparkles } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CompanionShell } from "./companion/CompanionShell";

export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname() ?? "";
  const launcherRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
        launcherRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  if (pathname === "/chat") return null;

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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
              className="fixed inset-0 z-[110] cursor-default bg-slate-950/30 backdrop-blur-[2px] lg:bg-slate-950/10"
            />
            <motion.div
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

      <motion.button
        ref={launcherRef}
        type="button"
        onClick={() => setIsOpen(true)}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        aria-label="Open Levon AI companion"
        aria-expanded={isOpen}
        aria-controls="levon-companion"
        className="fixed bottom-4 right-4 z-[100] flex items-center gap-2.5 rounded-full border border-slate-700 bg-slate-950 py-2 pl-2 pr-4 text-white shadow-[0_16px_42px_-16px_rgba(15,23,42,0.8)] transition hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 sm:bottom-6 sm:right-6"
      >
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
        <span className="text-left">
          <span className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-[0.14em] text-sky-300">
            <IconSparkles size={11} />
            Portfolio companion
          </span>
          <span className="block text-xs font-semibold">Ask Levon AI</span>
        </span>
      </motion.button>
    </>
  );
}
