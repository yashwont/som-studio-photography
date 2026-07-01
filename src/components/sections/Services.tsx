import Container from "@/src/components/layout/Container";
import SectionHeader from "@/src/components/ui/SectionHeader";
import Button from "@/src/components/ui/Button";
import { services } from "@/src/data/services";
import type { Service } from "@/src/types/site";

function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="group flex flex-col rounded border border-zinc-800 bg-zinc-900 p-6 transition-colors duration-200 hover:border-zinc-700">
      {/* Gold accent line — widens on card hover */}
      <div
        aria-hidden="true"
        className="mb-5 h-px w-6 bg-gold transition-all duration-300 group-hover:w-10"
      />

      <h3 className="mb-3 font-semibold text-white">{service.title}</h3>

      {/* Description grows to fill card height, pushing highlights to bottom */}
      <p className="flex-1 text-sm leading-relaxed text-zinc-400">
        {service.description}
      </p>

      {/* First two highlights — subtle supporting detail */}
      <ul aria-label={`${service.title} highlights`} className="mt-5 space-y-1.5">
        {service.highlights.slice(0, 2).map((highlight) => (
          <li key={highlight} className="flex items-start gap-2 text-xs text-zinc-600">
            <span aria-hidden="true" className="mt-px shrink-0 text-gold/50">
              —
            </span>
            {highlight}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Services() {
  return (
    <section id="services" className="bg-black border-t border-white/5">
      <Container>
        <div className="py-20 sm:py-28">

          <SectionHeader
            eyebrow="What We Offer"
            title="Photography services for every moment."
            subtitle="From intimate weddings to passport photos, studio portraits to product shoots — we cover it all from our studio in Kathmandu."
            centered={true}
            className="mb-14 sm:mb-16"
          />

          {/* Service card grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 flex flex-col items-center gap-5 border-t border-white/5 pt-12 text-center">
            <p className="text-zinc-400 text-sm sm:text-base">
              Not sure which package fits your shoot?
            </p>
            <Button href="/contact" variant="secondary" size="md">
              Ask for Guidance
            </Button>
          </div>

        </div>
      </Container>
    </section>
  );
}
