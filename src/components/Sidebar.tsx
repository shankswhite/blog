"use client";

import { AnimatePresence, motion } from "framer-motion";
import { IconMenu2, IconSparkles, IconX } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { navlinks } from "@/constants/navlinks";
import { socials } from "@/constants/socials";
import { Navlink } from "@/types/navlink";
import { Badge } from "./Badge";

export const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname() ?? "";
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileDrawerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // The router is external state; route changes must dismiss an open drawer.
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const drawer = mobileDrawerRef.current;
    const focusable = drawer?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    focusable?.[0]?.focus();

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setMobileOpen(false);
        window.setTimeout(() => menuButtonRef.current?.focus(), 0);
        return;
      }

      if (event.key !== "Tab" || !focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen]);

  const closeMobileMenu = () => {
    setMobileOpen(false);
    window.setTimeout(() => menuButtonRef.current?.focus(), 0);
  };

  return (
    <>
      <aside className="sticky top-0 hidden h-dvh w-[230px] shrink-0 flex-col px-5 py-7 lg:flex">
        <SidebarContent />
      </aside>

      <button
        ref={menuButtonRef}
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-[90] inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-[#fffefa]/95 text-slate-700 shadow-lg shadow-slate-900/10 backdrop-blur-lg transition hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 lg:hidden"
        aria-label="Open navigation"
        aria-expanded={mobileOpen}
      >
        <IconMenu2 size={20} />
      </button>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close navigation backdrop"
              tabIndex={-1}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
              className="fixed inset-0 z-[130] cursor-default bg-slate-950/35 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              ref={mobileDrawerRef}
              role="dialog"
              aria-modal="true"
              aria-label="Site navigation"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed inset-y-0 left-0 z-[140] flex w-[min(86vw,300px)] flex-col bg-[#f6f4ee] px-6 py-6 shadow-2xl lg:hidden"
            >
              <button
                type="button"
                onClick={closeMobileMenu}
                className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-white hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                aria-label="Close navigation"
              >
                <IconX size={18} />
              </button>
              <SidebarContent onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <SidebarHeader />
      <Navigation onNavigate={onNavigate} />
      <div onClick={onNavigate} className="mt-auto pt-4">
        <Badge href="/resume" text="Read Résumé" />
      </div>
    </div>
  );
}

function Navigation({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname() ?? "";
  const isActive = (href: string) =>
    href === "/" ? pathname === href : pathname.startsWith(href);

  return (
    <nav
      className="my-8 flex min-h-0 flex-1 flex-col overflow-y-auto"
      aria-label="Main navigation"
    >
      <div className="space-y-1">
        {navlinks.map((link: Navlink) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            aria-current={isActive(link.href) ? "page" : undefined}
            className={twMerge(
              "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-slate-500 transition hover:bg-white/70 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500",
              isActive(link.href) &&
                "bg-white font-medium text-slate-950 shadow-sm ring-1 ring-slate-200/70"
            )}
          >
            <link.icon
              className={twMerge(
                "h-4 w-4 shrink-0",
                isActive(link.href) ? "text-sky-600" : "text-slate-400"
              )}
            />
            <span>{link.label}</span>
          </Link>
        ))}
      </div>

      <p className="mb-2 mt-7 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        Elsewhere
      </p>
      <div className="space-y-1">
        {socials.map((link: Navlink) => (
          <Link
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-slate-500 transition hover:bg-white/70 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            <link.icon className="h-4 w-4 shrink-0 text-slate-400" />
            <span>{link.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

function SidebarHeader() {
  return (
    <Link
      href="/"
      className="flex items-center gap-3 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
    >
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <Image
          src="/images/levon-portrait.png"
          alt="Levon Zhao"
          fill
          sizes="48px"
          className="object-cover object-top"
          priority
        />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold tracking-tight text-slate-950">
          Levon Zhao
        </p>
        <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-500">
          <IconSparkles size={11} className="text-sky-600" />
          Games · AI · Software
        </p>
      </div>
    </Link>
  );
}
