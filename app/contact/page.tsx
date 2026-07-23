import type { Metadata } from "next";
import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";
import Container from "@/src/components/layout/Container";
import Button from "@/src/components/ui/Button";
import SocialIcon from "@/src/components/ui/SocialIcon";
import LocationVisit from "@/src/components/sections/LocationVisit";
import InquiryForm from "@/src/components/forms/InquiryForm";
import { getActiveServices } from "@/src/lib/db/services";
import { getContactInfo } from "@/src/lib/db/contact";
import { renderContactTemplate } from "@/src/lib/contact-template";
import { absoluteUrl } from "@/src/lib/seo";
import type { BusinessHours, SocialLink } from "@/src/types/site";

type ActiveService = Awaited<ReturnType<typeof getActiveServices>>[number];

export const metadata: Metadata = {
  title: "Book a Photography Session",
  description:
    "Book a photography session with SomStudioPhotography in Kathmandu, Nepal. Contact us for weddings, portraits, events, product photography, and more.",
  alternates: {
    canonical: absoluteUrl("/contact"),
  },
};

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
      <p className="mb-1 text-xs uppercase tracking-[0.15em] text-neutral-900">
        {label}
      </p>
      <div className="flex items-center gap-2">
        <div aria-hidden="true" className="h-px w-4 shrink-0 bg-gold/50" />
        {href ? (
          <a
            href={href}
            className="text-sm text-neutral-900 transition-colors hover:text-neutral-950"
          >
            {value}
          </a>
        ) : (
          <p className="text-sm text-neutral-900">{value}</p>
        )}
      </div>
    </div>
  );
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const [contact, activeServices] = await Promise.all([
    getContactInfo(),
    getActiveServices(),
  ]);
  const { service: defaultServiceId } = await searchParams;
  const contactWhatsappUrl = `https://wa.me/${contact.whatsapp.replace("+", "")}`;
  const services = activeServices.map((service: ActiveService) => ({
    id: service.id,
    title: service.title,
  }));

  return (
    <>
      <Navbar />

      <div className="border-b border-neutral-200 bg-neutral-50 pt-16 sm:pt-20">
        <Container>
          <div className="py-5 text-center sm:py-6">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-900 sm:tracking-[0.2em]">
              Contact
            </p>
            <h1 className="break-words text-lg font-medium tracking-tight text-neutral-950 sm:text-xl xl:text-2xl">
              Book a photography session
            </h1>
            <p className="mx-auto mt-1.5 max-w-xl text-xs font-semibold leading-relaxed text-neutral-900">
              Whether you already have a date in mind or you&rsquo;re still
              exploring options, reaching out costs nothing and commits you
              to nothing. Send a message or call us directly &mdash;
              we&rsquo;ll ask a few quick questions about your shoot, confirm
              availability, and walk you through pricing and next steps.
            </p>
          </div>
        </Container>
      </div>

      <section className="border-t border-neutral-200 bg-neutral-50">
        <Container>
          <div className="grid grid-cols-1 items-start gap-14 pb-20 pt-10 sm:pb-28 sm:pt-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <h2 className="mb-6 text-xl font-bold text-neutral-950 sm:text-2xl">
                Contact details
              </h2>

              <div className="space-y-6">
                <ContactDetail
                  label="Studio Location"
                  value={`${contact.address}, ${contact.city}, ${contact.country}`}
                />
                <ContactDetail
                  label="Phone"
                  value={contact.phone}
                  href={`tel:${contact.phone}`}
                />
                <ContactDetail
                  label="Email"
                  value={contact.email}
                  href={`mailto:${contact.email}`}
                />
                <ContactDetail
                  label="WhatsApp"
                  value={contact.whatsapp}
                  href={contactWhatsappUrl}
                />
              </div>

              <div className="mt-8">
                <p className="mb-3 text-xs uppercase tracking-[0.15em] text-neutral-900">
                  Studio Hours
                </p>
                <div className="space-y-1.5">
                  {contact.businessHours.map((slot: BusinessHours) => (
                    <p key={slot.days} className="text-sm text-neutral-900">
                      <span className="text-neutral-900">{slot.days}</span>
                      {" - "}
                      {slot.hours}
                    </p>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <Button href={contactWhatsappUrl} variant="primary" size="md">
                  Chat on WhatsApp
                </Button>
                <Button href="#studio-location" variant="secondary" size="md">
                  View Location
                </Button>
              </div>

              <div className="mt-8">
                <p className="mb-3 text-xs uppercase tracking-[0.15em] text-neutral-900">
                  Follow Us
                </p>
                <div className="flex flex-wrap gap-4">
                  {contact.socialLinks.map((social: SocialLink) => (
                    <a
                      key={social.platform}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-900 transition-colors hover:border-gold hover:text-gold"
                      aria-label={`${social.label} - opens in new tab`}
                      title={social.label}
                    >
                      <SocialIcon platform={social.platform} className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>

              <p className="mt-8 max-w-sm text-xs leading-relaxed text-neutral-900">
                We typically respond within a few hours during studio hours.
                All inquiries are handled personally.
              </p>
            </div>

            <div className="rounded border border-neutral-200 bg-neutral-50 p-6 sm:p-8">
              <p className="mb-6 text-sm font-semibold text-neutral-950">
                Send an inquiry
              </p>
              <InquiryForm
                idPrefix="page-contact"
                defaultServiceId={defaultServiceId}
                services={services}
              />
            </div>
          </div>
        </Container>
      </section>

      <div id="studio-location">
        <LocationVisit contact={contact} />
      </div>

      <section className="border-t border-neutral-200 bg-neutral-50">
        <Container>
          <div className="py-8 sm:py-10">
            <p className="mb-5 text-center text-xs font-semibold uppercase tracking-[0.2em] text-neutral-900">
              After your inquiry
            </p>
            <div className="grid grid-cols-1 gap-4 text-center sm:grid-cols-3">
              {contact.afterInquirySteps.map((text, index) => ({
                step: String(index + 1).padStart(2, "0"),
                text: renderContactTemplate(text, contact),
              })).map((item: { step: string; text: string }) => (
                <div key={item.step} className="flex flex-col items-center gap-1.5">
                  <span className="text-lg font-bold text-neutral-200">
                    {item.step}
                  </span>
                  <p className="max-w-[15rem] text-xs font-semibold leading-relaxed text-neutral-900">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <Footer contact={contact} />
    </>
  );
}
