"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  Component,
  FormEvent,
  forwardRef,
  KeyboardEvent,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  IconArrowUp,
  IconArrowUpRight,
  IconBook2,
  IconMicrophone,
  IconMicrophoneOff,
  IconRefresh,
  IconSparkles,
} from "@tabler/icons-react";
import { useCompanion } from "@/components/companion/CompanionContext";
import { COMPANION_MESSAGE_MAX_LENGTH } from "@/lib/companion/history";
import {
  resolveCompanionTheme,
  type CompanionThemeId,
} from "@/lib/companion/theme";
import styles from "./AiCompanionExperience.module.scss";

const loadCompanionMarkdown = () => import("./CompanionMarkdown");

const CompanionMarkdown = dynamic(
  () => loadCompanionMarkdown().then((module) => module.CompanionMarkdown),
  {
    loading: () => <p>Routing source-linked debrief…</p>,
  }
);

type CompanionMarkdownBoundaryProps = {
  children: ReactNode;
  content: string;
};

class CompanionMarkdownBoundary extends Component<
  CompanionMarkdownBoundaryProps,
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? (
      <p className={styles.markdownFallback}>{this.props.content}</p>
    ) : (
      this.props.children
    );
  }
}

type ThemeDefinition = {
  id: CompanionThemeId;
  version: string;
  label: string;
  shortLabel: string;
  eyebrow: string;
  headline: string;
  description: string;
  cadence: string;
};

const themes: ThemeDefinition[] = [
  {
    id: "rift",
    version: "V.01",
    label: "Rift Broadcast",
    shortLabel: "Rift",
    eyebrow: "Break the obvious",
    headline: "Turn a question into a signal.",
    description:
      "A graphic broadcast built from hard cuts, oversized type, and evidence-first answers.",
    cadence: "CUT / FRAME / REVEAL",
  },
  {
    id: "operator",
    version: "V.02",
    label: "Operator Link",
    shortLabel: "Operator",
    eyebrow: "Acquire · parse · verify",
    headline: "Run the portfolio like a field terminal.",
    description:
      "A modular command surface with calm scanning motion, coordinates, and traceable source nodes.",
    cadence: "SCAN / ROUTE / CONFIRM",
  },
  {
    id: "dual",
    version: "V.03",
    label: "Dual Protocol",
    shortLabel: "Dual",
    eyebrow: "Instinct meets structure",
    headline: "Two visual languages. One continuous mind.",
    description:
      "The hybrid build combines editorial impact with an industrial evidence deck and a darker night mode.",
    cadence: "PULSE / BRIDGE / RESOLVE",
  },
];

const flowSteps = [
  {
    index: "01",
    label: "Brief",
    detail: "Choose a signal",
  },
  {
    index: "02",
    label: "Trace",
    detail: "Match the evidence",
  },
  {
    index: "03",
    label: "Debrief",
    detail: "Open the source",
  },
];

const suggestedPrompts = [
  "What did Levon build at Activision?",
  "Show me the strongest AI projects",
  "What did the YOLO-KAN experiments find?",
  "Summarize Levon's AI engineering experience",
];

const characterByStep = [
  {
    src: "/images/ai-companion/kira-neutral.webp",
    alt: "KIRA, an original anime AI navigator, standing ready with a translucent data card",
  },
  {
    src: "/images/ai-companion/kira-present.webp",
    alt: "KIRA presenting portfolio evidence with an open hand during the trace",
  },
  {
    src: "/images/ai-companion/kira-comms.webp",
    alt: "KIRA leaning into a communications debrief with a projected data panel",
  },
] as const;

const motionPreferenceKey = "ai-companion-motion";
const containsChinese = (value: string) => /[\u3400-\u9fff]/.test(value);

type CompanionComposerHandle = {
  clear: () => void;
  focus: () => void;
  getElement: () => HTMLTextAreaElement | null;
  scrollIntoView: (behavior: ScrollBehavior) => void;
};

type CompanionComposerProps = {
  isThinking: boolean;
  microphoneEnabled: boolean;
  onToggleMicrophone: () => Promise<void>;
  onSubmit: (prompt: string) => Promise<void>;
  error: string | null;
};

const CompanionComposer = memo(
  forwardRef<CompanionComposerHandle, CompanionComposerProps>(
    function CompanionComposer(
      {
        isThinking,
        microphoneEnabled,
        onToggleMicrophone,
        onSubmit,
        error,
      },
      ref
    ) {
      const [input, setInput] = useState("");
      const textareaRef = useRef<HTMLTextAreaElement>(null);

      useImperativeHandle(
        ref,
        () => ({
          clear: () => setInput(""),
          focus: () => textareaRef.current?.focus({ preventScroll: true }),
          getElement: () => textareaRef.current,
          scrollIntoView: (behavior) =>
            textareaRef.current?.scrollIntoView({
              behavior,
              block: "center",
            }),
        }),
        []
      );

      const submit = (event?: FormEvent) => {
        event?.preventDefault();
        const prompt = input.trim();
        if (!prompt || isThinking) return;
        setInput("");
        void onSubmit(prompt);
      };

      const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.nativeEvent.isComposing) return;
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          submit();
        }
      };

      return (
        <form className={styles.composer} onSubmit={submit}>
          <label htmlFor="ai-companion-input">
            Ask KIRA about the portfolio
          </label>
          <span id="ai-companion-input-hint" className={styles.visuallyHidden}>
            Enter sends the question. Shift plus Enter starts a new line.
            Maximum {COMPANION_MESSAGE_MAX_LENGTH.toLocaleString("en-US")}{" "}
            characters.
          </span>
          <div>
            <button
              type="button"
              className={styles.voiceButton}
              onClick={() => void onToggleMicrophone()}
              aria-label={
                microphoneEnabled
                  ? "Turn microphone off"
                  : "Start voice input"
              }
              aria-pressed={microphoneEnabled}
            >
              {microphoneEnabled ? (
                <IconMicrophoneOff size={18} aria-hidden="true" />
              ) : (
                <IconMicrophone size={18} aria-hidden="true" />
              )}
            </button>
            <textarea
              ref={textareaRef}
              id="ai-companion-input"
              rows={1}
              maxLength={COMPANION_MESSAGE_MAX_LENGTH}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              readOnly={isThinking}
              aria-busy={isThinking}
              aria-describedby="ai-companion-input-hint"
              aria-keyshortcuts="Enter Shift+Enter"
              placeholder="Transmit a question…"
            />
            <button
              type="submit"
              disabled={!input.trim() || isThinking}
              aria-label="Send question"
            >
              <IconArrowUp size={18} aria-hidden="true" />
            </button>
          </div>
          {error ? (
            <p role="alert" className={styles.composerError}>
              {error}
            </p>
          ) : null}
        </form>
      );
    }
  )
);

export function AiCompanionExperience({
  initialTheme = "rift",
}: {
  initialTheme?: CompanionThemeId;
}) {
  const {
    messages,
    isThinking,
    sendMessage,
    resetConversation,
    microphoneEnabled,
    toggleMicrophone,
    error,
  } = useCompanion();
  const reduceMotion = useReducedMotion();
  const [theme, setTheme] = useState<CompanionThemeId>(initialTheme);
  const [calmMode, setCalmMode] = useState(false);
  const [motionPreferenceReady, setMotionPreferenceReady] = useState(false);
  const [transitionActive, setTransitionActive] = useState(false);
  const [transitionKey, setTransitionKey] = useState(0);
  const motionEnabledRef = useRef(false);
  const transitionTimer = useRef<number | null>(null);
  const readingAnchorFrame = useRef<number | null>(null);
  const conversationAnchorFrame = useRef<number | null>(null);
  const replyAnchorFrame = useRef<number | null>(null);
  const layoutAnchorFrame = useRef<number | null>(null);
  const layoutAnchorTimer = useRef<number | null>(null);
  const resetFocusFrame = useRef<number | null>(null);
  const resetFocusTimer = useRef<number | null>(null);
  const shouldAnchorReply = useRef(false);
  const hasAnchoredConversation = useRef(false);
  const conversationGeneration = useRef(0);
  const topbarRef = useRef<HTMLElement>(null);
  const consoleBodyRef = useRef<HTMLDivElement>(null);
  const consoleRef = useRef<HTMLElement>(null);
  const lastAssistantRef = useRef<HTMLElement>(null);
  const composerRef = useRef<CompanionComposerHandle>(null);

  const activeTheme =
    themes.find((candidate) => candidate.id === theme) ?? themes[0];
  const activeStep = isThinking ? 1 : messages.length > 0 ? 2 : 0;
  const motionEnabled = motionPreferenceReady && !reduceMotion && !calmMode;
  const conversationStarted = messages.length > 0 || isThinking;
  const lastAssistantMessage = useMemo(() => {
    for (let index = messages.length - 1; index >= 0; index -= 1) {
      if (messages[index].role === "assistant") return messages[index];
    }
    return null;
  }, [messages]);
  const lastAssistantMessageId = lastAssistantMessage?.id ?? null;

  const cancelPendingResetFocus = useCallback(() => {
    if (resetFocusFrame.current)
      window.cancelAnimationFrame(resetFocusFrame.current);
    if (resetFocusTimer.current) window.clearTimeout(resetFocusTimer.current);
    resetFocusFrame.current = null;
    resetFocusTimer.current = null;
  }, []);

  useEffect(() => {
    motionEnabledRef.current = motionEnabled;
  }, [motionEnabled]);

  useEffect(() => {
    const root = document.documentElement;
    if (calmMode) root.dataset.companionCalm = "true";
    else delete root.dataset.companionCalm;

    return () => {
      delete root.dataset.companionCalm;
    };
  }, [calmMode]);

  useEffect(() => {
    const syncThemeFromLocation = () => {
      const requestedTheme = new URL(window.location.href).searchParams.get(
        "theme"
      );
      setTheme(resolveCompanionTheme(requestedTheme));
    };

    syncThemeFromLocation();
    window.addEventListener("popstate", syncThemeFromLocation);
    return () => window.removeEventListener("popstate", syncThemeFromLocation);
  }, []);

  useEffect(() => {
    let storedPreference: string | null = null;
    try {
      storedPreference = window.localStorage.getItem(motionPreferenceKey);
    } catch {
      // Storage can be unavailable in privacy-restricted browsing contexts.
    }
    if (storedPreference === "calm") setCalmMode(true);
    setMotionPreferenceReady(true);
  }, []);

  useEffect(
    () => () => {
      if (transitionTimer.current) window.clearTimeout(transitionTimer.current);
      if (readingAnchorFrame.current)
        window.cancelAnimationFrame(readingAnchorFrame.current);
      if (conversationAnchorFrame.current)
        window.cancelAnimationFrame(conversationAnchorFrame.current);
      if (replyAnchorFrame.current)
        window.cancelAnimationFrame(replyAnchorFrame.current);
      if (layoutAnchorFrame.current)
        window.cancelAnimationFrame(layoutAnchorFrame.current);
      if (layoutAnchorTimer.current)
        window.clearTimeout(layoutAnchorTimer.current);
      cancelPendingResetFocus();
      hasAnchoredConversation.current = false;
    },
    [cancelPendingResetFocus]
  );

  useEffect(() => {
    if (!conversationStarted) {
      hasAnchoredConversation.current = false;
      return;
    }

    if (hasAnchoredConversation.current || window.innerWidth > 930) return;
    hasAnchoredConversation.current = true;

    const anchorFrame = window.requestAnimationFrame(() => {
      conversationAnchorFrame.current = null;
      const consoleElement = consoleRef.current;
      if (!consoleElement) return;

      const headerHeight =
        topbarRef.current?.getBoundingClientRect().height ?? 0;
      const consoleTop =
        consoleElement.getBoundingClientRect().top + window.scrollY;

      window.scrollTo({
        top: Math.max(0, consoleTop - headerHeight - 10),
        behavior: motionEnabled ? "smooth" : "auto",
      });
    });
    conversationAnchorFrame.current = anchorFrame;

    return () => {
      if (conversationAnchorFrame.current !== anchorFrame) return;
      window.cancelAnimationFrame(anchorFrame);
      conversationAnchorFrame.current = null;
      hasAnchoredConversation.current = false;
    };
  }, [conversationStarted, motionEnabled]);

  useEffect(() => {
    const consoleBody = consoleBodyRef.current;
    if (!consoleBody) return;

    if (!conversationStarted) {
      consoleBody.scrollTo({ top: 0, behavior: "auto" });
      return;
    }

    if (window.innerWidth <= 680) return;

    if (!isThinking && lastAssistantRef.current) {
      const assistantTop =
        lastAssistantRef.current.getBoundingClientRect().top -
        consoleBody.getBoundingClientRect().top +
        consoleBody.scrollTop;

      consoleBody.scrollTo({
        top: Math.max(0, assistantTop - 16),
        behavior:
          motionEnabledRef.current && window.innerWidth > 930
            ? "smooth"
            : "auto",
      });
      return;
    }

    consoleBody.scrollTo({
      top: consoleBody.scrollHeight,
      behavior: motionEnabledRef.current ? "smooth" : "auto",
    });
  }, [conversationStarted, isThinking, messages]);

  useEffect(() => {
    if (!lastAssistantMessageId || !shouldAnchorReply.current) return;
    shouldAnchorReply.current = false;
    if (window.innerWidth > 930) return;
    const generation = conversationGeneration.current;

    if (replyAnchorFrame.current)
      window.cancelAnimationFrame(replyAnchorFrame.current);

    const outerFrame = window.requestAnimationFrame(() => {
      if (conversationGeneration.current !== generation) return;
      replyAnchorFrame.current = window.requestAnimationFrame(() => {
        replyAnchorFrame.current = null;
        if (conversationGeneration.current !== generation) return;
        const assistantMessage = lastAssistantRef.current;
        if (!assistantMessage) return;

        const headerHeight =
          topbarRef.current?.getBoundingClientRect().height ?? 0;
        const assistantTop =
          assistantMessage.getBoundingClientRect().top + window.scrollY;

        window.scrollTo({
          top: Math.max(0, assistantTop - headerHeight - 10),
          behavior: motionEnabledRef.current ? "smooth" : "auto",
        });
      });
    });
    replyAnchorFrame.current = outerFrame;

    return () => {
      if (replyAnchorFrame.current)
        window.cancelAnimationFrame(replyAnchorFrame.current);
      replyAnchorFrame.current = null;
    };
  }, [lastAssistantMessageId]);

  useEffect(() => {
    const getLayoutMode = () => {
      if (window.innerWidth <= 680) return "mobile";
      if (window.innerWidth <= 930) {
        return window.innerHeight <= 680 &&
          window.innerWidth > window.innerHeight
          ? "compact-landscape"
          : "tablet";
      }
      return "desktop";
    };

    let previousLayoutMode = getLayoutMode();

    const restoreAfterLayoutChange = () => {
      const nextLayoutMode = getLayoutMode();
      if (nextLayoutMode === previousLayoutMode) return;
      previousLayoutMode = nextLayoutMode;
      if (!conversationStarted) return;

      if (layoutAnchorFrame.current)
        window.cancelAnimationFrame(layoutAnchorFrame.current);
      if (layoutAnchorTimer.current)
        window.clearTimeout(layoutAnchorTimer.current);

      layoutAnchorFrame.current = window.requestAnimationFrame(() => {
        const consoleBody = consoleBodyRef.current;
        const assistantMessage = lastAssistantRef.current;

        if (consoleBody && assistantMessage && window.innerWidth > 680) {
          const assistantTop =
            assistantMessage.getBoundingClientRect().top -
            consoleBody.getBoundingClientRect().top +
            consoleBody.scrollTop;
          consoleBody.scrollTo({
            top: Math.max(0, assistantTop - 16),
            behavior: "auto",
          });
        }

        const alignWindowToAnswer = () => {
          const anchor = lastAssistantRef.current ?? consoleRef.current;
          if (!anchor) return;

          const headerHeight =
            topbarRef.current?.getBoundingClientRect().height ?? 0;
          const anchorTop = anchor.getBoundingClientRect().top + window.scrollY;

          window.scrollTo({
            top: Math.max(0, anchorTop - headerHeight - 10),
            behavior: "auto",
          });
        };

        layoutAnchorFrame.current =
          window.requestAnimationFrame(alignWindowToAnswer);
        layoutAnchorTimer.current = window.setTimeout(alignWindowToAnswer, 260);
      });
    };

    window.addEventListener("resize", restoreAfterLayoutChange);
    return () => {
      window.removeEventListener("resize", restoreAfterLayoutChange);
      if (layoutAnchorFrame.current)
        window.cancelAnimationFrame(layoutAnchorFrame.current);
      if (layoutAnchorTimer.current)
        window.clearTimeout(layoutAnchorTimer.current);
    };
  }, [conversationStarted]);

  const stageStatus = useMemo(() => {
    if (isThinking) return "Tracing portfolio signals";
    if (lastAssistantMessage) return "Live response ready";
    return "Channel ready";
  }, [isThinking, lastAssistantMessage]);

  const chooseTheme = (nextTheme: CompanionThemeId) => {
    cancelPendingResetFocus();
    if (nextTheme === theme) return;

    const readingAnchor = conversationStarted
      ? lastAssistantRef.current ??
        (window.innerWidth > 680 ? consoleRef.current : null)
      : null;
    const previousAnchorTop =
      window.innerWidth <= 930
        ? readingAnchor?.getBoundingClientRect().top ?? null
        : null;

    const restoreReadingPosition = () => {
      if (previousAnchorTop === null) return;
      const currentAnchor = lastAssistantRef.current ?? consoleRef.current;
      if (!currentAnchor) return;

      const delta =
        currentAnchor.getBoundingClientRect().top - previousAnchorTop;
      if (Math.abs(delta) <= 0.5) return;

      window.scrollTo({
        top: window.scrollY + delta,
        behavior: "auto",
      });
    };

    if (readingAnchorFrame.current)
      window.cancelAnimationFrame(readingAnchorFrame.current);

    setTheme(nextTheme);
    setTransitionKey((current) => current + 1);

    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set("theme", nextTheme);
    window.history.replaceState(
      null,
      "",
      `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`
    );

    if (previousAnchorTop !== null) {
      readingAnchorFrame.current = window.requestAnimationFrame(() => {
        readingAnchorFrame.current = window.requestAnimationFrame(
          restoreReadingPosition
        );
      });
    }

    if (!motionEnabled) return;
    if (transitionTimer.current) window.clearTimeout(transitionTimer.current);
    setTransitionActive(true);
    transitionTimer.current = window.setTimeout(() => {
      transitionTimer.current = null;
      setTransitionActive(false);
    }, 520);
  };

  const toggleMotion = () => {
    cancelPendingResetFocus();
    if (transitionTimer.current) window.clearTimeout(transitionTimer.current);
    transitionTimer.current = null;
    setTransitionActive(false);
    setCalmMode((current) => {
      const next = !current;
      try {
        window.localStorage.setItem(
          motionPreferenceKey,
          next ? "calm" : "full"
        );
      } catch {
        // The in-memory preference still works when storage is unavailable.
      }
      return next;
    });
  };

  const restoreConversationFocus = useCallback(
    (trigger: HTMLElement | null) => {
      window.requestAnimationFrame(() => {
        const activeElement = document.activeElement;
        if (activeElement === document.body || activeElement === trigger) {
          const inputElement = composerRef.current?.getElement();
          const inputRect = inputElement?.getBoundingClientRect();
          const inputIsVisible =
            inputRect &&
            inputRect.top >= 0 &&
            inputRect.bottom <= window.innerHeight;

          if (inputElement && inputIsVisible) {
            inputElement.focus({ preventScroll: true });
          } else {
            document
              .getElementById("companion-title")
              ?.focus({ preventScroll: true });
          }
        }
      });
    },
    []
  );

  const runPrompt = useCallback(
    async (prompt: string, trigger: HTMLElement | null = null) => {
      if (isThinking) return;
      cancelPendingResetFocus();
      shouldAnchorReply.current = trigger === null;
      composerRef.current?.clear();
      void loadCompanionMarkdown().catch(() => undefined);
      const response = sendMessage(prompt);
      restoreConversationFocus(trigger);
      await response;
    },
    [cancelPendingResetFocus, isThinking, restoreConversationFocus, sendMessage]
  );

  const reset = (trigger: HTMLElement | null) => {
    conversationGeneration.current += 1;
    shouldAnchorReply.current = false;
    if (replyAnchorFrame.current)
      window.cancelAnimationFrame(replyAnchorFrame.current);
    replyAnchorFrame.current = null;
    if (readingAnchorFrame.current)
      window.cancelAnimationFrame(readingAnchorFrame.current);
    readingAnchorFrame.current = null;
    resetConversation();
    composerRef.current?.clear();
    cancelPendingResetFocus();

    resetFocusFrame.current = window.requestAnimationFrame(() => {
      resetFocusFrame.current = null;
      const focusStillExpected = () => {
        const activeElement = document.activeElement;
        return activeElement === document.body || activeElement === trigger;
      };
      const inputElement = composerRef.current?.getElement();
      const inputRect = inputElement?.getBoundingClientRect();
      const headerHeight =
        topbarRef.current?.getBoundingClientRect().height ?? 0;
      const inputIsVisible =
        inputRect &&
        inputRect.top >= headerHeight &&
        inputRect.bottom <= window.innerHeight;

      if (inputElement && inputIsVisible && focusStillExpected()) {
        inputElement.focus({ preventScroll: true });
        return;
      }

      composerRef.current?.scrollIntoView(motionEnabled ? "smooth" : "auto");
      const focusComposer = () => {
        resetFocusTimer.current = null;
        if (focusStillExpected()) composerRef.current?.focus();
      };

      if (motionEnabled) {
        resetFocusTimer.current = window.setTimeout(focusComposer, 420);
      } else {
        resetFocusFrame.current = window.requestAnimationFrame(() => {
          resetFocusFrame.current = null;
          focusComposer();
        });
      }
    });
  };

  const openConsole = () => {
    cancelPendingResetFocus();
    composerRef.current?.scrollIntoView(motionEnabled ? "smooth" : "auto");
    window.requestAnimationFrame(() => composerRef.current?.focus());
  };

  return (
    <main
      id="main-content"
      className={`${styles.experience} ${styles[theme]} ${
        calmMode ? styles.calm : ""
      }`}
      data-theme={theme}
      data-step={activeStep}
    >
      <div className={styles.noise} aria-hidden="true" />
      <div className={styles.gridTexture} aria-hidden="true" />
      <div className={styles.orbit} aria-hidden="true" />

      {transitionActive && motionEnabled ? (
        <motion.div
          key={`${theme}-${transitionKey}`}
          className={styles.transitionCurtain}
          initial={
            theme === "operator"
              ? { y: "-110%", opacity: 0.92 }
              : { x: "-115%", skewX: -14, opacity: 0.96 }
          }
          animate={
            theme === "operator"
              ? { y: "110%", opacity: 1 }
              : { x: "115%", skewX: -14, opacity: 1 }
          }
          transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
          aria-hidden="true"
        >
          <span>{activeTheme.version}</span>
          <strong>{activeTheme.shortLabel}</strong>
        </motion.div>
      ) : null}

      <header ref={topbarRef} className={styles.topbar}>
        <Link
          href="/"
          className={styles.homeLink}
          aria-label="Back to homepage"
        >
          <span className={styles.homeMark} aria-hidden="true">
            K
          </span>
          <span>
            <strong>KIRA / SIGNAL DECK</strong>
            <small>Portfolio companion · LiveKit session</small>
          </span>
        </Link>

        <div
          className={styles.themePicker}
          role="group"
          aria-label="Choose interface version"
        >
          {themes.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => chooseTheme(option.id)}
              aria-pressed={theme === option.id}
              className={theme === option.id ? styles.themeActive : undefined}
            >
              <span>{option.version}</span>
              <strong>{option.shortLabel}</strong>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={toggleMotion}
          className={styles.motionToggle}
          aria-label={
            reduceMotion
              ? "Motion reduced by system preference"
              : calmMode
              ? "Restore full motion"
              : "Reduce motion"
          }
          aria-pressed={calmMode || !!reduceMotion}
          disabled={!!reduceMotion}
          title={
            reduceMotion
              ? "Motion reduced by system preference"
              : calmMode
              ? "Restore full motion"
              : "Reduce motion"
          }
        >
          <span className={styles.motionDot} aria-hidden="true" />
          {calmMode || reduceMotion ? "FX Calm" : "FX Full"}
        </button>
      </header>

      <section
        id="companion-workspace"
        className={styles.workspace}
        aria-label="AI companion workspace"
        tabIndex={-1}
      >
        <aside className={styles.missionRail}>
          <div className={styles.railIntro}>
            <span>{activeTheme.version}</span>
            <p>FLOW STATE</p>
          </div>

          <ol className={styles.flowList} aria-label="Companion answer flow">
            {flowSteps.map((step, index) => {
              const isCurrent = activeStep === index;
              const isComplete = activeStep > index;

              return (
                <li
                  key={step.index}
                  className={`${isCurrent ? styles.flowCurrent : ""} ${
                    isComplete ? styles.flowComplete : ""
                  }`}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  <span className={styles.flowIndex}>{step.index}</span>
                  <span className={styles.flowCopy}>
                    <strong>{step.label}</strong>
                    <small>{step.detail}</small>
                  </span>
                  {isCurrent ? (
                    <motion.span
                      layoutId="active-flow-step"
                      className={styles.flowIndicator}
                      transition={{ duration: motionEnabled ? 0.28 : 0 }}
                      aria-hidden="true"
                    />
                  ) : null}
                </li>
              );
            })}
          </ol>

          <div className={styles.railFooter}>
            <span>STATUS</span>
            <strong>{stageStatus}</strong>
            <small>{activeTheme.cadence}</small>
          </div>
        </aside>

        <section className={styles.characterStage} aria-label="Meet KIRA">
          <div className={styles.stageNumber} aria-hidden="true">
            {activeTheme.version.slice(-2)}
          </div>
          <div className={styles.stageLabel}>
            <span>NAVIGATOR / 00-K</span>
            <strong>KIRA</strong>
            <small>Evidence routing specialist</small>
          </div>

          <div className={styles.characterFrame}>
            {characterByStep.map((character, index) => {
              const isActiveCharacter = activeStep === index;
              const shouldPrioritizeCharacter =
                index === 0 || isActiveCharacter;

              return (
                <motion.div
                  key={character.src}
                  className={styles.characterLayer}
                  initial={false}
                  animate={
                    isActiveCharacter
                      ? { opacity: 1, x: 0, scale: 1 }
                      : {
                          opacity: 0,
                          x: motionEnabled
                            ? theme === "operator"
                              ? -14
                              : 14
                            : 0,
                          scale: motionEnabled ? 1.015 : 1,
                        }
                  }
                  transition={{
                    duration: motionEnabled ? 0.34 : 0,
                    ease: "easeOut",
                  }}
                  aria-hidden={!isActiveCharacter}
                >
                  <motion.div
                    className={styles.characterMotion}
                    animate={
                      motionEnabled && isActiveCharacter
                        ? { y: [0, -5, 0], rotate: [0, 0.25, 0] }
                        : { y: 0, rotate: 0 }
                    }
                    transition={{
                      duration: motionEnabled && isActiveCharacter ? 5.8 : 0,
                      repeat: motionEnabled && isActiveCharacter ? Infinity : 0,
                      ease: "easeInOut",
                    }}
                  >
                    <Image
                      src={character.src}
                      alt={isActiveCharacter ? character.alt : ""}
                      fill
                      priority={shouldPrioritizeCharacter}
                      loading={shouldPrioritizeCharacter ? undefined : "lazy"}
                      sizes="(max-width: 767px) 82vw, (max-width: 1180px) 45vw, 38vw"
                      className={`${styles.characterImage} ${
                        index === 2 ? styles.characterImageClose : ""
                      }`}
                    />
                  </motion.div>
                </motion.div>
              );
            })}

            <AnimatePresence>
              {isThinking ? (
                <motion.div
                  key="stage-scan"
                  className={styles.stageScan}
                  initial={{ opacity: 0, y: "-90%" }}
                  animate={
                    motionEnabled
                      ? { opacity: [0, 0.85, 0], y: ["-90%", "0%", "90%"] }
                      : { opacity: 0.55, y: "0%" }
                  }
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: motionEnabled ? 1.35 : 0,
                    repeat: motionEnabled ? Infinity : 0,
                    ease: "linear",
                  }}
                  aria-hidden="true"
                />
              ) : null}
            </AnimatePresence>
          </div>

          <div className={styles.signalCard}>
            <span className={styles.livePulse} aria-hidden="true" />
            <span>
              <small>CHANNEL</small>
              <strong>{isThinking ? "Tracing" : "Online"}</strong>
            </span>
            <span>
              <small>SCOPE</small>
              <strong>Portfolio only</strong>
            </span>
            <button
              type="button"
              className={styles.stageConsoleButton}
              onClick={openConsole}
            >
              Ask
              <IconArrowUpRight size={14} aria-hidden="true" />
            </button>
          </div>
        </section>

        <section
          ref={consoleRef}
          className={styles.console}
          aria-labelledby="companion-title"
        >
          <div className={styles.consoleHeader}>
            <div>
              <p>{activeTheme.eyebrow}</p>
              <h1 id="companion-title" tabIndex={-1}>
                {activeTheme.headline}
              </h1>
              <span>{activeTheme.description}</span>
            </div>
            {conversationStarted ? (
              <button
                type="button"
                onClick={(event) => reset(event.currentTarget)}
                disabled={isThinking}
                className={styles.resetButton}
              >
                <IconRefresh size={15} aria-hidden="true" />
                Reset
              </button>
            ) : null}
          </div>

          <div
            ref={consoleBodyRef}
            className={`${styles.consoleBody} ${
              conversationStarted ? styles.hasConversation : ""
            }`}
            role="log"
            aria-live="polite"
            aria-relevant="additions"
            aria-busy={isThinking}
            tabIndex={-1}
          >
            <AnimatePresence mode="wait" initial={false}>
              {!conversationStarted ? (
                <motion.div
                  key="briefing"
                  className={styles.briefing}
                  initial={{ opacity: 0, y: motionEnabled ? 12 : 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: motionEnabled ? -10 : 0 }}
                  transition={{ duration: motionEnabled ? 0.22 : 0 }}
                >
                  <div className={styles.briefingMark} aria-hidden="true">
                    <IconSparkles size={20} />
                  </div>
                  <div className={styles.briefingCopy}>
                    <span>OPEN A CHANNEL</span>
                    <h2>What should we trace?</h2>
                    <p>
                      Ask about AI systems, research, games, or experience.
                      Every answer uses Levon&apos;s portfolio knowledge and the
                      page you are currently viewing.
                    </p>
                  </div>

                  <div
                    className={styles.operatorReadout}
                    aria-label="Live companion status"
                  >
                    <span>
                      <small>INDEX</small>
                      <strong>04 SOURCE NODES</strong>
                    </span>
                    <span>
                      <small>ROUTE</small>
                      <strong>LIVEKIT / GEMINI</strong>
                    </span>
                    <span>
                      <small>GROUNDING</small>
                      <strong>VERIFIED LINKS</strong>
                    </span>
                  </div>

                  <div className={styles.promptGrid}>
                    {suggestedPrompts.map((prompt, index) => (
                      <button
                        key={prompt}
                        type="button"
                        lang={containsChinese(prompt) ? "zh-CN" : "en"}
                        onClick={(event) =>
                          void runPrompt(prompt, event.currentTarget)
                        }
                        disabled={isThinking}
                      >
                        <span>0{index + 1}</span>
                        <strong>{prompt}</strong>
                        <IconArrowUpRight size={15} aria-hidden="true" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="transcript"
                  className={styles.transcript}
                  initial={{ opacity: 0, y: motionEnabled ? 12 : 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: motionEnabled ? 0.24 : 0 }}
                >
                  {messages.map((message) => (
                    <article
                      key={message.id}
                      ref={
                        message.id === lastAssistantMessageId
                          ? lastAssistantRef
                          : undefined
                      }
                      data-message-role={message.role}
                      className={
                        message.role === "assistant"
                          ? styles.assistantMessage
                          : styles.userMessage
                      }
                    >
                      <header>
                        <span>
                          {message.role === "assistant"
                            ? "KIRA / DEBRIEF"
                            : "YOU / BRIEF"}
                        </span>
                        <small>
                          {message.role === "assistant"
                            ? message.sources?.length
                              ? "SOURCE LINKED"
                              : "LIVE RESPONSE"
                            : message.deliveryStatus === "failed"
                              ? "NOT SENT"
                              : message.deliveryStatus === "pending"
                                ? "SENDING"
                                : "RECEIVED"}
                        </small>
                      </header>

                      {message.role === "assistant" ? (
                        <div
                          className={styles.markdown}
                          lang={
                            containsChinese(message.content) ? "zh-CN" : "en"
                          }
                        >
                          <CompanionMarkdownBoundary content={message.content}>
                            <CompanionMarkdown content={message.content} />
                          </CompanionMarkdownBoundary>
                        </div>
                      ) : (
                        <p
                          lang={
                            containsChinese(message.content) ? "zh-CN" : "en"
                          }
                        >
                          {message.content}
                        </p>
                      )}

                      {message.sources?.length ? (
                        <footer>
                          <span>
                            <IconBook2 size={13} aria-hidden="true" />
                            Source nodes
                          </span>
                          <div>
                            {message.sources.map((source) => (
                              <Link
                                key={`${message.id}-${source.href}`}
                                href={source.href}
                                prefetch={false}
                              >
                                {source.kind} · {source.label}
                                <IconArrowUpRight
                                  size={12}
                                  aria-hidden="true"
                                />
                              </Link>
                            ))}
                          </div>
                        </footer>
                      ) : null}
                    </article>
                  ))}

                  {isThinking ? (
                    <motion.div
                      className={styles.thinking}
                      initial={{ opacity: 0, y: motionEnabled ? 8 : 0 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: motionEnabled ? 0.2 : 0 }}
                    >
                      <span>TRACE IN PROGRESS</span>
                      <div aria-hidden="true">
                        {[0, 1, 2, 3].map((dot) => (
                          <i
                            key={dot}
                            style={{ animationDelay: `${dot * 120}ms` }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  ) : null}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <p
            className={styles.visuallyHidden}
            role="status"
            aria-live="polite"
            aria-atomic="true"
            lang="en"
          >
            {isThinking
              ? "KIRA is tracing the local portfolio sources."
              : ""}
          </p>

          <CompanionComposer
            ref={composerRef}
            isThinking={isThinking}
            microphoneEnabled={microphoneEnabled}
            onToggleMicrophone={toggleMicrophone}
            onSubmit={runPrompt}
            error={error}
          />
        </section>
      </section>
    </main>
  );
}
