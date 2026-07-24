"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

type ScrollRevealVariant =
  | "rise"
  | "slide-left"
  | "slide-right"
  | "soft-zoom"
  | "tilt-left"
  | "tilt-right"
  | "clip-up"
  | "fade"
  | "lift-wide";

interface ScrollRevealProps {
  children: ReactNode;
  variant?: ScrollRevealVariant;
  /** Delay before the reveal begins, in ms. */
  delay?: number;
  className?: string;
}

export default function ScrollReveal({
  children,
  variant = "rise",
  delay = 0,
  className = "",
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Fall back to showing content immediately when observation isn't possible
    // or the visitor prefers reduced motion.
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced || typeof IntersectionObserver === "undefined") {
      const showFrame = window.requestAnimationFrame(() => setVisible(true));
      return () => window.cancelAnimationFrame(showFrame);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-reveal={variant}
      data-visible={visible ? "true" : "false"}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={className}
    >
      {children}
    </div>
  );
}
