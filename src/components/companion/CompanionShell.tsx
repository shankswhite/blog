"use client";

import Image from "next/image";
import Link from "next/link";
import {
  IconArrowUp,
  IconCheck,
  IconHeartHandshake,
  IconLoader2,
  IconMicrophone,
  IconMicrophoneOff,
  IconPower,
  IconRefresh,
  IconShieldLock,
  IconSparkles,
  IconX,
} from "@tabler/icons-react";
import {
  type FormEvent,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { useVoiceSession } from "@/components/companion-voice/VoiceSessionProvider";
import { COMPANION_MESSAGE_MAX_LENGTH } from "@/lib/companion/history";

type CompanionShellProps = {
  variant?: "floating" | "page";
  onClose?: () => void;
  announceMessages?: boolean;
};

const suggestedPrompts = [
  "What stands out on this page?",
  "What are Levon's strongest projects?",
  "Summarize Levon's relevant experience.",
  "How can I contact Levon?",
];

const fieldClassName =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100";

function compactPageHighlight(content: string) {
  return content.replace(/\s+/g, " ").trim();
}

export function CompanionShell({
  variant = "floating",
  onClose,
  announceMessages = true,
}: CompanionShellProps) {
  const {
    phase,
    error,
    messages,
    currentPage,
    agentReady,
    agentState,
    isThinking,
    isSendingText,
    microphoneEnabled,
    sessionId,
    sendText,
    toggleMicrophone,
    end,
    resetConversation,
  } = useVoiceSession();
  const [input, setInput] = useState("");
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadStatus, setLeadStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [leadWasNotified, setLeadWasNotified] = useState(false);
  const [lead, setLead] = useState({
    name: "",
    email: "",
    interest: "Hiring / opportunities",
    message: "",
    consent: false,
    website: "",
  });
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const leadIdRef = useRef("");
  const isFloating = variant === "floating";
  const isBusy =
    phase === "connecting" || phase === "ending" || isSendingText;
  const latestPageMessageId = messages.findLast(
    (message) => message.channel === "page"
  )?.id;
  const visibleMessages = isFloating
    ? messages.filter(
        (message) =>
          message.channel !== "page" || message.id === latestPageMessageId
      )
    : messages;
  const hasUserInteraction = messages.some(
    (message) => message.role === "user"
  );

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [isThinking, messages]);

  useEffect(() => {
    if (isFloating && window.matchMedia("(pointer: fine)").matches) {
      inputRef.current?.focus();
    }
  }, [isFloating]);

  const submit = async (event?: FormEvent) => {
    event?.preventDefault();
    const message = input.trim();
    if (!message || isSendingText) return;
    setInput("");
    await sendText(message);
  };

  const runSuggestedPrompt = async (prompt: string) => {
    if (isSendingText) return;
    setInput("");
    await sendText(prompt);
    window.requestAnimationFrame(() => inputRef.current?.focus());
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.nativeEvent.isComposing) return;
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void submit();
    }
  };

  const submitLead = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!lead.consent || !sessionId || leadStatus === "submitting") return;
    setLeadStatus("submitting");
    if (!leadIdRef.current) leadIdRef.current = crypto.randomUUID();

    try {
      const response = await fetch("/api/companion/lead", {
        method: "POST",
        credentials: "same-origin",
        cache: "no-store",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          id: leadIdRef.current,
          name: lead.name.trim(),
          email: lead.email.trim(),
          interest: lead.interest,
          message: lead.message.trim(),
          consent: lead.consent,
          website: lead.website,
          path: currentPage?.path ?? "/",
        }),
      });
      const result: unknown = await response.json().catch(() => null);
      if (
        !response.ok ||
        !result ||
        typeof result !== "object" ||
        !("stored" in result) ||
        result.stored !== true
      ) {
        throw new Error("lead_submission_failed");
      }
      setLeadWasNotified("notified" in result && result.notified === true);
      setLeadStatus("success");
    } catch {
      setLeadStatus("error");
    }
  };

  const statusLabel = microphoneEnabled
    ? agentState === "speaking"
      ? "KIRA is speaking"
      : "Microphone on"
    : isBusy
      ? "Connecting"
      : agentReady
        ? "Text & voice ready"
        : phase === "error"
          ? "Connection issue"
          : "Ready when you are";

  return (
    <section
      id="levon-companion"
      role={isFloating ? "dialog" : undefined}
      aria-label="KIRA portfolio companion"
      className={`relative flex min-h-0 flex-col border border-slate-200/80 bg-[#fbfaf6] shadow-[0_24px_80px_-30px_rgba(15,23,42,0.45)] ${
        isFloating
          ? "h-[min(410px,calc(100dvh-2rem))] min-h-[300px] w-full overflow-visible rounded-[22px]"
          : "h-[min(780px,calc(100dvh-8rem))] min-h-[620px] overflow-hidden rounded-[32px]"
      }`}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
        <div className="absolute inset-0 opacity-[0.24] [background-image:radial-gradient(#94a3b8_0.7px,transparent_0.7px)] [background-size:18px_18px]" />
      </div>
      <header
        className={`relative z-10 flex items-center justify-between border-b border-slate-200/80 bg-[#fbfaf6]/95 backdrop-blur-xl ${
          isFloating
            ? "rounded-t-[21px] px-3.5 py-2.5"
            : "rounded-t-[31px] px-4 py-3.5 sm:px-5"
        }`}
      >
        <div className={`flex min-w-0 items-center ${isFloating ? "gap-2" : "gap-3"}`}>
          {!isFloating && (
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <Image
                src="/images/companion-cat.webp"
                alt="KIRA companion avatar"
                fill
                sizes="44px"
                className="object-cover"
              />
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2
                className={`truncate font-semibold tracking-tight text-slate-900 ${
                  isFloating ? "text-sm" : "text-sm sm:text-base"
                }`}
              >
                KIRA
              </h2>
              <span
                className={`inline-flex items-center gap-1 rounded-full border font-medium ${
                  isFloating ? "px-1.5 py-0.5 text-[9px]" : "px-2 py-0.5 text-[10px]"
                } ${
                  microphoneEnabled
                    ? "border-rose-200 bg-rose-50 text-rose-700"
                    : agentReady
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 bg-slate-50 text-slate-600"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    microphoneEnabled
                      ? "bg-rose-500 motion-safe:animate-pulse"
                      : agentReady
                        ? "bg-emerald-500"
                        : "bg-slate-400"
                  }`}
                />
                {isFloating
                  ? microphoneEnabled
                    ? "Listening"
                    : isBusy
                      ? "Connecting"
                      : agentReady
                        ? "Ready"
                        : "Offline"
                  : statusLabel}
              </span>
            </div>
            <p className={`truncate text-slate-500 ${isFloating ? "max-w-44 text-[10px]" : "text-xs"}`}>
              {currentPage
                ? `${isFloating ? "Browsing" : "Reading"}: ${currentPage.title}`
                : "Portfolio-aware text and voice assistant"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Link
            href="/privacy"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            aria-label="Read KIRA privacy and data use"
            title="Privacy and data use"
          >
            <IconShieldLock size={17} />
          </Link>
          {messages.length > 1 && (
            <button
              type="button"
              onClick={() => void resetConversation()}
              disabled={isBusy}
              className={`inline-flex items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 disabled:opacity-40 ${
                isFloating ? "h-11 w-11" : "h-9 w-9"
              }`}
              aria-label="Start a new KIRA conversation"
              title="New conversation"
            >
              <IconRefresh size={17} />
            </button>
          )}
          {phase === "connected" && (
            <button
              type="button"
              onClick={() => void end()}
              className={`inline-flex items-center justify-center rounded-xl text-slate-500 transition hover:bg-rose-50 hover:text-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 ${
                isFloating ? "h-11 w-11" : "h-9 w-9"
              }`}
              aria-label="Disconnect KIRA session"
              title="Disconnect"
            >
              <IconPower size={17} />
            </button>
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className={`inline-flex items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                isFloating ? "h-11 w-11" : "h-9 w-9"
              }`}
              aria-label="Close companion"
            >
              <IconX size={18} />
            </button>
          )}
        </div>
      </header>

      <div
        data-companion-conversation="true"
        className={`relative z-10 flex-1 overflow-y-auto overscroll-contain ${
          isFloating ? "px-3.5 py-3" : "px-4 py-5 sm:px-5"
        }`}
        role={announceMessages ? "log" : "region"}
        aria-label={announceMessages ? undefined : "KIRA conversation"}
        aria-live={announceMessages ? "polite" : "off"}
        aria-relevant="additions text"
      >
        <div className={isFloating ? "space-y-2.5" : "space-y-4"}>
          {visibleMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`${isFloating ? "max-w-[94%]" : "max-w-[88%]"} ${
                  message.role === "user"
                    ? `rounded-br-md bg-slate-900 text-white shadow-sm ${
                        isFloating
                          ? "rounded-[17px] px-3 py-2 text-xs leading-5"
                          : "rounded-[22px] px-4 py-3 text-sm leading-6"
                      }`
                    : message.channel === "page"
                      ? `rounded-bl-md border border-sky-200 bg-sky-50/90 text-sky-950 shadow-sm ${
                          isFloating
                            ? "rounded-[17px] px-3 py-2"
                            : "rounded-[22px] px-4 py-3"
                        }`
                      : `rounded-bl-md border border-slate-200 bg-white/90 text-slate-700 shadow-sm ${
                          isFloating
                            ? "rounded-[17px] px-3 py-2"
                            : "rounded-[24px] px-4 py-3"
                        }`
                }`}
              >
                {message.role === "assistant" && (
                  <div
                    className={`flex items-center gap-1.5 font-semibold uppercase tracking-[0.14em] text-sky-700 ${
                      isFloating ? "mb-1 text-[9px]" : "mb-1.5 text-[10px]"
                    }`}
                  >
                    <IconSparkles size={12} />
                    {message.channel === "page" ? "Page highlight" : "KIRA"}
                  </div>
                )}
                <p
                  className={`whitespace-pre-wrap ${
                    isFloating ? "text-xs leading-5" : "text-sm leading-6"
                  } ${
                    message.isFinal ? "" : "italic opacity-60"
                  }`}
                >
                  {isFloating && message.channel === "page"
                    ? compactPageHighlight(message.content)
                    : message.content}
                </p>
                {message.role === "user" &&
                  message.deliveryStatus === "pending" && (
                    <span className="mt-1.5 block text-[10px] text-slate-300">
                      Sending…
                    </span>
                  )}
                {message.role === "user" &&
                  message.deliveryStatus === "failed" && (
                    <button
                      type="button"
                      onClick={() => void sendText(message.content, message.id)}
                      disabled={isSendingText}
                      className="mt-2 rounded-full border border-rose-200/60 bg-rose-50/10 px-2.5 py-1 text-[10px] font-semibold text-rose-100 transition hover:bg-rose-50/20 disabled:opacity-50"
                    >
                      Not sent · Retry
                    </button>
                  )}
              </div>
            </div>
          ))}

          {!isFloating && visibleMessages.length <= 1 && (
            <div className="grid gap-2 pt-2">
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => void runSuggestedPrompt(prompt)}
                  disabled={isSendingText}
                  className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-left text-sm text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:bg-white hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {(isThinking || agentState === "speaking") && (
            <div className="flex justify-start" aria-label="KIRA is responding">
              <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 shadow-sm">
                {[0, 1, 2].map((dot) => (
                  <span
                    key={dot}
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-sky-500 motion-reduce:animate-none"
                    style={{ animationDelay: `${dot * 110}ms` }}
                  />
                ))}
              </div>
            </div>
          )}

          {error && (
            <p
              role="alert"
              className="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs leading-5 text-rose-700"
            >
              {error}
            </p>
          )}

          {!showLeadForm && leadStatus !== "success" && hasUserInteraction && (
            <button
              type="button"
              onClick={() => setShowLeadForm(true)}
              className={`flex w-full items-center justify-between border border-amber-200 bg-amber-50 text-left text-amber-950 transition hover:border-amber-300 hover:bg-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                isFloating
                  ? "gap-2 rounded-xl px-3 py-2 text-xs"
                  : "gap-3 rounded-2xl px-4 py-3 text-sm"
              }`}
            >
              <span>
                <strong className="block text-xs">Interested in Levon?</strong>
                <span className={`mt-0.5 text-amber-800 ${isFloating ? "hidden" : "block text-xs"}`}>
                  Leave a contact and what caught your attention.
                </span>
              </span>
              <IconHeartHandshake size={20} className="shrink-0" />
            </button>
          )}

          {showLeadForm && leadStatus !== "success" && (
            <form
              onSubmit={submitLead}
              className="space-y-3 rounded-2xl border border-amber-200 bg-amber-50/80 p-3.5"
            >
              <div>
                <p className="text-xs font-semibold text-amber-950">
                  Tell Levon you’re interested
                </p>
                <p className="mt-1 text-[11px] leading-4 text-amber-800">
                  Your details are saved so Levon can reply to this request.
                </p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <input
                  type="text"
                  maxLength={80}
                  autoComplete="name"
                  placeholder="Name (optional)"
                  aria-label="Name"
                  value={lead.name}
                  onChange={(event) =>
                    setLead((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  className={fieldClassName}
                />
                <input
                  type="email"
                  required
                  maxLength={254}
                  autoComplete="email"
                  placeholder="Email"
                  aria-label="Email"
                  value={lead.email}
                  onChange={(event) =>
                    setLead((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  className={fieldClassName}
                />
              </div>
              <select
                aria-label="Area of interest"
                value={lead.interest}
                onChange={(event) =>
                  setLead((current) => ({
                    ...current,
                    interest: event.target.value,
                  }))
                }
                className={fieldClassName}
              >
                <option>Hiring / opportunities</option>
                <option>Project collaboration</option>
                <option>Research discussion</option>
                <option>Freelance project</option>
                <option>Other</option>
              </select>
              <textarea
                rows={3}
                maxLength={2000}
                placeholder="What interested you? (optional)"
                aria-label="Interest message"
                value={lead.message}
                onChange={(event) =>
                  setLead((current) => ({
                    ...current,
                    message: event.target.value,
                  }))
                }
                className={`${fieldClassName} resize-none`}
              />
              <label className="flex items-start gap-2 text-[11px] leading-4 text-amber-900">
                <input
                  type="checkbox"
                  required
                  checked={lead.consent}
                  onChange={(event) =>
                    setLead((current) => ({
                      ...current,
                      consent: event.target.checked,
                    }))
                  }
                  className="mt-0.5"
                />
                I agree that Levon may store these details and contact me about
                this request. This site&apos;s database copy is scheduled to
                expire after 365 days. The details are also sent to Formspree,
                which applies its own retention policy, to deliver the
                notification. See the{" "}
                <a
                  href="https://formspree.io/legal/privacy-policy/"
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-2"
                >
                  Formspree privacy policy
                </a>
                .
              </label>
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hidden"
                value={lead.website}
                onChange={(event) =>
                  setLead((current) => ({
                    ...current,
                    website: event.target.value,
                  }))
                }
              />
              {leadStatus === "error" && (
                <p role="alert" className="text-xs text-rose-700">
                  Your details could not be saved. Please try again.
                </p>
              )}
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={leadStatus === "submitting" || !lead.consent}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-900 px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-amber-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 disabled:opacity-50"
                >
                  {leadStatus === "submitting" && (
                    <IconLoader2 size={15} className="animate-spin" />
                  )}
                  Send interest
                </button>
                <button
                  type="button"
                  onClick={() => setShowLeadForm(false)}
                  className="rounded-xl border border-amber-300 bg-white px-3 py-2.5 text-xs font-semibold text-amber-900"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {leadStatus === "success" && (
            <div
              role="status"
              className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
            >
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                <IconCheck size={17} />
              </span>
              {leadWasNotified
                ? "Thanks — Levon has been notified of your interest."
                : "Thanks — your interest was saved, but notification could not be confirmed. Levon can still review the saved request."}
            </div>
          )}
          <div ref={endRef} />
        </div>
      </div>

      <form
        onSubmit={submit}
        className={`relative z-10 border-t border-slate-200/80 bg-[#fbfaf6]/95 backdrop-blur-xl ${
          isFloating ? "rounded-b-[21px] p-2.5" : "rounded-b-[31px] p-3 sm:p-4"
        }`}
      >
        <label htmlFor={`companion-input-${variant}`} className="sr-only">
          Ask KIRA about Levon&apos;s portfolio
        </label>
        <div
          className={`flex items-end gap-2 border border-slate-300 bg-white shadow-sm transition focus-within:border-sky-400 focus-within:ring-4 focus-within:ring-sky-100 ${
            isFloating ? "rounded-2xl p-1.5 pl-2" : "rounded-[22px] p-2 pl-3"
          }`}
        >
          <button
            type="button"
            onClick={() => void toggleMicrophone()}
            disabled={isBusy}
            aria-label={
              microphoneEnabled ? "Turn microphone off" : "Start voice input"
            }
            aria-pressed={microphoneEnabled}
            className={`inline-flex shrink-0 items-center justify-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60 ${
              isFloating ? "h-11 w-11 rounded-xl" : "h-10 w-10 rounded-2xl"
            } ${
              microphoneEnabled
                ? "bg-rose-500 text-white hover:bg-rose-600 focus-visible:ring-rose-500"
                : "bg-sky-50 text-sky-700 hover:bg-sky-100 focus-visible:ring-sky-500"
            }`}
          >
            {isBusy ? (
              <IconLoader2 size={18} className="animate-spin" />
            ) : microphoneEnabled ? (
              <IconMicrophoneOff size={18} />
            ) : (
              <IconMicrophone size={18} />
            )}
          </button>
          <textarea
            ref={inputRef}
            id={`companion-input-${variant}`}
            rows={1}
            maxLength={COMPANION_MESSAGE_MAX_LENGTH}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about this page or Levon's work…"
            readOnly={isSendingText}
            aria-busy={isSendingText}
            className={`max-h-28 flex-1 resize-none bg-transparent text-slate-900 outline-none placeholder:text-slate-400 read-only:opacity-60 ${
              isFloating
                ? "min-h-11 py-3 text-xs leading-5"
                : "min-h-10 py-2 text-sm leading-6"
            }`}
          />
          <button
            type="submit"
            disabled={!input.trim() || isSendingText}
            aria-label="Send text message"
            className={`inline-flex shrink-0 items-center justify-center bg-sky-600 text-white shadow-sm transition hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 ${
              isFloating ? "h-11 w-11 rounded-xl" : "h-10 w-10 rounded-2xl"
            }`}
          >
            {isSendingText ? (
              <IconLoader2 size={18} className="animate-spin" />
            ) : (
              <IconArrowUp size={18} stroke={2.2} />
            )}
          </button>
        </div>
      </form>
    </section>
  );
}
