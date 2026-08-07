import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import { CompanionShell } from "@/components/companion/CompanionShell";
import { createPageMetadata } from "@/lib/siteMetadata";

export const metadata = createPageMetadata({
  title: "AI Chatbot — Legacy Blog",
  description:
    "A safe, account-free replacement for the Bedrock-powered résumé chatbot from Levon Zhao's previous portfolio.",
  path: "/legacy/ai-chatbot",
});

export default function LegacyChatbotPage() {
  return (
    <Container>
      <PageHeader
        eyebrow="Legacy Blog / AI Chatbot"
        title="The original idea, without the login wall."
        description={
          <p>
            The old route used Amplify Authenticator and an AWS Bedrock query.
            This archive keeps the useful interaction through the new curated,
            bilingual companion. The public interface needs no account and
            makes no paid AI request.
          </p>
        }
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        {[
          ["Then", "Cognito sign-in + Bedrock request"],
          ["Now", "Curated public portfolio knowledge"],
          ["Scope", "Experience, skills, and 11 projects"],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-[20px] border border-slate-200 bg-white p-4 shadow-sm"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-700">
              {label}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-700">{value}</p>
          </div>
        ))}
      </div>

      <p className="mb-5 rounded-[20px] border border-sky-200 bg-sky-50 px-4 py-3 text-xs leading-5 text-sky-950">
        <span className="font-semibold">Archive note.</span> The former cloud
        implementation remains part of the project history. This public
        edition is frontend-only, sends no prompt to a model provider, and
        creates no per-message AI charge.
      </p>

      <CompanionShell variant="page" />
    </Container>
  );
}
