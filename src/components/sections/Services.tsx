import Container from "@/src/components/layout/Container";
import SectionHeader from "@/src/components/ui/SectionHeader";

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

const reviews = [
  {
    quote:
      "Absolutely stunning photos, so professional and easy to work with. They made the whole session feel effortless.",
    name: "Priya S.",
    context: "Wedding Session",
    rating: 5,
  },
  {
    quote:
      "Best studio in Kathmandu, hands down. The team made us feel so comfortable the entire time.",
    name: "Rajesh T.",
    context: "Family Portraits",
    rating: 5,
  },
  {
    quote:
      "From the first consultation to the final gallery, everything felt effortless. Highly recommend.",
    name: "Anisha K.",
    context: "Maternity Session",
    rating: 5,
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div
      aria-label={`${rating} out of 5 stars`}
      className="text-sm tracking-widest text-gold"
    >
      {"★".repeat(rating)}
      <span className="text-neutral-300">{"★".repeat(5 - rating)}</span>
    </div>
  );
}

function ReviewCard({ review }: { review: (typeof reviews)[number] }) {
  return (
    <div className="rounded border border-neutral-200 bg-neutral-50 p-6">
      <StarRating rating={review.rating} />
      <p className="mt-4 text-sm leading-relaxed text-neutral-900">
        &ldquo;{review.quote}&rdquo;
      </p>
      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.15em] text-neutral-950">
        {review.name}
      </p>
      <p className="text-xs text-neutral-500">{review.context}</p>
    </div>
  );
}

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

          <div className="mt-16 border-t border-neutral-200 pt-12">
            <div className="mb-10 text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-900">
                Client reviews
              </p>
              <h3 className="text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl">
                What clients are saying
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              {reviews.map((review) => (
                <ReviewCard key={review.name} review={review} />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
