import Container from "@/src/components/layout/Container";
import SectionHeader from "@/src/components/ui/SectionHeader";
import { processSteps } from "@/src/data/process";

export default function Process() {
  return (
    <section id="process" className="bg-white border-t border-neutral-200">
      <Container>
        <div className="py-20 sm:py-28">
          <SectionHeader
            eyebrow="How It Works"
            title="A simple, guided process from start to finish."
            subtitle="No confusion, no surprises - just clear steps from your first message to your final gallery."
            centered={true}
            className="mb-16 sm:mb-20"
          />

          <ol className="relative grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
            <div
              aria-hidden="true"
              className="absolute left-0 right-0 top-5 hidden border-t border-neutral-200 lg:block"
            />

            {processSteps.map((step) => (
              <li key={step.step} className="relative flex flex-col gap-5">
                <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 bg-white text-sm font-bold text-gold">
                  {step.step}
                </div>

                <div aria-hidden="true" className="-mt-2 h-px w-5 bg-gold/60" />

                <div>
                  <h3 className="mb-2 font-semibold text-neutral-950">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-neutral-600">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <p className="mt-16 text-center text-sm text-neutral-400 sm:mt-20">
            From first message to final delivery, we keep the experience simple
            and professional.
          </p>
        </div>
      </Container>
    </section>
  );
}
