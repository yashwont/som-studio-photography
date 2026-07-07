import type { Metadata } from "next";
import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";
import Container from "@/src/components/layout/Container";
import Button from "@/src/components/ui/Button";
import PageHeader from "@/src/components/ui/PageHeader";
import ScrollReveal from "@/src/components/ui/ScrollReveal";
import { services } from "@/src/data/services";
import type { Service } from "@/src/types/site";
import { absoluteUrl } from "@/src/lib/seo";

export const metadata: Metadata = {
  title: "Photography Services",
  description:
    "Photography services in Kathmandu, Nepal: newborn, kids, maternity, family, graduation, portraits, weddings, pre-weddings, events, and product photography.",
  alternates: {
    canonical: absoluteUrl("/services"),
  },
};

function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="group flex flex-col rounded border border-neutral-200 bg-neutral-50 p-6 transition-colors duration-200 hover:border-neutral-300">
      <div className="mb-4 flex items-start justify-between">
        <div
          aria-hidden="true"
          className="mt-2 h-px w-6 bg-gold transition-all duration-300 group-hover:w-10"
        />
        {service.featured && (
          <span className="rounded-full border border-gold/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-gold">
            Popular
          </span>
        )}
      </div>

      <h2 className="mb-3 text-base font-semibold text-neutral-950">
        {service.title}
      </h2>

      <p className="mb-6 flex-1 text-sm leading-relaxed text-neutral-600">
        {service.description}
      </p>

      <ul className="space-y-2 border-t border-neutral-200 pt-5">
        {service.highlights.map((highlight) => (
          <li
            key={highlight}
            className="flex items-start gap-2 text-xs text-neutral-500"
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
        <Button href={`/book?service=${service.id}`} variant="secondary" size="sm">
          Book Now
        </Button>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <>
      <Navbar />

      <PageHeader
        eyebrow="Services"
        title="Photography services"
        subtitle="From newborn and family portraits to weddings, events, and product shoots, we handle every session from our studio in Kathmandu."
      />

      <ScrollReveal variant="rise">
        <section className="bg-neutral-50 border-t border-neutral-200">
        <Container>
          <div className="py-20 sm:py-28">
            <p className="mx-auto mb-14 max-w-2xl text-center text-base leading-relaxed text-neutral-600 sm:mb-16">
              Every package below follows the same planning conversation,
              on-site guidance, and editing standard, regardless of session
              type or size. Whether you need a single portrait sitting or full
              wedding day coverage, you get the same attention to detail and
              a clear plan before the camera comes out.
            </p>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </div>
        </Container>
        </section>
      </ScrollReveal>

      <ScrollReveal variant="fade">
        <section className="bg-neutral-50 border-t border-neutral-200">
        <Container>
          <div className="flex flex-col items-center gap-6 py-16 text-center sm:py-20">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
              Not sure which service fits?
            </p>
            <h2 className="text-2xl font-bold text-neutral-950 sm:text-3xl">
              Let us help you decide.
            </h2>
            <p className="max-w-md text-neutral-600">
              Tell us about your shoot and we&rsquo;ll recommend the right
              package, timing, and plan.
            </p>
            <Button href="/contact" variant="primary" size="lg">
              Ask for Guidance
            </Button>
          </div>
        </Container>
        </section>
      </ScrollReveal>

      <Footer />
    </>
  );
}
