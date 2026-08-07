"use client";

import Link from "next/link";
import {
  IconArrowUpRight,
  IconArchive,
  IconFileText,
  IconFlask,
  IconRoute,
} from "@tabler/icons-react";
import { CompanionShell } from "./CompanionShell";

const contextLinks = [
  {
    href: "/projects/yolo-kan",
    label: "YOLO-KAN research",
    detail: "Object detection + KAN",
    icon: IconFlask,
  },
  {
    href: "/legacy/pathfinding",
    label: "Pathfinding lab",
    detail: "Dijkstra, A*, legacy JPS mode",
    icon: IconRoute,
  },
  {
    href: "/resume",
    label: "Experience",
    detail: "Activision, Handshake, games",
    icon: IconFileText,
  },
  {
    href: "/legacy",
    label: "Legacy Blog",
    detail: "Original site, restored",
    icon: IconArchive,
  },
];

export function CompanionPage() {
  return (
    <main
      id="main-content"
      className="mx-auto w-full max-w-6xl px-4 pb-16 pt-20 sm:px-6 lg:px-10 lg:py-10"
    >
      <div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="order-2 rounded-[28px] border border-slate-200 bg-slate-950 p-5 text-white shadow-[0_24px_70px_-42px_rgba(15,23,42,0.9)] lg:order-1 lg:p-6">
          <div className="flex h-full min-h-[230px] flex-col">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-300">
              Context shelf
            </p>
            <h1 className="mt-3 text-2xl font-semibold leading-tight tracking-[-0.03em]">
              Meet the work before the meeting.
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Ask a focused question, then follow the evidence into a project,
              article, or résumé entry.
            </p>

            <nav className="mt-7 space-y-2" aria-label="Companion sources">
              {contextLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-3 transition hover:border-sky-400/40 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                >
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-sky-300">
                    <item.icon size={17} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-semibold text-white">
                      {item.label}
                    </span>
                    <span className="block truncate text-[11px] text-slate-400">
                      {item.detail}
                    </span>
                  </span>
                  <IconArrowUpRight
                    size={14}
                    className="text-slate-400 transition group-hover:text-sky-300"
                  />
                </Link>
              ))}
            </nav>

            <p className="mt-auto pt-7 text-[11px] leading-5 text-slate-400">
              This public mode answers from curated portfolio content. It does
              not require an account or expose private information.
            </p>
          </div>
        </aside>

        <div className="order-1 lg:order-2">
          <CompanionShell variant="page" />
        </div>
      </div>
    </main>
  );
}
