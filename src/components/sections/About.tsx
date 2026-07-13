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
              eyebrow="Studio overview"
              title="About SomStudioPhotography"
              centered={false}
            />

            <p className="mt-6 max-w-lg text-base leading-relaxed text-neutral-900">
              With over 30 years of experience since 1995, we are passionate
              about capturing life&rsquo;s most meaningful moments. Combining
              creativity with modern photography technology, we deliver
              high-quality images and a friendly, professional experience.
              From portraits and events to custom prints and albums,
              we&rsquo;re here to turn your special moments into lasting
              memories.
            </p>

            <div className="mt-8 flex items-center gap-3">
              <div aria-hidden="true" className="h-px w-8 shrink-0 bg-gold" />
              <span className="text-xs uppercase tracking-[0.2em] text-neutral-900">
                Kathmandu, Nepal
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {highlights.map((item: { title: string; description: string }) => (
              <div
                key={item.title}
                className="group rounded border border-neutral-200 bg-neutral-50 p-6 transition-colors hover:border-neutral-300"
              >
                <div aria-hidden="true" className="mb-5 h-px w-6 bg-gold" />

                <h3 className="mb-2 text-sm font-semibold text-neutral-950">
                  {item.title}
                </h3>

                <p className="text-sm leading-relaxed text-neutral-900">
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
