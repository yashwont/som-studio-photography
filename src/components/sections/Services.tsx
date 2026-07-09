import Container from "@/src/components/layout/Container";
import SectionHeader from "@/src/components/ui/SectionHeader";
import Button from "@/src/components/ui/Button";
import type { Service } from "@/src/types/site";

function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="group flex flex-col rounded border border-neutral-200 bg-neutral-50 p-6 transition-colors duration-200 hover:border-neutral-300">
      <div
        aria-hidden="true"
        className="mb-5 h-px w-6 bg-gold transition-all duration-300 group-hover:w-10"
      />

      <h3 className="mb-3 font-semibold text-neutral-950">{service.title}</h3>

      <p className="flex-1 text-sm leading-relaxed text-neutral-600">
        {service.description}
      </p>

      <ul aria-label={`${service.title} highlights`} className="mt-5 space-y-1.5">
        {service.highlights.slice(0, 2).map((highlight: string) => (
          <li
            key={highlight}
            className="flex items-start gap-2 text-xs text-neutral-400"
          >
            <span aria-hidden="true" className="mt-px shrink-0 text-gold/50">
              -
            </span>
            {highlight}
          </li>
        ))}
      </ul>

      <div className="mt-auto flex items-center justify-between gap-4 border-t border-neutral-200 pt-5">
        <p className="text-sm font-semibold text-gold">{service.price}</p>
        <Button href="/contact" variant="secondary" size="sm">
          Book Now
        </Button>
      </div>
    </div>
  );
}

export default function Services({ services }: { services: Service[] }) {
  return (
    <section id="services" className="bg-neutral-50 border-t border-neutral-200">
      <Container>
        <div className="py-20 sm:py-28">
          <SectionHeader
            eyebrow="Services"
            title="Photography services"
            subtitle="New born, kids, maternity, family, graduation, portraits, weddings, pre-weddings, events, and product shoots from our studio in Kathmandu."
            centered={true}
            className="mb-14 sm:mb-16"
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service: Service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>

          <div className="mt-16 flex flex-col items-center gap-5 border-t border-neutral-200 pt-12 text-center">
            <p className="text-sm text-neutral-600 sm:text-base">
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
