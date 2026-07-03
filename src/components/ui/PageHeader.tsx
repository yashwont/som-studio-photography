import Container from "@/src/components/layout/Container";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}

export default function PageHeader({ eyebrow, title, subtitle }: PageHeaderProps) {
  return (
    <div className="bg-neutral-50 border-b border-neutral-200 pt-16 sm:pt-20">
      <Container>
        <div className="py-14 sm:py-20 text-center">
          {eyebrow && (
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-gold sm:tracking-[0.2em]">
              {eyebrow}
            </p>
          )}
          <h1 className="break-words text-4xl font-bold tracking-tight text-neutral-950 sm:text-5xl xl:text-6xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-neutral-600">
              {subtitle}
            </p>
          )}
        </div>
      </Container>
    </div>
  );
}
