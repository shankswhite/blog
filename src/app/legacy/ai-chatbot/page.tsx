import { permanentRedirect } from "next/navigation";

export default function LegacyChatbotAliasPage() {
  permanentRedirect("/legacy/chatbot");
}
