import type { Metadata } from "next";
import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";
import Container from "@/src/components/layout/Container";
import Button from "@/src/components/ui/Button";
import ScrollReveal from "@/src/components/ui/ScrollReveal";
import { getActiveServices } from "@/src/lib/db/services";
import { absoluteUrl } from "@/src/lib/seo";

export const metadata: Metadata = {
  title: "Photography Services in Kathmandu, Nepal",
  description:
    "SomStudioPhotography's session menu in Kathmandu, Nepal: wedding, pre-wedding, and event photography, studio portraits, maternity and graduation shoots, kids photography, product photography, passport photos, and printing & framing.",
  alternates: {
    canonical: absoluteUrl("/services"),
  },
};

type ServiceWithPackages = Awaited<ReturnType<typeof getActiveServices>>[number];
type ServicePackage = ServiceWithPackages["packages"][number];

const faqs = [
  {
    question: "How do I book a session?",
    answer:
      "Send an inquiry from any “Book Now” button or the contact page. We'll confirm availability and walk you through pricing and next steps.",
  },
  {
    question: "Can packages be customized?",
    answer:
      "Yes. Every package can be adjusted for coverage hours, deliverables, or add-ons based on your specific session.",
  },
  {
    question: "Do you provide edited digital photos?",
    answer:
      "Yes. Every session includes a professionally edited digital gallery, delivered through a private online link.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Most sessions are delivered within 7 to 14 business days, depending on the package and season.",
  },
  {
    question: "Do you offer printing and framing?",
    answer:
      "Yes. We offer professional prints and framing so your favorite images can be displayed, not just stored.",
  },
];

function formatPackagePrice(price: ServicePackage["price"]) {
  if (!price) {
    return "Contact for pricing";
  }

  return `NRS ${price.toNumber().toLocaleString("en-US")}`;
}

function ServiceHighlights({ highlights }: { highlights: string[] }) {
  if (highlights.length === 0) {
    return null;
  }

  return (
    <ul className="mt-6 flex flex-wrap gap-2">
      {highlights.map((highlight: string) => (
        <li
          key={highlight}
          className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs text-neutral-900"
        >
          {highlight}
        </li>
      ))}
    </ul>
  );
}

function SessionIncludes({ service }: { service: ServiceWithPackages }) {
  if (service.packages.length === 0) {
    return (
      <div className="rounded border border-neutral-200 bg-neutral-50 p-6 sm:p-8">
        <p className="mb-2 text-sm font-semibold text-neutral-950">
          Custom quote available
        </p>
        <p className="mb-6 text-sm leading-relaxed text-neutral-900">
          Pricing depends on your specific requirements. Tell us what you need
          and we&rsquo;ll send a tailored quote.
        </p>
        <Button href={`/contact?service=${service.id}`} variant="primary" size="sm">
          Request a Quote
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded border border-neutral-200 bg-neutral-50 p-6 sm:p-8">
      <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
        Session includes
      </p>

      <div className="space-y-5">
        {service.packages.map((pkg: ServicePackage) => (
          <div key={pkg.id} className="rounded border border-neutral-200 bg-white p-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-neutral-950">{pkg.name}</p>
              <p className="text-sm font-semibold text-gold">
                {formatPackagePrice(pkg.price)}
              </p>
            </div>
            {pkg.inclusions.length > 0 && (
              <ul className="space-y-1.5">
                {pkg.inclusions.slice(0, 5).map((inclusion: string) => (
                  <li
                    key={inclusion}
                    className="flex items-start gap-2 text-xs text-neutral-900"
                  >
                    <span aria-hidden="true" className="mt-px shrink-0 text-gold/60">
                      -
                    </span>
                    {inclusion}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button href={`/contact?service=${service.id}`} variant="primary" size="sm">
          Book Now
        </Button>
        <Button href="/portfolio" variant="ghost" size="sm">
          View Portfolio
        </Button>
      </div>
    </div>
  );
}

function ServiceBlock({
  service,
  index,
}: {
  service: ServiceWithPackages;
  index: number;
}) {
  const number = String(index + 1).padStart(2, "0");
  const reversed = index % 2 === 1;

  return (
    <ScrollReveal variant={reversed ? "slide-right" : "slide-left"}>
      <section className={`border-t border-neutral-200 ${reversed ? "bg-white" : "bg-neutral-50"}`}>
        <Container>
          <div className="grid grid-cols-1 items-start gap-10 py-16 sm:py-20 lg:grid-cols-2 lg:gap-16">
            <div className={reversed ? "lg:order-2" : undefined}>
              <div className="mb-4 flex items-center gap-4">
                <span
                  aria-hidden="true"
                  className="text-4xl font-bold text-neutral-200 sm:text-5xl"
                >
                  {number}
                </span>
                <div className="h-px flex-1 bg-neutral-200" aria-hidden="true" />
                {service.featured && (
                  <span className="shrink-0 rounded-full border border-gold/30 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-gold">
                    Popular
                  </span>
                )}
              </div>

              <h3 className="text-2xl font-bold text-neutral-950 sm:text-3xl">
                {service.title}
              </h3>

              <p className="mt-4 max-w-xl text-base leading-relaxed text-neutral-900">
                {service.shortDescription}
              </p>

              <ServiceHighlights highlights={service.highlights} />

              <div className="mt-8 flex flex-wrap gap-4">
                <Button href={`/contact?service=${service.id}`} variant="primary" size="md">
                  Book Now
                </Button>
                <Button href="/portfolio" variant="secondary" size="md">
                  View Portfolio
                </Button>
              </div>
            </div>

            <div className={reversed ? "lg:order-1" : undefined}>
              <SessionIncludes service={service} />
            </div>
          </div>
        </Container>
      </section>
    </ScrollReveal>
  );
}

function EmptyServicesFallback() {
  return (
    <section className="border-t border-neutral-200 bg-neutral-50">
      <Container>
        <div className="py-20 sm:py-28">
          <div className="mx-auto flex max-w-xl flex-col items-center gap-5 rounded border border-neutral-200 bg-white px-6 py-10 text-center">
            <p className="text-base leading-relaxed text-neutral-900">
              Services are being updated. Please contact us for current packages.
            </p>
            <Button href="/contact" variant="primary" size="md">
              Contact Us
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default async function ServicesPage() {
  const services = await getActiveServices();

  return (
    <>
      <Navbar />

      <ScrollReveal variant="soft-zoom">
        <section className="border-b border-neutral-200 bg-neutral-50 pt-16 sm:pt-20">
          <Container>
            <div className="py-14 text-center sm:py-20">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-900 sm:tracking-[0.2em]">
                Our Services
              </p>
              <h1 className="break-words text-4xl font-bold tracking-tight text-neutral-950 sm:text-5xl xl:text-6xl">
                Photography Services for Every Moment
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-neutral-900">
                From weddings and portraits to product shoots and professional
                printing, SomStudio helps you preserve every important story
                with care and detail.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button href="/contact" variant="primary" size="lg">
                  Book a Session
                </Button>
                <Button href="/portfolio" variant="secondary" size="lg">
                  View Portfolio
                </Button>
              </div>
            </div>
          </Container>
        </section>
      </ScrollReveal>

      <ScrollReveal variant="fade">
        <section className="border-t border-neutral-200 bg-white">
          <Container size="narrow">
            <div className="py-16 text-center sm:py-20">
              <h2 className="text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">
                Choose your session
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-neutral-900">
                Each service below can be tailored to your needs &mdash; location,
                timing, coverage, and final deliverables all flex around your
                plans. Tell us your vision and we&rsquo;ll help shape the right
                session around it.
              </p>
            </div>
          </Container>
        </section>
      </ScrollReveal>

      {services.length > 0 ? (
        services.map((service: ServiceWithPackages, index: number) => (
          <ServiceBlock key={service.id} service={service} index={index} />
        ))
      ) : (
        <EmptyServicesFallback />
      )}

      <ScrollReveal variant="fade">
        <section className="border-t border-neutral-200 bg-neutral-50">
          <Container size="narrow">
            <div className="py-16 sm:py-20">
              <h2 className="mb-10 text-center text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">
                Before You Book
              </h2>
              <div className="divide-y divide-neutral-200 border-y border-neutral-200">
                {faqs.map((faq: (typeof faqs)[number]) => (
                  <details key={faq.question} className="group py-6">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-neutral-950 marker:content-none">
                      {faq.question}
                      <span
                        aria-hidden="true"
                        className="shrink-0 text-lg font-normal text-gold transition-transform duration-200 group-open:rotate-45"
                      >
                        +
                      </span>
                    </summary>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-900">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </Container>
        </section>
      </ScrollReveal>

      <ScrollReveal variant="fade">
        <section className="border-t border-neutral-200 bg-neutral-50">
          <Container>
            <div className="flex flex-col items-center gap-6 py-16 text-center sm:py-20">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-900">
                Still deciding?
              </p>
              <h2 className="text-2xl font-bold text-neutral-950 sm:text-3xl">
                Need help choosing the right service?
              </h2>
              <p className="max-w-md text-neutral-900">
                Tell us what you&rsquo;re planning and we&rsquo;ll recommend the
                best option.
              </p>
              <Button href="/contact" variant="primary" size="lg">
                Send an Inquiry
              </Button>
            </div>
          </Container>
        </section>
      </ScrollReveal>

      <Footer />
    </>
  );
}
