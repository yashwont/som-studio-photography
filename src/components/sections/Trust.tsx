import Container from "@/src/components/layout/Container";

const trustItems = [
  {
    title: "Personal planning",
    description:
      "Every inquiry is handled directly, with clear guidance on timing, location, outfits, and the right session plan.",
  },
  {
    title: "Comfortable direction",
    description:
      "You do not need camera experience. We guide posing naturally so portraits feel relaxed and true to you.",
  },
  {
    title: "Prepared studio workflow",
    description:
      "Studio lighting, backdrops, and outdoor plans are prepared before the session so the shoot runs smoothly.",
  },
  {
    title: "Polished delivery",
    description:
      "Final images are carefully selected, edited, and delivered in a shareable gallery with print-ready options.",
  },
];

export default function Trust() {
  return (
    <section className="border-t border-neutral-200 bg-neutral-50">
      <Container>
        <div className="grid grid-cols-1 gap-12 py-20 sm:py-24 lg:grid-cols-[0.8fr_1fr] lg:items-start">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand">
              Why clients choose us
            </p>
            <h2 className="max-w-xl text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">
              Clear planning, calm direction, and images made to last.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {trustItems.map((item) => (
              <div
                key={item.title}
                className="rounded border border-neutral-200 bg-neutral-50 p-6"
              >
                <div aria-hidden="true" className="mb-5 h-px w-6 bg-gold" />
                <h3 className="mb-2 text-sm font-semibold text-neutral-950">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-neutral-600">
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
