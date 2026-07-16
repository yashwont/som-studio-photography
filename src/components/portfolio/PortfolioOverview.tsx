import Container from "@/src/components/layout/Container";
import ScrollReveal from "@/src/components/ui/ScrollReveal";
import type { PortfolioSessionDetails } from "@/src/types/portfolio";

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-1 text-xs uppercase tracking-[0.15em] text-neutral-900">
        {label}
      </p>
      <div className="flex items-center gap-2">
        <span aria-hidden="true" className="h-px w-4 shrink-0 bg-gold/50" />
        <p className="text-sm text-neutral-900">{value}</p>
      </div>
    </div>
  );
}

export default function PortfolioOverview({
  eyebrow,
  heading,
  paragraphs,
  sessionDetails,
}: {
  eyebrow?: string;
  heading?: string;
  paragraphs: string[];
  sessionDetails?: PortfolioSessionDetails;
}) {
  return (
    <ScrollReveal variant="clip-up">
      <section className="border-t border-neutral-200 bg-white">
        <Container>
          <div className="grid grid-cols-1 gap-10 py-14 sm:py-16 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              {eyebrow && (
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-900">
                  {eyebrow}
                </p>
              )}
              {heading && (
                <h2 className="mb-5 text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl">
                  {heading}
                </h2>
              )}
              <div className="space-y-4">
                {paragraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-base leading-relaxed text-neutral-900"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {sessionDetails && (
              <div className="lg:col-span-5">
                <div className="rounded border border-neutral-200 bg-neutral-50 p-6 sm:p-8">
                  <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-900">
                    Session Details
                  </p>
                  <div className="space-y-5">
                    {sessionDetails.studio && (
                      <DetailRow label="Studio" value={sessionDetails.studio} />
                    )}
                    {sessionDetails.service && (
                      <DetailRow label="Service" value={sessionDetails.service} />
                    )}
                    {sessionDetails.location && (
                      <DetailRow label="Location" value={sessionDetails.location} />
                    )}
                    {sessionDetails.style && (
                      <DetailRow label="Style" value={sessionDetails.style} />
                    )}
                    {sessionDetails.setting && (
                      <DetailRow label="Setting" value={sessionDetails.setting} />
                    )}
                    {sessionDetails.sessionType && (
                      <DetailRow
                        label="Session Type"
                        value={sessionDetails.sessionType}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Container>
      </section>
    </ScrollReveal>
  );
}
