import Link from "next/link";
import {
  IconDatabase,
  IconMessageCircle,
  IconMicrophone,
  IconShieldLock,
} from "@tabler/icons-react";

import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import { createPageMetadata } from "@/lib/siteMetadata";

export const metadata = createPageMetadata({
  title: "KIRA Privacy",
  description:
    "How the KIRA portfolio companion processes conversations, page context, voice, and optional contact details.",
  path: "/privacy",
});

const serviceBoundaries = [
  {
    name: "LiveKit",
    detail:
      "Carries the realtime text and audio session and routes it to the KIRA agent.",
  },
  {
    name: "Deepgram / LiveKit Inference",
    detail:
      "Turns speech into text. The default worker uses Deepgram through LiveKit Inference; a deployment may instead use a direct Deepgram connection.",
  },
  {
    name: "Google Gemini",
    detail:
      "Generates KIRA’s reply from Levon’s curated portfolio context and the bounded current-page reference.",
  },
  {
    name: "ElevenLabs",
    detail: "Turns KIRA’s reply into speech when voice output is used.",
  },
  {
    name: "AWS DynamoDB",
    detail:
      "Stores interaction and contact records when database storage is configured, with asynchronous TTL expiry schedules.",
  },
  {
    name: "Formspree",
    detail:
      "Receives the contact details and page path only when you submit the optional interest form, so Levon can be notified.",
  },
];

export default function PrivacyPage() {
  return (
    <Container>
      <PageHeader
        eyebrow="KIRA privacy"
        title="Browsing alone does not create a KIRA activity record."
        description={
          <p>
            KIRA starts logging interaction data only after you send a text
            message or activate the microphone. This page explains what is
            processed, what may be stored, and how long it is scheduled to
            remain.
          </p>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(260px,0.75fr)]">
        <div className="space-y-5">
          <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.45)] sm:p-7">
            <div className="flex items-start gap-4">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
                <IconMessageCircle size={21} aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-xl font-semibold tracking-[-0.025em] text-slate-950">
                  Browsing and conversation records
                </h2>
                <div className="mt-3 space-y-3 text-sm leading-6 text-slate-600">
                  <p>
                    While you browse without interacting, KIRA may prepare a
                    short on-screen highlight from the public page in your
                    browser, but it does not send or save a KIRA browsing
                    record.
                  </p>
                  <p>
                    After your first text message or microphone activation,
                    KIRA may store final user messages or speech transcripts,
                    final KIRA replies, and a bounded page reference consisting
                    of the page path, title, and short highlight. Records share
                    a random per-tab session identifier.
                  </p>
                  <p>
                    When database storage is configured, those records are
                    scheduled to expire after about 90 days. Expiration uses
                    DynamoDB TTL, which deletes asynchronously, so removal may
                    occur after the exact expiry time.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.45)] sm:p-7">
            <div className="flex items-start gap-4">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-700">
                <IconMicrophone size={21} aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-xl font-semibold tracking-[-0.025em] text-slate-950">
                  Voice and raw audio
                </h2>
                <div className="mt-3 space-y-3 text-sm leading-6 text-slate-600">
                  <p>
                    Microphone access is requested only when you press the
                    microphone button. Live audio is carried through LiveKit
                    and processed by speech-recognition services so KIRA can
                    respond in real time.
                  </p>
                  <p>
                    This site does not persist raw microphone audio. It may
                    store the final transcript and final reply as conversation
                    records after voice interaction begins.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.45)] sm:p-7">
            <div className="flex items-start gap-4">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-800">
                <IconDatabase size={21} aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-xl font-semibold tracking-[-0.025em] text-slate-950">
                  Optional contact details
                </h2>
                <div className="mt-3 space-y-3 text-sm leading-6 text-slate-600">
                  <p>
                    If you submit the interest form, its name, email, interest,
                    message, and page path may be stored under the same session
                    as your KIRA interaction. This lets Levon understand the
                    context of your inquiry. The site&apos;s database copy is
                    scheduled to expire after about 365 days, subject to the
                    same asynchronous TTL deletion.
                  </p>
                  <p>
                    The submitted contact details and page path are also sent
                    to Formspree for notification delivery. Formspree applies
                    its own retention terms; the site&apos;s 365-day schedule
                    does not control Formspree&apos;s copy. Read the{" "}
                    <a
                      href="https://formspree.io/legal/privacy-policy/"
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-sky-700 underline decoration-sky-300 underline-offset-4 transition hover:text-sky-900"
                    >
                      Formspree privacy policy
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-5">
          <section className="rounded-[28px] border border-slate-800 bg-slate-950 p-5 text-white shadow-[0_24px_70px_-42px_rgba(15,23,42,0.9)] sm:p-6">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-sky-300">
                <IconShieldLock size={20} aria-hidden="true" />
              </span>
              <h2 className="text-lg font-semibold tracking-[-0.02em]">
                Service boundaries
              </h2>
            </div>
            <dl className="mt-6 space-y-5">
              {serviceBoundaries.map((service) => (
                <div key={service.name}>
                  <dt className="text-xs font-semibold text-white">
                    {service.name}
                  </dt>
                  <dd className="mt-1 text-xs leading-5 text-slate-300">
                    {service.detail}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-[#fbfaf6] p-5 sm:p-6">
            <h2 className="text-lg font-semibold tracking-[-0.02em] text-slate-950">
              Browser storage and your choices
            </h2>
            <div className="mt-3 space-y-3 text-xs leading-5 text-slate-600">
              <p>
                A random session ID remains in per-tab session storage. Pending
                interaction records may remain there for retry until the site
                accepts them or the tab session ends. They are not placed in
                cross-session local storage.
              </p>
              <p>
                You can browse without messaging KIRA, keep the microphone off,
                or disconnect an active KIRA session at any time.
              </p>
              <p>
                To request access to or deletion of a stored interaction or
                contact submission, use the{" "}
                <Link
                  href="/contact"
                  className="font-semibold text-sky-700 underline decoration-sky-300 underline-offset-4 transition hover:text-sky-900"
                >
                  Contact page
                </Link>
                . Include the approximate date and any email used so the record
                can be located.
              </p>
              <p>
                KIRA service availability and storage configuration can vary by
                deployment. Opening this page or the KIRA panel does not itself
                activate those services.
              </p>
            </div>
          </section>
        </aside>
      </div>
    </Container>
  );
}
