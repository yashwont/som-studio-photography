interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  centered = true,
  className = "",
}: SectionHeaderProps) {
  const align = centered ? "text-center" : "text-left";

  return (
    <div className={`${align} ${className}`}>
      {eyebrow && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-brand sm:tracking-[0.2em]">
          {eyebrow}
        </p>
      )}
      <h2 className="break-words text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 text-neutral-600 text-lg ${
            centered ? "max-w-2xl mx-auto" : "max-w-2xl"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
