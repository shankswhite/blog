"use client";

import { useMemo } from "react";
import { useVoiceSession } from "@/components/companion-voice/VoiceSessionProvider";
import type { CompanionSource } from "@/lib/companion/knowledge";

/**
 * Compatibility surface for the full-page companion experiences. The former
 * rule-based chatbot has been removed; every message now uses the same KIRA
 * LiveKit AgentSession as voice input.
 */
export function CompanionProvider({ children }: { children: React.ReactNode }) {
  return children;
}

export function useCompanion() {
  const {
    messages,
    isThinking,
    isSendingText,
    sendText,
    resetConversation,
    microphoneEnabled,
    toggleMicrophone,
    error,
  } = useVoiceSession();

  return useMemo(
    () => ({
      messages: messages.map((message) => ({
        id: message.id,
        role: message.role,
        content: message.content,
        sources: undefined as CompanionSource[] | undefined,
        deliveryStatus: message.deliveryStatus,
      })),
      isThinking: isThinking || isSendingText,
      sendMessage: sendText,
      microphoneEnabled,
      toggleMicrophone,
      error,
      resetConversation: () => {
        void resetConversation();
      },
    }),
    [
      isSendingText,
      isThinking,
      messages,
      microphoneEnabled,
      error,
      resetConversation,
      sendText,
      toggleMicrophone,
    ]
  );
}
