import type { Metadata } from "next";
import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";
import Container from "@/src/components/layout/Container";
import Button from "@/src/components/ui/Button";
import PageHeader from "@/src/components/ui/PageHeader";
import ScrollReveal from "@/src/components/ui/ScrollReveal";
import { getActiveServices } from "@/src/lib/db/services";
import { absoluteUrl } from "@/src/lib/seo";

export const metadata: Metadata = {
  title: "Photography Services",
  description:
    "Photography services in Kathmandu, Nepal: newborn, kids, maternity, family, graduation, portraits, weddings, pre-weddings, events, and product photography.",
  alternates: {
    canonical: absoluteUrl("/services"),
  },
};

type ServiceWithPackages = Awaited<ReturnType<typeof getActiveServices>>[number];

function formatPrice(service: ServiceWithPackages) {
  const packagePrice = service.packages[0]?.price;

  if (!packagePrice) {
    return "Contact for pricing";
  }

  return `NRS ${packagePrice.toNumber().toLocaleString("en-US")}`;
}

function ServiceCard({ service }: { service: ServiceWithPackages }) {
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

      <p className="mb-6 flex-1 text-sm leading-relaxed text-neutral-900">
        {service.shortDescription}
      </p>

      <ul className="space-y-2 border-t border-neutral-200 pt-5">
        {service.highlights.map((highlight: string) => (
          <li
            key={highlight}
            className="flex items-start gap-2 text-xs text-neutral-900"
          >
            <span aria-hidden="true" className="mt-px shrink-0 text-gold/50">
              -
            </span>
            {highlight}
          </li>
        ))}
      </ul>

      <div className="mt-auto flex items-center justify-between gap-4 border-t border-neutral-200 pt-5">
        <p className="text-sm font-semibold text-gold">{formatPrice(service)}</p>
        <Button href={`/contact?service=${service.id}`} variant="secondary" size="sm">
          Book Now
        </Button>
      </div>
    </div>
  );
}

function EmptyServicesFallback() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-5 rounded border border-neutral-200 bg-white px-6 py-10 text-center">
      <p className="text-base leading-relaxed text-neutral-900">
        Services are being updated. Please contact us for current packages.
      </p>
      <Button href="/contact" variant="primary" size="md">
        Contact Us
      </Button>
    </div>
  );
}

export default async function ServicesPage() {
  const services = await getActiveServices();

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
            <p className="mx-auto mb-14 max-w-2xl text-center text-base leading-relaxed text-neutral-900 sm:mb-16">
              Every package below follows the same planning conversation,
              on-site guidance, and editing standard, regardless of session
              type or size. Whether you need a single portrait sitting or full
              wedding day coverage, you get the same attention to detail and
              a clear plan before the camera comes out.
            </p>
            {services.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {services.map((service: ServiceWithPackages) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            ) : (
              <EmptyServicesFallback />
            )}
          </div>
        </Container>
        </section>
      </ScrollReveal>

      <ScrollReveal variant="fade">
        <section className="bg-neutral-50 border-t border-neutral-200">
        <Container>
          <div className="flex flex-col items-center gap-6 py-16 text-center sm:py-20">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-900">
              Not sure which service fits?
            </p>
            <h2 className="text-2xl font-bold text-neutral-950 sm:text-3xl">
              Let us help you decide.
            </h2>
            <p className="max-w-md text-neutral-900">
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
