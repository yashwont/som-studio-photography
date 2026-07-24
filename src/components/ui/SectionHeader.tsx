interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  size?: "default" | "sm";
  className?: string;
}

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  centered = true,
  size = "default",
  className = "",
}: SectionHeaderProps) {
  const align = centered ? "text-center" : "text-left";
  const titleSize =
    size === "sm" ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl";
  const subtitleSize = size === "sm" ? "text-base" : "text-lg";

  return (
    <div className={`${align} ${className}`}>
      {eyebrow && (
        <p
          className={`mb-3 flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-gold sm:tracking-[0.2em] ${
            centered ? "justify-center" : ""
          }`}
        >
          <span aria-hidden="true" className="accent-rule h-px w-6" />
          {eyebrow}
        </p>
      )}
      <h2
        className={`break-words font-serif font-semibold tracking-tight text-neutral-950 ${titleSize}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 text-neutral-900 ${subtitleSize} ${
            centered ? "max-w-2xl mx-auto" : "max-w-2xl"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
