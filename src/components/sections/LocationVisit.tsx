import Container from "@/src/components/layout/Container";
import Button from "@/src/components/ui/Button";
import type { ContactInfo } from "@/src/types/site";

export default function LocationVisit({ contact: contactInfo }: { contact: ContactInfo }) {
  const whatsappUrl = `https://wa.me/${contactInfo.whatsapp.replace("+", "")}`;

  return (
    <section className="border-t border-neutral-200 bg-neutral-50">
      <Container>
        <div className="grid grid-cols-1 gap-8 py-16 sm:py-20 lg:grid-cols-[1fr_0.8fr] lg:items-stretch">
          <div className="rounded border border-neutral-200 bg-neutral-50 p-6 sm:p-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-900">
              Studio location
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl">
              Visit our Kathmandu studio
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-900">
              Based in {contactInfo.address}, {contactInfo.city}. Sessions can
              be planned in-studio or on location depending on the story,
              lighting, and final image style you want.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <p className="mb-1 text-xs uppercase tracking-[0.15em] text-neutral-900">
                  Get in Touch
                </p>
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="block text-sm font-medium text-neutral-950"
                >
                  {contactInfo.phone}
                </a>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="mt-1 block break-all text-sm font-medium text-neutral-950"
                >
                  {contactInfo.email}
                </a>
              </div>
              <div>
                <p className="mb-1 text-xs uppercase tracking-[0.15em] text-neutral-900">
                  Studio Hours
                </p>
                {contactInfo.businessHours.map((slot) => (
                  <p key={slot.days} className="text-sm font-medium text-neutral-950">
                    {slot.days} - {slot.hours}
                  </p>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button href={contactInfo.mapUrl} variant="primary" size="md">
                Open Map
              </Button>
              <Button href={whatsappUrl} variant="primary" size="md">
                Chat on WhatsApp
              </Button>
            </div>
          </div>

          <div className="relative min-h-72 overflow-hidden rounded border border-neutral-200 bg-neutral-50">
            <iframe
              src={contactInfo.mapEmbedUrl}
              title={`Map showing ${contactInfo.address}, ${contactInfo.city}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="h-full min-h-72 w-full border-0"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
