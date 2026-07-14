import Container from "@/src/components/layout/Container";
import ScrollReveal from "@/src/components/ui/ScrollReveal";
import Button from "@/src/components/ui/Button";

export default function PortfolioBookingCTA({
  categoryName,
  workTitle,
  serviceId,
  eyebrow,
  heading,
  body,
  primaryLabel,
  secondaryLabel,
}: {
  categoryName: string;
  workTitle: string;
  serviceId?: string;
  eyebrow?: string;
  heading?: string;
  body?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
}) {
  const bookParams = new URLSearchParams({ portfolio: workTitle });
  if (serviceId) {
    bookParams.set("service", serviceId);
  }
  const questionParams = new URLSearchParams({ portfolio: workTitle });

  return (
    <ScrollReveal variant="fade">
      <section className="border-t border-neutral-200 bg-neutral-50">
        <Container>
          <div className="flex flex-col items-center gap-6 py-16 text-center sm:py-20">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-900">
              {eyebrow ?? `Planning a ${categoryName} Session?`}
            </p>
            <h2 className="max-w-xl text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl">
              {heading ??
                `Let's create portraits you'll treasure from your ${categoryName.toLowerCase()} session.`}
            </h2>
            {body && (
              <p className="max-w-xl text-base leading-relaxed text-neutral-900">
                {body}
              </p>
            )}
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                href={`/contact?${bookParams.toString()}`}
                variant="primary"
                size="lg"
              >
                {primaryLabel ?? `Book a ${categoryName} Session`}
              </Button>
              <Button
                href={`/contact?${questionParams.toString()}`}
                variant="secondary"
                size="lg"
              >
                {secondaryLabel ?? "Ask a Question"}
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </ScrollReveal>
  );
}
