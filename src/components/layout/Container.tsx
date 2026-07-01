import { ReactNode } from "react";

type ContainerSize = "default" | "narrow";

interface ContainerProps {
  children: ReactNode;
  size?: ContainerSize;
  className?: string;
}

const sizeClasses: Record<ContainerSize, string> = {
  // No max-width — padding alone controls breathing room.
  // At 375px: 20px/side | 768px: 32px/side | 1280px: 48px/side | 1920px: 64px/side
  default: "px-5 sm:px-8 lg:px-12 xl:px-16 2xl:px-20",

  // Constrained max-width for text-heavy narrow content (future use).
  narrow: "max-w-3xl px-5 sm:px-8",
};

export default function Container({
  children,
  size = "default",
  className = "",
}: ContainerProps) {
  return (
    <div className={`mx-auto w-full ${sizeClasses[size]} ${className}`}>
      {children}
    </div>
  );
}
