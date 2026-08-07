"use client";
import React, { useState } from "react";

const FORMSPREE_ID = "mpqqwdgr";

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="text-green-600 text-lg font-semibold mb-2">✓ Message Sent!</div>
        <p className="text-green-700">Thank you for reaching out. I&apos;ll get back to you soon!</p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="flex flex-col md:flex-row justify-between gap-5">
        <label htmlFor="contact-name" className="sr-only">
          Your name
        </label>
        <input
          id="contact-name"
          type="text"
          name="name"
          placeholder="Your Name"
          required
          className="bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-200 px-2 py-2 rounded-md text-sm text-neutral-700 w-full"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <label htmlFor="contact-email" className="sr-only">
          Your email address
        </label>
        <input
          id="contact-email"
          type="email"
          name="email"
          placeholder="Your email address"
          required
          className="bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-200 px-2 py-2 rounded-md text-sm text-neutral-700 w-full"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>
      <div>
        <label htmlFor="contact-message" className="sr-only">
          Your message
        </label>
        <textarea
          id="contact-message"
          name="message"
          placeholder="Your Message"
          required
          rows={10}
          className="bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-200 px-2 mt-4 py-2 rounded-md text-sm text-neutral-700 w-full"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        />
      </div>

      {status === "error" && (
        <div
          role="alert"
          className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm"
        >
          Failed to send message. Please try again or email me at{" "}
          <a
            className="font-semibold underline underline-offset-2"
            href="mailto:zhao.levon@gmail.com"
          >
            zhao.levon@gmail.com
          </a>
          .
        </div>
      )}

      <button
        className={`w-full px-2 py-2 mt-4 rounded-md font-bold transition-colors ${
          status === "submitting"
            ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
            : "bg-neutral-800 text-white hover:bg-neutral-700"
        }`}
        type="submit"
        disabled={status === "submitting"}
      >
        {status === "submitting" ? "Sending..." : "Submit"}
      </button>
    </form>
  );
};
