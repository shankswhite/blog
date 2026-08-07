"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import styles from "./LegacyClassic.module.scss";

function GitHubIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 496 512" width="24" height="24">
      <path
        fill="currentColor"
        d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8z"
      />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="30" height="30">
      <path fill="currentColor" d="M4 6h16v2H4zm4 5h12v2H8zm5 5h7v2h-7z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22">
      <path
        fill="currentColor"
        d="M16.57 22a2 2 0 0 0 1.43-.59l2.71-2.71a1 1 0 0 0 0-1.41l-4-4a1 1 0 0 0-1.41 0l-1.6 1.59a7.55 7.55 0 0 1-3-1.59 7.62 7.62 0 0 1-1.59-3l1.59-1.6a1 1 0 0 0 0-1.41l-4-4a1 1 0 0 0-1.41 0L2.59 6A2 2 0 0 0 2 7.43 15.28 15.28 0 0 0 6.3 17.7 15.28 15.28 0 0 0 16.57 22zM6 5.41 8.59 8 7.3 9.29a1 1 0 0 0-.3.91 10.12 10.12 0 0 0 2.3 4.5 10.08 10.08 0 0 0 4.5 2.3 1 1 0 0 0 .91-.27L16 15.41 18.59 18l-2 2a13.28 13.28 0 0 1-8.87-3.71A13.28 13.28 0 0 1 4 7.41z"
      />
    </svg>
  );
}

const links = [
  ["YOLO-KAN", "/legacy/yolo-kan"],
  ["Computer Graphics", "/legacy/cg"],
  ["AI ChatBot", "/legacy/chatbot"],
  ["Pathfinding", "/legacy/pathfinding"],
] as const;

export function LegacyClassicShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasShadow, setHasShadow] = useState(false);

  useEffect(() => {
    const onScroll = () => setHasShadow(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={styles.legacyRoot}>
      <div className={styles.viewport}>
        <Link href="/" className={styles.returnLink}>
          Return to the new portfolio
        </Link>
        <motion.header
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 40, delay: 0.5 }}
          className={styles.header}
          style={{
            boxShadow: hasShadow
              ? "rgba(0,0,0,.1) 0 4px 6px -1px, rgba(0,0,0,.06) 0 2px 4px -1px"
              : "none",
          }}
        >
          <div className={styles.headerInner}>
            <div className={styles.name}>Levon</div>
            <ul
              id="legacy-menu"
              className={`${styles.menu} ${menuOpen ? "" : styles.menuClosed}`}
            >
              <li>
                <a
                  href="https://github.com/shankswhite"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                >
                  <GitHubIcon />
                </a>
              </li>
              {links.map(([label, href]) => (
                <li key={href}>
                  <Link href={href} onClick={() => setMenuOpen(false)}>
                    {label}
                  </Link>
                </li>
              ))}
              <li className={styles.phone}>
                <p>+1 669 388 2709</p>
                <span className={styles.phoneIcon}>
                  <PhoneIcon />
                </span>
              </li>
            </ul>
            <button
              type="button"
              className={styles.menuButton}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="legacy-menu"
              onClick={() => setMenuOpen((current) => !current)}
            >
              <MenuIcon />
            </button>
          </div>
        </motion.header>
        <main id="legacy-main" className={styles.pageSurface}>
          {children}
        </main>
      </div>
    </div>
  );
}
