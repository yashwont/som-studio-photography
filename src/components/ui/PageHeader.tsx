import Container from "@/src/components/layout/Container";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}

export default function PageHeader({ eyebrow, title, subtitle }: PageHeaderProps) {
  return (
    <div className="bg-zinc-950 border-b border-white/5 pt-16 sm:pt-20">
      <Container>
        <div className="py-14 sm:py-20 text-center">
          {eyebrow && (
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              {eyebrow}
            </p>
          )}
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl xl:text-6xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-zinc-400">
              {subtitle}
            </p>
          )}
        </div>
      </Container>
    </div>
  );
}
