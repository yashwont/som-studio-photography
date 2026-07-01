import type { Metadata } from "next";
import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";
import Container from "@/src/components/layout/Container";
import Button from "@/src/components/ui/Button";
import PageHeader from "@/src/components/ui/PageHeader";
import { services } from "@/src/data/services";
import type { Service } from "@/src/types/site";

export const metadata: Metadata = {
  title: "Services — SomStudioPhotography",
  description:
    "Photography services in Kathmandu, Nepal: weddings, pre-weddings, events, portraits, maternity, graduation, kids, product photography, passport photos, printing, and framing.",
};

function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="group flex flex-col rounded border border-zinc-800 bg-zinc-900 p-6 transition-colors duration-200 hover:border-zinc-700">
      <div className="flex items-start justify-between mb-4">
        <div
          aria-hidden="true"
          className="h-px w-6 bg-gold mt-2 transition-all duration-300 group-hover:w-10"
        />
        {service.featured && (
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gold border border-gold/30 rounded-full px-2 py-0.5">
            Popular
          </span>
        )}
      </div>

      <h2 className="mb-3 text-base font-semibold text-white">
        {service.title}
      </h2>

      <p className="mb-6 flex-1 text-sm leading-relaxed text-zinc-400">
        {service.description}
      </p>

      {/* All four highlights */}
      <ul className="space-y-2 border-t border-zinc-800 pt-5">
        {service.highlights.map((highlight) => (
          <li
            key={highlight}
            className="flex items-start gap-2 text-xs text-zinc-500"
          >
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

export default function ServicesPage() {
  return (
    <>
      <Navbar />

      <PageHeader
        eyebrow="What We Offer"
        title="Photography services for every moment."
        subtitle="From weddings to passport photos, we handle every type of session from our studio in Kathmandu."
      />

      {/* All services */}
      <section className="bg-black border-t border-white/5">
        <Container>
          <div className="py-20 sm:py-28">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-zinc-950 border-t border-white/5">
        <Container>
          <div className="flex flex-col items-center gap-6 py-16 sm:py-20 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Not sure which service fits?
            </p>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Let us help you decide.
            </h2>
            <p className="max-w-md text-zinc-400">
              Tell us about your shoot and we&rsquo;ll recommend the right
              package, timing, and plan.
            </p>
            <Button href="/contact" variant="primary" size="lg">
              Ask for Guidance
            </Button>
          </div>
        </Container>
      </section>

      <Footer />
    </>
  );
}
