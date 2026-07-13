import Container from "@/src/components/layout/Container";
import SectionHeader from "@/src/components/ui/SectionHeader";
import Button from "@/src/components/ui/Button";

const services = [
  {
    title: "Maternity",
    tagline: "Celebrating the beauty of new beginnings",
  },
  {
    title: "Newborn",
    tagline: "Tender, delicate moments in the earliest days",
  },
  {
    title: "Family & Child",
    tagline: "Authentic connection, elegantly captured",
  },
  {
    title: "Cake Smash",
    tagline: "Playful milestones with a touch of style",
  },
  {
    title: "Portraits",
    tagline: "Refined imagery that reflects who you are",
  },
  {
    title: "Weddings",
    tagline: "Your love story, artfully documented",
  },
  {
    title: "Commercial",
    tagline: "Polished visuals for brands and businesses",
  },
  {
    title: "Web Profile",
    tagline: "Professional headshots that make a lasting impression",
  },
];

function ServiceCard({
  service,
}: {
  service: (typeof services)[number];
}) {
  return (
    <div className="service-card group flex h-full flex-col rounded border border-neutral-200 bg-neutral-50 p-6">
      <div
        aria-hidden="true"
        className="mb-5 h-px w-6 bg-gold transition-all duration-300 group-hover:w-10"
      />

      <h3 className="mb-2 text-base font-semibold text-neutral-950">
        {service.title}
      </h3>

      <p className="text-sm leading-relaxed text-neutral-900">
        {service.tagline}
      </p>
    </div>
  );
}

export default function Services() {
  return (
    <section id="services" className="bg-neutral-50 border-t border-neutral-200">
      <Container>
        <div className="py-20 sm:py-28">
          <SectionHeader
            eyebrow="Services"
            title="Our Services"
            subtitle="Every story deserves to be told beautifully."
            centered={true}
            className="mb-14 sm:mb-16"
          />

          <div className="service-grid grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, index) => (
              <div
                key={service.title}
                className={
                  index % 4 < 2 ? "service-enter-left" : "service-enter-right"
                }
              >
                <ServiceCard service={service} />
              </div>
            ))}
          </div>

          <div className="mt-16 flex flex-col items-center gap-5 border-t border-neutral-200 pt-12 text-center">
            <p className="text-sm text-neutral-900 sm:text-base">
              Not sure which service is right for you?
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button href="/services" variant="primary" size="md">
                View All Services
              </Button>
              <Button href="/contact" variant="secondary" size="md">
                Ask for Guidance
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
