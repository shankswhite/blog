"use client";
import Link from "next/link";
import React from "react";

export const Footer = () => {
  return (
    <footer className="flex flex-col items-center justify-between gap-2 border-t border-slate-100 px-5 pb-24 pt-5 text-xs text-slate-500 sm:flex-row sm:py-5 sm:pr-24">
      <p>
        <span className="font-semibold">{new Date().getFullYear()} </span>
        &#8212; Levon Zhao
      </p>
      <Link
        href="/legacy"
        className="font-medium text-slate-500 transition hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
      >
        Legacy Blog archive
      </Link>
    </footer>
  );
};
