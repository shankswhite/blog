"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  IconArrowUp,
  IconBook2,
  IconRefresh,
  IconSparkles,
  IconX,
} from "@tabler/icons-react";
import { useCompanion } from "./CompanionContext";

type CompanionShellProps = {
  variant?: "floating" | "page";
  onClose?: () => void;
};

const suggestedPrompts = [
  "What did the YOLO-KAN experiments find?",
  "Show me Levon's strongest projects",
  "What did Levon build at Activision?",
  "如何联系 Levon？",
];

export function CompanionShell({
  variant = "floating",
  onClose,
}: CompanionShellProps) {
  const { messages, isThinking, sendMessage, resetConversation } =
    useCompanion();
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const isFloating = variant === "floating";

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isThinking]);

  useEffect(() => {
    if (isFloating) inputRef.current?.focus();
  }, [isFloating]);

  const submit = async (event?: FormEvent) => {
    event?.preventDefault();
    const message = input.trim();
    if (!message || isThinking) return;
    setInput("");
    await sendMessage(message);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void submit();
    }
  };

  return (
    <section
      id="levon-companion"
      role={isFloating ? "dialog" : undefined}
      aria-modal={isFloating ? "true" : undefined}
      aria-label="Levon AI companion"
      className={`relative flex min-h-0 flex-col overflow-hidden border border-slate-200/80 bg-[#fbfaf6] shadow-[0_24px_80px_-30px_rgba(15,23,42,0.45)] ${
        isFloating
          ? "h-full w-full rounded-[28px] sm:h-[min(680px,calc(100dvh-7rem))]"
          : "h-[min(760px,calc(100dvh-8rem))] min-h-[620px] rounded-[32px]"
      }`}
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.28] [background-image:radial-gradient(#94a3b8_0.7px,transparent_0.7px)] [background-size:18px_18px]" />

      <header className="relative z-10 flex items-center justify-between border-b border-slate-200/80 bg-[#fbfaf6]/95 px-4 py-3.5 backdrop-blur-xl sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <Image
              src="/images/companion-cat.webp"
              alt="Levon AI companion avatar"
              fill
              sizes="44px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="truncate text-sm font-semibold tracking-tight text-slate-900 sm:text-base">
                Levon AI
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Portfolio mode
              </span>
            </div>
            <p className="truncate text-xs text-slate-500">
              Grounded in Levon&apos;s projects and experience
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <button
              type="button"
              onClick={resetConversation}
              disabled={isThinking}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Start a new conversation"
              title="New conversation"
            >
              <IconRefresh size={17} />
            </button>
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              aria-label="Close companion"
            >
              <IconX size={18} />
            </button>
          )}
        </div>
      </header>

      <div
        className="relative z-10 flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-5"
        role="log"
        aria-live="polite"
        aria-relevant="additions"
      >
        {messages.length === 0 ? (
          <div className="flex min-h-full flex-col justify-center py-4">
            <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-sky-200 bg-sky-50 text-sky-700 shadow-sm">
              <IconSparkles size={19} />
            </div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-700">
              A guided introduction
            </p>
            <h3 className="max-w-md text-2xl font-semibold leading-tight tracking-[-0.03em] text-slate-950 sm:text-3xl">
              Ask about the thinking behind the work.
            </h3>
            <p className="mt-3 max-w-lg text-sm leading-6 text-slate-600">
              Explore Levon&apos;s game design background, AI research, computer
              graphics experiments, and software projects. Answers link back to
              the source material on this site.
            </p>

            <div className="mt-6 grid gap-2">
              {suggestedPrompts.map((prompt, index) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => void sendMessage(prompt)}
                  className="group flex w-full items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-left text-sm text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:bg-white hover:text-slate-950 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                >
                  <span>{prompt}</span>
                  <span className="text-xs font-semibold text-slate-300 transition group-hover:text-sky-600">
                    0{index + 1}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[88%] ${
                    message.role === "user"
                      ? "rounded-[22px] rounded-br-md bg-slate-900 px-4 py-3 text-sm leading-6 text-white shadow-sm"
                      : "rounded-[24px] rounded-bl-md border border-slate-200 bg-white/90 px-4 py-4 text-slate-700 shadow-sm"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <>
                      <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-700">
                        <IconSparkles size={13} />
                        Companion note
                      </div>
                      <div className="companion-markdown text-sm leading-6">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {message.content}
                        </ReactMarkdown>
                      </div>
                      {message.sources && message.sources.length > 0 && (
                        <div className="mt-4 border-t border-slate-100 pt-3">
                          <p className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                            <IconBook2 size={13} />
                            Explore the sources
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {message.sources.map((source) => (
                              <Link
                                key={`${message.id}-${source.href}`}
                                href={source.href}
                                className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-800 transition hover:border-amber-300 hover:bg-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                              >
                                {source.kind} · {source.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  )}
                </div>
              </div>
            ))}

            {isThinking && (
              <div className="flex justify-start" aria-label="Companion is thinking">
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
            <div ref={endRef} />
          </div>
        )}
      </div>

      <form
        onSubmit={submit}
        className="relative z-10 border-t border-slate-200/80 bg-[#fbfaf6]/95 p-3 backdrop-blur-xl sm:p-4"
      >
        <label htmlFor={`companion-input-${variant}`} className="sr-only">
          Ask Levon&apos;s AI companion
        </label>
        <div className="flex items-end gap-2 rounded-[22px] border border-slate-300 bg-white p-2 pl-4 shadow-sm transition focus-within:border-sky-400 focus-within:ring-4 focus-within:ring-sky-100">
          <textarea
            ref={inputRef}
            id={`companion-input-${variant}`}
            rows={1}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about Levon's work…"
            disabled={isThinking}
            className="max-h-28 min-h-10 flex-1 resize-none bg-transparent py-2 text-sm leading-6 text-slate-900 outline-none placeholder:text-slate-400 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={!input.trim() || isThinking}
            aria-label="Send message"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky-600 text-white shadow-sm transition hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
          >
            <IconArrowUp size={18} stroke={2.2} />
          </button>
        </div>
        <p className="mt-2 px-1 text-[10px] leading-4 text-slate-500">
          Curated portfolio answers · Enter to send · Shift+Enter for a new line
        </p>
      </form>
    </section>
  );
}
