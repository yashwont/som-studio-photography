import Container from "@/src/components/layout/Container";
import SectionHeader from "@/src/components/ui/SectionHeader";

const highlights = [
  {
    title: "Professional Guidance",
    description:
      "We walk with you from first inquiry to final delivery, offering clear guidance at every step so nothing feels uncertain.",
  },
  {
    title: "Creative Direction",
    description:
      "Every session is planned with intent - locations, lighting, and timing chosen to bring out natural, authentic moments.",
  },
  {
    title: "Polished Editing",
    description:
      "Each image goes through careful selection and refined editing before being delivered in full resolution.",
  },
  {
    title: "Studio & Outdoor",
    description:
      "We shoot in our private studio or on location across Kathmandu - flexible to your vision and comfort.",
  },
];

export default function About() {
  return (
    <section id="about" className="bg-neutral-50 border-t border-neutral-200">
      <Container>
        <div className="grid grid-cols-1 items-start gap-14 py-20 sm:py-28 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeader
              eyebrow="About SomStudioPhotography"
              title="A studio built for meaningful moments and lasting memories."
              centered={false}
            />

            <p className="mt-6 max-w-lg text-base leading-relaxed text-neutral-600">
              SomStudioPhotography is a professional photography studio in
              Kathmandu, Nepal, focused on creating timeless images for people,
              families, events, and brands. From emotional wedding stories to
              newborn, maternity, family, graduation, portrait, and commercial
              product shoots, we combine careful planning, creative direction,
              and polished editing to deliver photographs clients are proud to
              keep, print, and share.
            </p>

            <div className="mt-8 flex items-center gap-3">
              <div aria-hidden="true" className="h-px w-8 shrink-0 bg-gold" />
              <span className="text-xs uppercase tracking-[0.2em] text-neutral-400">
                Kathmandu, Nepal
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {highlights.map((item) => (
              <div
                key={item.title}
                className="group rounded border border-neutral-200 bg-neutral-50 p-6 transition-colors hover:border-neutral-300"
              >
                <div aria-hidden="true" className="mb-5 h-px w-6 bg-gold" />

                <h3 className="mb-2 text-sm font-semibold text-neutral-950">
                  {item.title}
                </h3>

                <p className="text-sm leading-relaxed text-neutral-500">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
