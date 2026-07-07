import type { Metadata } from "next";
import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";
import Container from "@/src/components/layout/Container";
import Button from "@/src/components/ui/Button";
import PageHeader from "@/src/components/ui/PageHeader";
import SocialIcon from "@/src/components/ui/SocialIcon";
import LocationVisit from "@/src/components/sections/LocationVisit";
import InquiryForm from "@/src/components/forms/InquiryForm";
import { contactInfo } from "@/src/data/contact";
import { getSiteSetting } from "@/src/lib/db/site-settings";
import { absoluteUrl } from "@/src/lib/seo";
import type { ContactInfo } from "@/src/types/site";

export const metadata: Metadata = {
  title: "Book a Photography Session",
  description:
    "Book a photography session with SomStudioPhotography in Kathmandu, Nepal. Contact us for weddings, portraits, events, product photography, and more.",
  alternates: {
    canonical: absoluteUrl("/contact"),
  },
};

function isContactInfo(value: unknown): value is ContactInfo {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.phone === "string" &&
    typeof candidate.whatsapp === "string" &&
    typeof candidate.email === "string" &&
    typeof candidate.address === "string" &&
    typeof candidate.city === "string" &&
    typeof candidate.country === "string" &&
    Array.isArray(candidate.socialLinks) &&
    Array.isArray(candidate.businessHours)
  );
}

async function getContactInfo() {
  const setting = await getSiteSetting("contact.info");

  if (!setting) {
    return contactInfo;
  }

  try {
    const parsed = JSON.parse(setting.value) as unknown;

    return isContactInfo(parsed) ? parsed : contactInfo;
  } catch {
    return contactInfo;
  }
}

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
      <p className="mb-1 text-xs uppercase tracking-[0.15em] text-brand">
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

export default async function ContactPage() {
  const contact = await getContactInfo();
  const contactWhatsappUrl = `https://wa.me/${contact.whatsapp.replace("+", "")}`;

  return (
    <>
      <Navbar />

      <PageHeader
        eyebrow="Contact"
        title="Book a photography session"
        subtitle="Tell us what you need and we will guide you with the right package, timing, and plan."
        animated={false}
      />

      <section className="border-t border-neutral-200 bg-neutral-50">
        <Container>
          <div className="pt-20 sm:pt-28">
            <p className="mx-auto max-w-2xl text-center text-base leading-relaxed text-neutral-600">
              Whether you already have a date in mind or you&rsquo;re still
              exploring options, reaching out costs nothing and commits you
              to nothing. Send a message or call us directly &mdash;
              we&rsquo;ll ask a few quick questions about your shoot, confirm
              availability, and walk you through pricing and next steps.
            </p>
          </div>
          <div className="grid grid-cols-1 items-start gap-14 pb-20 pt-14 sm:pb-28 sm:pt-16 lg:grid-cols-2 lg:gap-20">
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
                <p className="mb-3 text-xs uppercase tracking-[0.15em] text-brand">
                  Studio Hours
                </p>
                <div className="space-y-1.5">
                  {contact.businessHours.map((slot) => (
                    <p key={slot.days} className="text-sm text-neutral-500">
                      <span className="text-neutral-600">{slot.days}</span>
                      {" - "}
                      {slot.hours}
                    </p>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <Button href={contactWhatsappUrl} variant="secondary" size="md">
                  Chat on WhatsApp: {contact.whatsapp}
                </Button>
                <Button href="#studio-location" variant="ghost" size="md">
                  View Location
                </Button>
              </div>

              <div className="mt-8">
                <p className="mb-3 text-xs uppercase tracking-[0.15em] text-brand">
                  Follow Us
                </p>
                <div className="flex flex-wrap gap-4">
                  {contact.socialLinks.map((social) => (
                    <a
                      key={social.platform}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition-colors hover:border-gold hover:text-gold"
                      aria-label={`${social.label} - opens in new tab`}
                      title={social.label}
                    >
                      <SocialIcon platform={social.platform} className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>

              <p className="mt-8 max-w-sm text-xs leading-relaxed text-neutral-400">
                We typically respond within a few hours during studio hours.
                All inquiries are handled personally.
              </p>
            </div>

            <div className="rounded border border-neutral-200 bg-neutral-50 p-6 sm:p-8">
              <p className="mb-6 text-sm font-semibold text-neutral-950">
                Send an inquiry
              </p>
              <InquiryForm idPrefix="page-contact" />
            </div>
          </div>
        </Container>
      </section>

      <div id="studio-location">
        <LocationVisit />
      </div>

      <section className="border-t border-neutral-200 bg-neutral-50">
        <Container>
          <div className="py-14 sm:py-16">
            <p className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.2em] text-brand">
              After your inquiry
            </p>
            <div className="grid grid-cols-1 gap-6 text-center sm:grid-cols-3">
              {[
                {
                  step: "01",
                  text: "We review your inquiry and check availability for your preferred date.",
                },
              {
                step: "02",
                  text: `We reach back via phone or WhatsApp (${contact.whatsapp}) to discuss details and confirm a plan.`,
                },
                {
                  step: "03",
                  text: "Once everything is agreed, your session is confirmed and we prepare for the shoot.",
                },
              ].map((item) => (
                <div key={item.step} className="flex flex-col items-center gap-3">
                  <span className="text-2xl font-bold text-neutral-200">
                    {item.step}
                  </span>
                  <p className="max-w-xs text-sm leading-relaxed text-neutral-500">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <Footer />
    </>
  );
}
