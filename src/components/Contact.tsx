"use client";

import { useState } from "react";
import { IconArrowUpRight, IconCheck } from "@tabler/icons-react";

const FORMSPREE_ID = "mpqqwdgr";

const fieldClassName =
  "mt-2 w-full rounded-2xl border border-slate-200 bg-[#fbfaf6] px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    website: "",
  });
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");

    if (formData.website) {
      setStatus("success");
      return;
    }

    try {
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
        }),
        signal: AbortSignal.timeout(10_000),
      });

      if (!response.ok) throw new Error("Form submission failed");

      setStatus("success");
      setFormData({ name: "", email: "", message: "", website: "" });
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div
        role="status"
        className="flex min-h-[430px] flex-col items-center justify-center rounded-[28px] border border-emerald-200 bg-emerald-50 p-8 text-center"
      >
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm">
          <IconCheck size={22} stroke={2.5} />
        </span>
        <h2 className="mt-5 text-2xl font-semibold tracking-[-0.035em] text-emerald-950">
          Message sent.
        </h2>
        <p className="mt-2 max-w-sm text-sm leading-6 text-emerald-800">
          Thanks for reaching out. I&apos;ll get back to you as soon as I can.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 rounded-full border border-emerald-300 bg-white px-4 py-2.5 text-sm font-semibold text-emerald-800 transition hover:border-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
    >
      <div className="mb-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-700">
          Send a note
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-slate-950">
          What are you working on?
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          A little context about the goal, timeline, and where you think I can
          help makes for a useful first conversation.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-xs font-semibold text-slate-700" htmlFor="contact-name">
          Name
          <input
            id="contact-name"
            type="text"
            name="name"
            autoComplete="name"
          placeholder="Your name"
          required
          maxLength={80}
            className={fieldClassName}
            value={formData.name}
            onChange={(event) =>
              setFormData((current) => ({ ...current, name: event.target.value }))
            }
          />
        </label>
        <label className="text-xs font-semibold text-slate-700" htmlFor="contact-email">
          Email
          <input
            id="contact-email"
            type="email"
            name="email"
            autoComplete="email"
          placeholder="you@example.com"
          required
          maxLength={254}
            className={fieldClassName}
            value={formData.email}
            onChange={(event) =>
              setFormData((current) => ({ ...current, email: event.target.value }))
            }
          />
        </label>
      </div>

      <label
        className="mt-5 block text-xs font-semibold text-slate-700"
        htmlFor="contact-message"
      >
        Message
        <textarea
          id="contact-message"
          name="message"
          placeholder="Tell me about the project, problem, or idea…"
          required
          rows={8}
          maxLength={5000}
          className={fieldClassName}
          value={formData.message}
          onChange={(event) =>
            setFormData((current) => ({ ...current, message: event.target.value }))
          }
        />
      </label>

      <label className="sr-only" aria-hidden="true">
        Website (leave this field empty)
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={formData.website}
          onChange={(event) =>
            setFormData((current) => ({
              ...current,
              website: event.target.value,
            }))
          }
        />
      </label>

      <div aria-live="polite">
        {status === "error" && (
          <div
            role="alert"
            className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-700"
          >
            The message could not be sent. Please try again or email{" "}
            <a className="font-semibold underline" href="mailto:zhao.levon@gmail.com">
              zhao.levon@gmail.com
            </a>
            .
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:translate-y-0 disabled:bg-slate-300"
      >
        {status === "submitting" ? "Sending…" : "Send message"}
        {status !== "submitting" && <IconArrowUpRight size={16} />}
      </button>
      <p className="mt-3 text-center text-[10px] leading-4 text-slate-400">
        Your name, email, and message are processed by Formspree to deliver this
        note. Please do not include sensitive information.
      </p>
    </form>
  );
}
