"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useVoiceSession } from "@/components/companion-voice/VoiceSessionProvider";

const CompanionShell = dynamic(
  () =>
    import("./companion/CompanionShell").then(
      (module) => module.CompanionShell
    ),
  { ssr: false }
);

/**
 * Lightweight production launcher for KIRA. The licensed 3D avatar and its
 * WebGL runtime intentionally stay out of this release; the same persistent
 * text and voice session remains available on every standard page.
 */
export function FloatingChat() {
  const pathname = usePathname() ?? "/";
  const { disableMicrophone } = useVoiceSession();
  const launcherRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const hasFullPageCompanion =
    pathname === "/chat" ||
    pathname === "/ai-companion" ||
    pathname.startsWith("/ai-companion/");

  const closeConversation = useCallback(() => {
    setIsOpen(false);
    void disableMicrophone();
  }, [disableMicrophone]);

  useEffect(() => {
    closeConversation();
  }, [closeConversation, pathname]);

  useEffect(() => {
    if (!isOpen) return;

    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      closeConversation();
      window.setTimeout(() => launcherRef.current?.focus(), 0);
    };

    window.addEventListener("keydown", closeWithEscape);
    return () => window.removeEventListener("keydown", closeWithEscape);
  }, [closeConversation, isOpen]);

  if (hasFullPageCompanion) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[120] select-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="kira-speech-panel"
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="pointer-events-auto fixed bottom-[104px] right-2 z-[122] h-[min(410px,calc(100dvh-120px))] w-[min(330px,calc(100vw-16px))] sm:bottom-5 sm:right-[104px] sm:h-[min(410px,calc(100dvh-40px))] sm:w-[min(330px,calc(100vw-124px))]"
          >
            <CompanionShell
              onClose={() => {
                closeConversation();
                launcherRef.current?.focus();
              }}
              announceMessages={!pathname.startsWith("/ai-companion")}
              variant="floating"
            />

            <span
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-[8px] right-8 h-4 w-4 rotate-45 border-b border-r border-slate-200 bg-[#fbfaf6] shadow-[5px_5px_12px_-8px_rgba(15,23,42,0.35)] sm:-right-[8px] sm:bottom-8 sm:border-b-0 sm:border-r sm:border-t sm:shadow-[5px_-5px_12px_-8px_rgba(15,23,42,0.35)]"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        id="floating-chat-launcher"
        ref={launcherRef}
        type="button"
        onClick={() => {
          if (isOpen) closeConversation();
          else setIsOpen(true);
        }}
        whileHover={{ y: -3, scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 360, damping: 24 }}
        aria-label={isOpen ? "Close KIRA conversation" : "Talk with KIRA"}
        aria-expanded={isOpen}
        aria-controls="levon-companion"
        className="pointer-events-auto fixed bottom-3 right-3 z-[123] h-[78px] w-[70px] overflow-hidden rounded-[22px] border border-slate-200 bg-[#f5f1e8] shadow-[0_16px_38px_-18px_rgba(15,23,42,0.55)] outline-none ring-4 ring-[#fffefa]/80 transition focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 sm:bottom-5 sm:right-5 sm:h-[84px] sm:w-[76px]"
      >
        <Image
          src="/images/ai-companion/kira-comms.webp"
          alt=""
          fill
          sizes="76px"
          className="origin-[50%_22%] scale-[1.55] object-cover object-[50%_18%]"
          priority
        />
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-5 bg-gradient-to-t from-slate-950/35 to-transparent"
        />
        <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 rounded-full bg-slate-950/78 px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-sm">
          KIRA
        </span>
      </motion.button>
    </div>
  );
}
