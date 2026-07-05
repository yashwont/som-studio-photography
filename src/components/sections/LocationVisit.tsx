import Container from "@/src/components/layout/Container";
import Button from "@/src/components/ui/Button";
import { contactInfo } from "@/src/data/contact";

export default function LocationVisit() {
  const whatsappUrl = `https://wa.me/${contactInfo.whatsapp.replace("+", "")}`;

  return (
    <section className="border-t border-neutral-200 bg-neutral-50">
      <Container>
        <div className="grid grid-cols-1 gap-8 py-16 sm:py-20 lg:grid-cols-[1fr_0.8fr] lg:items-stretch">
          <div className="rounded border border-neutral-200 bg-white p-6 sm:p-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Visit the studio
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl">
              Based in {contactInfo.address}, {contactInfo.city}.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600">
              Sessions can be planned in-studio or on location depending on the
              story, lighting, and final image style you want.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="mb-1 text-xs uppercase tracking-[0.15em] text-neutral-400">
                  Phone
                </p>
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="text-sm font-medium text-neutral-950"
                >
                  {contactInfo.phone}
                </a>
              </div>
              <div>
                <p className="mb-1 text-xs uppercase tracking-[0.15em] text-neutral-400">
                  Email
                </p>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="break-all text-sm font-medium text-neutral-950"
                >
                  {contactInfo.email}
                </a>
              </div>
              <div>
                <p className="mb-1 text-xs uppercase tracking-[0.15em] text-neutral-400">
                  Hours
                </p>
                <p className="text-sm font-medium text-neutral-950">
                  {contactInfo.businessHours[0]?.hours}
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs uppercase tracking-[0.15em] text-neutral-400">
                  WhatsApp
                </p>
                <a
                  href={whatsappUrl}
                  className="text-sm font-medium text-neutral-950"
                >
                  {contactInfo.whatsapp}
                </a>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button href={contactInfo.mapUrl} variant="primary" size="md">
                Open Map
              </Button>
              <Button href={whatsappUrl} variant="secondary" size="md">
                Chat on WhatsApp: {contactInfo.whatsapp}
              </Button>
            </div>
          </div>

          <div className="relative min-h-72 overflow-hidden rounded border border-neutral-200 bg-white p-6 sm:p-8">
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-[0.45]"
              style={{
                backgroundImage:
                  "linear-gradient(#e5e5e5 1px, transparent 1px), linear-gradient(90deg, #e5e5e5 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />
            <div className="relative flex h-full min-h-60 flex-col justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                  Map preview
                </p>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-neutral-600">
                  Use the map link for directions to the studio location.
                </p>
              </div>
              <div className="mt-10 max-w-sm rounded border border-neutral-200 bg-white/90 p-5">
                <p className="text-lg font-semibold text-neutral-950">
                  {contactInfo.address}
                </p>
                <p className="mt-1 text-sm text-neutral-600">
                  {contactInfo.city}, {contactInfo.country}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
