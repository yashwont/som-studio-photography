import Link from "next/link";
import Container from "@/src/components/layout/Container";
import { contactInfo } from "@/src/data/contact";

const proofItems = [
  {
    value: "10+",
    label: "Shoot types",
    detail:
      "New born, kids, maternity, family, graduation, portraits, weddings, events, and products.",
  },
  {
    value: "KTM",
    label: "Studio base",
    detail: `${contactInfo.address}, ${contactInfo.city}, with location sessions across the valley.`,
  },
  {
    value: "5",
    label: "Simple steps",
    detail:
      "Inquiry, planning, booking, photoshoot, and polished gallery delivery.",
  },
];

export default function HomeProof() {
  return (
    <section className="border-y border-neutral-200 bg-neutral-50">
      <Container>
        <div className="grid grid-cols-1 gap-0 py-4 sm:grid-cols-3 sm:divide-x sm:divide-neutral-200">
          {proofItems.map((item, index) => (
            <div
              key={item.label}
              className={`home-proof-item home-proof-item-${index} py-6 sm:px-8 first:sm:pl-0 last:sm:pr-0`}
            >
              <div className="mb-3 flex items-baseline gap-3">
                <span className="text-3xl font-bold tracking-tight text-neutral-950">
                  {item.value}
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
                  {item.label}
                </span>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-neutral-600">
                {item.detail}
              </p>
            </div>
          ))}
        </div>

        <div className="home-proof-cta border-t border-neutral-200 py-5 text-sm text-neutral-600">
          Need a date checked first?{" "}
          <Link
            href="/contact"
            className="font-semibold text-neutral-950 underline underline-offset-4"
          >
            Send an inquiry
          </Link>{" "}
          and we will guide you with the right package and timing.
        </div>
      </Container>
    </section>
  );
}
