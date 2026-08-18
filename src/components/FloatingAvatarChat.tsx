"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type {
  AvatarInteractionMode,
  AvatarLoadState,
} from "@/components/companion-3d/AvatarStage";
import { useVoiceSession } from "@/components/companion-voice/VoiceSessionProvider";

const CompanionShell = dynamic(
  () =>
    import("./companion/CompanionShell").then(
      (module) => module.CompanionShell
    ),
  { ssr: false }
);

const AvatarStage = dynamic(
  () =>
    import("./companion-3d/AvatarStage").then(
      (module) => module.AvatarStage
    ),
  { ssr: false }
);

type DragBounds = {
  left: number;
  right: number;
  top: number;
  bottom: number;
};

type FloatingAvatarChatProps = {
  modelUrl: string;
};

const DOCK_THRESHOLD = 16;
const DRAG_RETURN_DELAY_MS = 1_000;
const CRAWL_PREPARE_DELAY_SECONDS = 0.4;
const CRAWL_RECOVERY_DELAY_MS = 560;
const CRAWL_STAGE_WIDTH_SCALE = 1.5;

/**
 * The model is KIRA's single draggable launcher. Until WebGL and the model are
 * ready, the same button shows the lightweight 2D portrait, so conversation
 * access never depends on the 3D runtime succeeding.
 */
export function FloatingAvatarChat({ modelUrl }: FloatingAvatarChatProps) {
  const pathname = usePathname() ?? "/";
  const reduceMotion = useReducedMotion();
  const { disableMicrophone } = useVoiceSession();
  const hasFullPageCompanion =
    pathname === "/chat" ||
    pathname === "/ai-companion" ||
    pathname.startsWith("/ai-companion/");
  const [isOpen, setIsOpen] = useState(false);
  const [avatarLoadState, setAvatarLoadState] =
    useState<AvatarLoadState>("loading");
  const [interactionMode, setInteractionMode] =
    useState<AvatarInteractionMode>("idle");
  const [dragBounds, setDragBounds] = useState<DragBounds>({
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  });
  const avatarRef = useRef<HTMLButtonElement>(null);
  const pointerSequenceRef = useRef(0);
  const draggedPointerSequenceRef = useRef(-1);
  const dragClickResetTimerRef = useRef<number | null>(null);
  const interactionRunRef = useRef(0);
  const interactionModeRef = useRef<AvatarInteractionMode>("idle");
  const avatarGeometryRef = useRef({ dockLeft: 0, width: 0 });
  const returnTimerRef = useRef<number | null>(null);
  const avatarX = useMotionValue(0);
  const avatarY = useMotionValue(0);
  const stageX = useMotionValue(0);
  const avatarReady = avatarLoadState === "ready";
  const avatarFailed =
    avatarLoadState === "error" ||
    avatarLoadState === "webgl-unavailable";

  const clearReturnTimer = useCallback(() => {
    if (returnTimerRef.current === null) return;
    window.clearTimeout(returnTimerRef.current);
    returnTimerRef.current = null;
  }, []);

  const clearDragClickResetTimer = useCallback(() => {
    if (dragClickResetTimerRef.current === null) return;
    window.clearTimeout(dragClickResetTimerRef.current);
    dragClickResetTimerRef.current = null;
  }, []);

  const updateInteractionMode = useCallback((mode: AvatarInteractionMode) => {
    interactionModeRef.current = mode;
    setInteractionMode(mode);
  }, []);

  const closeConversation = useCallback(() => {
    setIsOpen(false);
    void disableMicrophone();
  }, [disableMicrophone]);

  const measureBounds = useCallback(() => {
    const avatar = avatarRef.current;
    if (!avatar) return;

    const rect = avatar.getBoundingClientRect();
    const currentX = avatarX.get();
    const currentY = avatarY.get();
    const dockLeft = rect.left - currentX;
    const dockTop = rect.top - currentY;
    avatarGeometryRef.current = { dockLeft, width: rect.width };
    const nextBounds = {
      left: -Math.max(0, dockLeft),
      right: 0,
      top: -Math.max(0, dockTop),
      bottom: 0,
    };
    setDragBounds(nextBounds);
    avatarX.set(Math.min(0, Math.max(nextBounds.left, currentX)));
    avatarY.set(Math.min(0, Math.max(nextBounds.top, currentY)));
  }, [avatarX, avatarY]);

  const syncExpandedStage = useCallback(() => {
    const { dockLeft, width } = avatarGeometryRef.current;
    if (width <= 0) return;

    const buttonLeft = dockLeft + avatarX.get();
    const expandedWidth = width * CRAWL_STAGE_WIDTH_SCALE;
    const centeredOffset = -(width * (CRAWL_STAGE_WIDTH_SCALE - 1)) / 2;
    const visualViewport = window.visualViewport;
    const viewportLeft = visualViewport?.offsetLeft ?? 0;
    const viewportRight =
      viewportLeft + (visualViewport?.width ?? window.innerWidth);
    const minimumOffset = viewportLeft - buttonLeft;
    const maximumOffset = viewportRight - buttonLeft - expandedWidth;

    stageX.set(
      Math.min(maximumOffset, Math.max(minimumOffset, centeredOffset))
    );
  }, [avatarX, stageX]);

  useEffect(() => {
    const unsubscribe = avatarX.on("change", () => {
      if (
        interactionModeRef.current === "returning" ||
        interactionModeRef.current === "recovering"
      ) {
        syncExpandedStage();
      }
    });
    return unsubscribe;
  }, [avatarX, syncExpandedStage]);

  useEffect(() => {
    if (
      interactionMode === "returning" ||
      interactionMode === "recovering"
    ) {
      syncExpandedStage();
    } else {
      stageX.set(0);
    }
  }, [interactionMode, stageX, syncExpandedStage]);

  useEffect(() => {
    if (hasFullPageCompanion) return;
    measureBounds();
    const frame = window.requestAnimationFrame(measureBounds);
    const visualViewport = window.visualViewport;
    const handleViewportChange = () => {
      measureBounds();
      if (
        interactionModeRef.current === "returning" ||
        interactionModeRef.current === "recovering"
      ) {
        syncExpandedStage();
      }
    };
    const avatar = avatarRef.current;
    const avatarObserver = avatar ? new ResizeObserver(measureBounds) : null;
    if (avatar) avatarObserver?.observe(avatar);
    window.addEventListener("resize", handleViewportChange);
    visualViewport?.addEventListener("resize", handleViewportChange);
    visualViewport?.addEventListener("scroll", handleViewportChange);
    return () => {
      window.cancelAnimationFrame(frame);
      avatarObserver?.disconnect();
      window.removeEventListener("resize", handleViewportChange);
      visualViewport?.removeEventListener("resize", handleViewportChange);
      visualViewport?.removeEventListener("scroll", handleViewportChange);
    };
  }, [hasFullPageCompanion, measureBounds, syncExpandedStage]);

  useEffect(() => {
    closeConversation();
    if (!hasFullPageCompanion) return;
    clearReturnTimer();
    interactionRunRef.current += 1;
    avatarX.stop();
    avatarY.stop();
    stageX.stop();
    avatarX.set(0);
    avatarY.set(0);
    stageX.set(0);
    setAvatarLoadState("loading");
    updateInteractionMode("idle");
  }, [
    avatarX,
    avatarY,
    clearReturnTimer,
    closeConversation,
    hasFullPageCompanion,
    pathname,
    stageX,
    updateInteractionMode,
  ]);

  useEffect(
    () => () => {
      clearReturnTimer();
      clearDragClickResetTimer();
      interactionRunRef.current += 1;
      avatarX.stop();
      avatarY.stop();
      stageX.stop();
    },
    [
      avatarX,
      avatarY,
      clearDragClickResetTimer,
      clearReturnTimer,
      stageX,
    ]
  );

  useEffect(() => {
    if (!isOpen) return;
    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      closeConversation();
      avatarRef.current?.focus();
    };
    window.addEventListener("keydown", closeWithEscape);
    return () => window.removeEventListener("keydown", closeWithEscape);
  }, [closeConversation, isOpen]);

  const isDocked = () =>
    Math.abs(avatarX.get()) <= DOCK_THRESHOLD &&
    Math.abs(avatarY.get()) <= DOCK_THRESHOLD;

  const returnToDock = async () => {
    if (
      interactionModeRef.current === "returning" ||
      interactionModeRef.current === "recovering"
    ) {
      return;
    }
    clearReturnTimer();
    const run = ++interactionRunRef.current;
    closeConversation();

    if (reduceMotion) {
      avatarX.set(0);
      avatarY.set(0);
      stageX.set(0);
      updateInteractionMode("idle");
      return;
    }

    updateInteractionMode("returning");
    const distance = Math.hypot(avatarX.get(), avatarY.get());
    const duration = Math.min(2.5, Math.max(1.24, distance / 310));

    await Promise.all([
      animate(avatarX, 0, {
        delay: CRAWL_PREPARE_DELAY_SECONDS,
        duration,
        ease: [0.4, 0, 0.18, 1],
      }),
      animate(avatarY, 0, {
        delay: CRAWL_PREPARE_DELAY_SECONDS,
        duration,
        ease: [0.4, 0, 0.18, 1],
      }),
    ]);

    if (run !== interactionRunRef.current) return;
    updateInteractionMode("recovering");

    const { width } = avatarGeometryRef.current;
    const centeredOffset = -(width * (CRAWL_STAGE_WIDTH_SCALE - 1)) / 2;
    await Promise.all([
      animate(stageX, centeredOffset, {
        duration: CRAWL_RECOVERY_DELAY_MS / 1_000,
        ease: [0.22, 1, 0.36, 1],
      }),
      new Promise<void>((resolve) => {
        window.setTimeout(resolve, CRAWL_RECOVERY_DELAY_MS);
      }),
    ]);

    if (run !== interactionRunRef.current) return;
    stageX.set(0);
    updateInteractionMode("idle");
  };

  const activateAvatar = () => {
    if (!avatarReady) {
      if (isOpen) closeConversation();
      else setIsOpen(true);
      return;
    }
    if (
      interactionModeRef.current === "returning" ||
      interactionModeRef.current === "recovering"
    ) {
      return;
    }
    if (draggedPointerSequenceRef.current === pointerSequenceRef.current) {
      draggedPointerSequenceRef.current = -1;
      return;
    }
    if (!isDocked()) {
      void returnToDock();
      return;
    }
    if (interactionModeRef.current !== "idle") return;
    clearReturnTimer();
    interactionRunRef.current += 1;
    updateInteractionMode("idle");
    if (isOpen) closeConversation();
    else setIsOpen(true);
  };

  const startDrag = () => {
    if (!avatarReady) return;
    clearDragClickResetTimer();
    clearReturnTimer();
    interactionRunRef.current += 1;
    avatarX.stop();
    avatarY.stop();
    stageX.stop();
    draggedPointerSequenceRef.current = pointerSequenceRef.current;
    closeConversation();
    updateInteractionMode("dragging");
  };

  const finishDrag = () => {
    if (!avatarReady) return;
    clearDragClickResetTimer();
    const pointerSequence = pointerSequenceRef.current;
    dragClickResetTimerRef.current = window.setTimeout(() => {
      dragClickResetTimerRef.current = null;
      if (draggedPointerSequenceRef.current === pointerSequence) {
        draggedPointerSequenceRef.current = -1;
      }
    }, 350);
    if (isDocked()) {
      avatarX.set(0);
      avatarY.set(0);
      updateInteractionMode("idle");
      return;
    }
    const waitRun = ++interactionRunRef.current;
    updateInteractionMode("waiting");
    clearReturnTimer();
    returnTimerRef.current = window.setTimeout(() => {
      returnTimerRef.current = null;
      if (waitRun !== interactionRunRef.current) return;
      void returnToDock();
    }, DRAG_RETURN_DELAY_MS);
  };

  const handleAvatarLoadState = useCallback(
    (state: AvatarLoadState) => {
      setAvatarLoadState(state);
      if (state !== "error" && state !== "webgl-unavailable") return;
      clearReturnTimer();
      interactionRunRef.current += 1;
      avatarX.stop();
      avatarY.stop();
      stageX.stop();
      avatarX.set(0);
      avatarY.set(0);
      stageX.set(0);
      updateInteractionMode("idle");
    },
    [
      avatarX,
      avatarY,
      clearReturnTimer,
      stageX,
      updateInteractionMode,
    ]
  );

  const visibleModelAnimation =
    interactionMode === "dragging"
      ? {
          rotate: reduceMotion ? -4 : [-7, 7, -7],
          scale: reduceMotion ? 1.07 : [1.06, 1.11, 1.06],
          y: reduceMotion ? -8 : [-7, -16, -7],
        }
      : { rotate: 0, scale: 1, y: 0 };

  const visibleModelTransition =
    reduceMotion || interactionMode !== "dragging"
      ? { duration: 0.2 }
      : {
          duration: 0.34,
          ease: "easeInOut" as const,
          repeat: Infinity,
        };

  if (hasFullPageCompanion) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[120] select-none"
      data-avatar-load-state={avatarLoadState}
      data-persistent-avatar-host="true"
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="kira-speech-panel"
            initial={{ opacity: 0, x: 12, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className={
              avatarReady
                ? "pointer-events-auto fixed bottom-[calc(clamp(150px,25dvh,230px)+8px)] right-2 z-[122] h-[min(410px,calc(100dvh-clamp(150px,25dvh,230px)-16px))] w-[min(330px,calc(100vw-16px))] sm:bottom-6 sm:right-[calc(clamp(84px,20vw,135px)+22px)] sm:h-[min(410px,calc(100dvh-48px))] sm:w-[min(330px,calc(100vw-clamp(84px,20vw,135px)-28px))]"
                : "pointer-events-auto fixed bottom-[104px] right-2 z-[122] h-[min(410px,calc(100dvh-120px))] w-[min(330px,calc(100vw-16px))] sm:bottom-5 sm:right-[104px] sm:h-[min(410px,calc(100dvh-40px))] sm:w-[min(330px,calc(100vw-124px))]"
            }
          >
            <CompanionShell
              onClose={() => {
                closeConversation();
                avatarRef.current?.focus();
              }}
              announceMessages={!pathname.startsWith("/ai-companion")}
              variant="floating"
            />
            <span
              aria-hidden="true"
              className={
                avatarReady
                  ? "pointer-events-none absolute -bottom-[8px] right-8 h-[18px] w-[18px] rotate-45 border-b border-r border-slate-200 bg-[#fbfaf6] shadow-[5px_5px_12px_-8px_rgba(15,23,42,0.35)] sm:-right-[9px] sm:bottom-[clamp(100px,calc(19dvh-33px),142px)] sm:border-b-0 sm:border-r sm:border-t sm:shadow-[5px_-5px_12px_-8px_rgba(15,23,42,0.35)]"
                  : "pointer-events-none absolute -bottom-[8px] right-8 h-4 w-4 rotate-45 border-b border-r border-slate-200 bg-[#fbfaf6] shadow-[5px_5px_12px_-8px_rgba(15,23,42,0.35)] sm:-right-[8px] sm:bottom-8 sm:border-b-0 sm:border-r sm:border-t sm:shadow-[5px_-5px_12px_-8px_rgba(15,23,42,0.35)]"
              }
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        ref={avatarRef}
        type="button"
        drag={avatarReady}
        dragConstraints={dragBounds}
        dragElastic={0}
        dragMomentum={false}
        onPointerDown={() => {
          pointerSequenceRef.current += 1;
        }}
        onDragStart={startDrag}
        onDragEnd={finishDrag}
        onClick={activateAvatar}
        style={{ x: avatarX, y: avatarY }}
        whileDrag={avatarReady ? { scale: 1.08, rotate: -4 } : undefined}
        transition={{ type: "spring", stiffness: 360, damping: 24 }}
        data-avatar-interaction={interactionMode}
        data-avatar-return-delay-ms={DRAG_RETURN_DELAY_MS}
        aria-label={
          !avatarReady
            ? isOpen
              ? "Close KIRA conversation"
              : "Talk with KIRA"
            : interactionMode === "returning"
              ? "KIRA is returning to the corner"
              : interactionMode === "recovering"
                ? "KIRA is standing up in the corner"
                : interactionMode === "waiting"
                  ? "KIRA will return to the corner shortly"
                  : isOpen
                    ? "Close KIRA conversation"
                    : isDocked()
                      ? "Drag KIRA or click to open the conversation"
                      : "Click KIRA to return to the corner"
        }
        aria-expanded={isOpen}
        aria-controls="levon-companion"
        className={
          avatarReady
            ? "pointer-events-auto fixed bottom-0 right-2 z-[123] h-[clamp(150px,25dvh,230px)] w-[clamp(84px,20vw,135px)] origin-[50%_28%] touch-none cursor-grab border-0 bg-transparent p-0 outline-none [filter:drop-shadow(0_12px_14px_rgba(15,23,42,0.2))] active:cursor-grabbing focus-visible:rounded-3xl focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 sm:right-3"
            : "pointer-events-auto fixed bottom-3 right-3 z-[123] h-[78px] w-[70px] overflow-hidden rounded-[22px] border border-slate-200 bg-[#f5f1e8] p-0 shadow-[0_16px_38px_-18px_rgba(15,23,42,0.55)] outline-none ring-4 ring-[#fffefa]/80 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 sm:bottom-5 sm:right-5 sm:h-[84px] sm:w-[76px]"
        }
      >
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 block h-full"
          style={{
            width:
              interactionMode === "returning" ||
              interactionMode === "recovering"
                ? `${CRAWL_STAGE_WIDTH_SCALE * 100}%`
                : "100%",
            x: stageX,
          }}
          animate={{ ...visibleModelAnimation, opacity: avatarReady ? 1 : 0 }}
          transition={visibleModelTransition}
        >
          {!avatarFailed && (
            <AvatarStage
              interactionMode={interactionMode}
              modelUrl={modelUrl}
              onLoadStateChange={handleAvatarLoadState}
              renderWidthScale={
                interactionMode === "returning" ||
                interactionMode === "recovering"
                  ? CRAWL_STAGE_WIDTH_SCALE
                  : 1
              }
            />
          )}
        </motion.span>

        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 right-0 h-[78px] w-[70px] overflow-hidden rounded-[22px] border border-slate-200 bg-[#f5f1e8] shadow-[0_16px_38px_-18px_rgba(15,23,42,0.55)] sm:h-[84px] sm:w-[76px]"
          animate={{ opacity: avatarReady ? 0 : 1 }}
          transition={{ duration: 0.18 }}
        >
          <Image
            src="/images/ai-companion/kira-comms.webp"
            alt=""
            draggable={false}
            fill
            sizes="76px"
            className="origin-[50%_22%] scale-[1.55] object-cover object-[50%_18%]"
            priority
          />
          <span className="absolute inset-x-0 bottom-0 h-5 bg-gradient-to-t from-slate-950/35 to-transparent" />
          <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 rounded-full bg-slate-950/78 px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-sm">
            KIRA
          </span>
        </motion.span>
      </motion.button>
    </div>
  );
}
