import Container from "@/src/components/layout/Container";
import ScrollReveal from "@/src/components/ui/ScrollReveal";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  animated?: boolean;
}

function PageHeaderContent({ eyebrow, title, subtitle }: PageHeaderProps) {
  return (
    <div className="bg-neutral-50 border-b border-neutral-200 pt-16 sm:pt-20">
      <Container>
        <div className="py-14 sm:py-20 text-center">
          {eyebrow && (
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-900 sm:tracking-[0.2em]">
              {eyebrow}
            </p>
          )}
          <h1 className="break-words text-4xl font-bold tracking-tight text-neutral-950 sm:text-5xl xl:text-6xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-neutral-900">
              {subtitle}
            </p>
          )}
        </div>
      </Container>
    </div>
  );
}

export default function PageHeader({
  eyebrow,
  title,
  subtitle,
  animated = true,
}: PageHeaderProps) {
  const content = (
    <PageHeaderContent eyebrow={eyebrow} title={title} subtitle={subtitle} />
  );

  if (!animated) {
    return content;
  }

  return (
    <ScrollReveal variant="soft-zoom">
      {content}
    </ScrollReveal>
  );
}
