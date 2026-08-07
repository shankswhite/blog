"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  CompanionSource,
  getCompanionReply,
} from "@/lib/companion/knowledge";

export type CompanionMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: CompanionSource[];
};

type CompanionContextValue = {
  messages: CompanionMessage[];
  isThinking: boolean;
  sendMessage: (content: string) => Promise<void>;
  resetConversation: () => void;
};

const CompanionContext = createContext<CompanionContextValue | null>(null);

const createId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export function CompanionProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<CompanionMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || isThinking) return;

      setMessages((current) => [
        ...current,
        { id: createId(), role: "user", content: trimmed },
      ]);
      setIsThinking(true);

      try {
        await new Promise((resolve) => window.setTimeout(resolve, 420));
        const reply = getCompanionReply(trimmed);
        setMessages((current) => [
          ...current,
          {
            id: createId(),
            role: "assistant",
            content: reply.content,
            sources: reply.sources,
          },
        ]);
      } finally {
        setIsThinking(false);
      }
    },
    [isThinking]
  );

  const value = useMemo(
    () => ({
      messages,
      isThinking,
      sendMessage,
      resetConversation: () => setMessages([]),
    }),
    [isThinking, messages, sendMessage]
  );

  return (
    <CompanionContext.Provider value={value}>
      {children}
    </CompanionContext.Provider>
  );
}

export function useCompanion() {
  const context = useContext(CompanionContext);

  if (!context) {
    throw new Error("useCompanion must be used within CompanionProvider");
  }

  return context;
}
