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
  primary: "bg-gold text-white font-semibold hover:brightness-110",
  secondary: "border border-gold text-gold hover:bg-gold/10",
  ghost: "text-neutral-600 hover:text-neutral-950",
};

const sizes: Record<string, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-base tracking-wide",
};

const base =
  "inline-flex items-center justify-center rounded transition-all duration-200 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 " +
  "disabled:opacity-50 disabled:cursor-not-allowed";

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

  if (href) {
    return (
      <Link href={href} className={classes} onClick={onClick} target={target} rel={rel}>
        {children}
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
      {children}
    </button>
  );
}
