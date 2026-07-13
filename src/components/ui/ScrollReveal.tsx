import { ReactNode } from "react";

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
}

export default function ScrollReveal({ children }: ScrollRevealProps) {
  return <>{children}</>;
}
