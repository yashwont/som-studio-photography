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
  variant: ScrollRevealVariant;
  className?: string;
}

export default function ScrollReveal({
  children,
  variant,
  className = "",
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        rootMargin: "0px 0px -20% 0px",
        threshold: 0.08,
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`scroll-reveal scroll-reveal-${variant} ${
        isVisible ? "is-visible" : ""
      } ${className}`.trim()}
    >
      {children}
    </div>
  );
}
