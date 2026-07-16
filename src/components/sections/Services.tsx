import Container from "@/src/components/layout/Container";
import SectionHeader from "@/src/components/ui/SectionHeader";
import type { HomeContentData, HomeReview, HomeServiceCard } from "@/src/lib/db/home";

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

function ReviewCard({ review }: { review: HomeReview }) {
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
  service: HomeServiceCard;
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

export default function Services({ content }: { content: HomeContentData }) {
  return (
    <section id="services" className="bg-neutral-50 border-t border-neutral-200">
      <Container>
        <div className="py-20 sm:py-28">
          <SectionHeader
            eyebrow={content.servicesEyebrow}
            title={content.servicesTitle}
            subtitle={content.servicesSubtitle}
            centered={true}
            className="mb-14 sm:mb-16"
          />

          <div className="service-grid grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {content.serviceCards.map((service, index) => (
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
                {content.reviewsEyebrow}
              </p>
              <h3 className="text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl">
                {content.reviewsTitle}
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              {content.reviews.map((review) => (
                <ReviewCard key={review.name} review={review} />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
