"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  target?: string;
  rel?: string;
}

const variants: Record<string, string> = {
  primary:
    "btn-shimmer bg-accent-hover text-white font-semibold shadow-sm hover:-translate-y-0.5 hover:bg-neutral-950 hover:shadow-xl hover:shadow-accent/25",
  secondary:
    "border border-neutral-300 text-neutral-950 backdrop-blur-sm hover:-translate-y-0.5 hover:border-accent hover:bg-accent hover:text-white",
  ghost: "text-neutral-900 hover:text-neutral-950 hover:underline underline-offset-4",
};

const sizes: Record<string, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-base tracking-wide",
};

const base =
  "group inline-flex items-center justify-center gap-2 rounded-full transition-all duration-300 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 " +
  "disabled:opacity-50 disabled:cursor-not-allowed";

function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export default function Button({
  children,
  href,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  disabled = false,
  target,
  rel,
}: ButtonProps) {
  const classes =
    `${base} ${variants[variant]} ${sizes[size]} ${className}`.trim();
  const content = (
    <>
      {children}
      {variant === "primary" && <ArrowIcon />}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes} onClick={onClick} target={target} rel={rel}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {content}
    </button>
  );
}
