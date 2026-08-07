import type { Metadata } from "next";
import { LegacyChatbot } from "@/components/legacy-classic/LegacyChatbot";

export const metadata: Metadata = {
  title: "AI ChatBot — Legacy Blog",
  description:
    "An archive-only recreation of the original Cognito-gated Levon AI Agent interface, with no AWS authentication or paid model request.",
  alternates: { canonical: "/legacy/chatbot" },
};

export default function LegacyChatbotPage() {
  return <LegacyChatbot />;
}
