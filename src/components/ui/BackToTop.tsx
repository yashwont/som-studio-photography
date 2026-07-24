"use client";

import { useEffect, useState } from "react";

/**
 * Floating control that appears after the visitor scrolls past the fold and
 * returns them to the top — where the (now non-sticky) category menu lives.
 */
export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleClick() {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Back to top to browse categories"
      className={`btn-shimmer group fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-accent px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white shadow-[0_12px_30px_-10px_rgba(10,10,10,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-neutral-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 sm:bottom-8 sm:right-8 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5"
      >
        <path d="M12 19V5" />
        <path d="m5 12 7-7 7 7" />
      </svg>
      <span className="hidden sm:inline">Menu</span>
    </button>
  );
}
