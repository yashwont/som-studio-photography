import Container from "@/src/components/layout/Container";
import SectionHeader from "@/src/components/ui/SectionHeader";
import { processSteps } from "@/src/data/process";

export default function Process() {
  return (
    <section id="process" className="bg-black border-t border-white/5">
      <Container>
        <div className="py-20 sm:py-28">

          <SectionHeader
            eyebrow="How It Works"
            title="A simple, guided process from start to finish."
            subtitle="No confusion, no surprises — just clear steps from your first message to your final gallery."
            centered={true}
            className="mb-16 sm:mb-20"
          />

          {/* Step list — semantic ordered list */}
          <ol className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6">

            {/* Horizontal connector line — desktop only, sits behind step circles */}
            <div
              aria-hidden="true"
              className="absolute left-0 right-0 top-5 hidden border-t border-zinc-800 lg:block"
            />

            {processSteps.map((step) => (
              <li key={step.step} className="relative flex flex-col gap-5">

                {/* Step number circle — z-10 so it sits above the connector line */}
                <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-zinc-700 bg-black text-sm font-bold text-gold">
                  {step.step}
                </div>

                {/* Gold accent line below circle */}
                <div
                  aria-hidden="true"
                  className="-mt-2 h-px w-5 bg-gold/60"
                />

                <div>
                  <h3 className="mb-2 font-semibold text-white">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-zinc-400">
                    {step.description}
                  </p>
                </div>

              </li>
            ))}

          </ol>

          {/* Closing line */}
          <p className="mt-16 text-center text-sm text-zinc-600 sm:mt-20">
            From first message to final delivery, we keep the experience simple and professional.
          </p>

        </div>
      </Container>
    </section>
  );
}
