import Container from "@/src/components/layout/Container";
import SectionHeader from "@/src/components/ui/SectionHeader";
import Button from "@/src/components/ui/Button";
import InquiryForm from "@/src/components/forms/InquiryForm";
import { contactInfo } from "@/src/data/contact";

function ContactDetail({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div>
      <p className="mb-1 text-xs uppercase tracking-[0.15em] text-neutral-400">
        {label}
      </p>
      <div className="flex items-center gap-2">
        <div aria-hidden="true" className="h-px w-4 shrink-0 bg-gold/50" />
        {href ? (
          <a
            href={href}
            className="text-sm text-neutral-700 transition-colors hover:text-neutral-950"
          >
            {value}
          </a>
        ) : (
          <p className="text-sm text-neutral-700">{value}</p>
        )}
      </div>
    </div>
  );
}

export default function Contact() {
  const whatsappUrl = `https://wa.me/${contactInfo.whatsapp.replace("+", "")}`;

  return (
    <section id="contact" className="border-t border-neutral-200 bg-neutral-50">
      <Container>
        <div className="grid grid-cols-1 items-start gap-14 py-20 sm:py-28 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeader
              eyebrow="Book a Session"
              title="Let's plan your next photoshoot."
              centered={false}
            />

            <p className="mt-6 max-w-lg text-base leading-relaxed text-neutral-600">
              Tell us what you need and we will guide you with the right
              package, timing, and shoot plan.
            </p>

            <div className="mt-10 space-y-6">
              <ContactDetail
                label="Studio Location"
                value={`${contactInfo.address}, ${contactInfo.city}, ${contactInfo.country}`}
              />
              <ContactDetail
                label="Phone"
                value={contactInfo.phone}
                href={`tel:${contactInfo.phone}`}
              />
              <ContactDetail
                label="Email"
                value={contactInfo.email}
                href={`mailto:${contactInfo.email}`}
              />
              <ContactDetail
                label="WhatsApp"
                value={contactInfo.whatsapp}
                href={whatsappUrl}
              />
            </div>

            <div className="mt-8">
              <p className="mb-3 text-xs uppercase tracking-[0.15em] text-neutral-400">
                Studio Hours
              </p>
              <div className="space-y-1.5">
                {contactInfo.businessHours.map((slot) => (
                  <p key={slot.days} className="text-sm text-neutral-500">
                    <span className="text-neutral-600">{slot.days}</span>
                    {" - "}
                    {slot.hours}
                  </p>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <Button href={whatsappUrl} variant="secondary" size="md">
                Chat on WhatsApp: {contactInfo.whatsapp}
              </Button>
            </div>

            <p className="mt-8 max-w-xs text-xs leading-relaxed text-neutral-400">
              We typically respond within a few hours during studio hours. All
              inquiries are handled personally.
            </p>
          </div>

          <div className="rounded border border-neutral-200 bg-neutral-50 p-6 sm:p-8">
            <p className="mb-6 text-sm font-semibold text-neutral-950">
              Send an Inquiry
            </p>
            <InquiryForm idPrefix="contact" />
          </div>
        </div>
      </Container>
    </section>
  );
}
