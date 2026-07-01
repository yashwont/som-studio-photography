import type { Metadata } from "next";
import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";
import Container from "@/src/components/layout/Container";
import Button from "@/src/components/ui/Button";
import PageHeader from "@/src/components/ui/PageHeader";
import { contactInfo } from "@/src/data/contact";
import { services } from "@/src/data/services";

export const metadata: Metadata = {
  title: "Book a Session — SomStudioPhotography",
  description:
    "Book a photography session with SomStudioPhotography in Kathmandu, Nepal. Contact us for weddings, portraits, events, product photography, and more.",
};

const inputClass =
  "w-full rounded border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-gold/60 focus:outline-none focus:ring-1 focus:ring-gold/20 transition-colors duration-200";

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
      <p className="mb-1 text-xs uppercase tracking-[0.15em] text-zinc-600">
        {label}
      </p>
      <div className="flex items-center gap-2">
        <div aria-hidden="true" className="h-px w-4 shrink-0 bg-gold/50" />
        {href ? (
          <a
            href={href}
            className="text-sm text-zinc-300 transition-colors hover:text-white"
          >
            {value}
          </a>
        ) : (
          <p className="text-sm text-zinc-300">{value}</p>
        )}
      </div>
    </div>
  );
}

export default function ContactPage() {
  const whatsappUrl = `https://wa.me/${contactInfo.whatsapp.replace("+", "")}`;

  return (
    <>
      <Navbar />

      <PageHeader
        eyebrow="Book a Session"
        title="Let's plan your next photoshoot."
        subtitle="Tell us what you need and we'll guide you with the right package, timing, and plan."
      />

      {/* Contact form + info */}
      <section className="bg-black border-t border-white/5">
        <Container>
          <div className="grid grid-cols-1 items-start gap-14 py-20 lg:grid-cols-2 lg:gap-20 sm:py-28">

            {/* Left: contact info */}
            <div>
              <h2 className="mb-6 text-xl font-bold text-white sm:text-2xl">
                Contact Details
              </h2>

              <div className="space-y-6">
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
              </div>

              <div className="mt-8">
                <p className="mb-3 text-xs uppercase tracking-[0.15em] text-zinc-600">
                  Studio Hours
                </p>
                <div className="space-y-1.5">
                  {contactInfo.businessHours.map((slot) => (
                    <p key={slot.days} className="text-sm text-zinc-500">
                      <span className="text-zinc-400">{slot.days}</span>
                      {" — "}
                      {slot.hours}
                    </p>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <Button href={whatsappUrl} variant="secondary" size="md">
                  Chat on WhatsApp
                </Button>
              </div>

              {/* Social links */}
              <div className="mt-8">
                <p className="mb-3 text-xs uppercase tracking-[0.15em] text-zinc-600">
                  Follow Us
                </p>
                <div className="flex flex-wrap gap-4">
                  {contactInfo.socialLinks.map((social) => (
                    <a
                      key={social.platform}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-zinc-500 transition-colors hover:text-gold"
                      aria-label={`${social.label} — opens in new tab`}
                    >
                      {social.label}
                    </a>
                  ))}
                </div>
              </div>

              <p className="mt-8 max-w-xs text-xs leading-relaxed text-zinc-600">
                We typically respond within a few hours during studio hours.
                All inquiries are handled personally.
              </p>
            </div>

            {/* Right: form — visual placeholder, backend to be connected later */}
            <div className="rounded border border-zinc-800 bg-zinc-900 p-6 sm:p-8">
              <p className="mb-6 text-sm font-semibold text-white">
                Send an Inquiry
              </p>

              <form className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="page-contact-name"
                      className="mb-1.5 block text-xs text-zinc-500"
                    >
                      Full Name
                    </label>
                    <input
                      id="page-contact-name"
                      type="text"
                      name="name"
                      placeholder="Your name"
                      autoComplete="name"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="page-contact-phone"
                      className="mb-1.5 block text-xs text-zinc-500"
                    >
                      Phone Number
                    </label>
                    <input
                      id="page-contact-phone"
                      type="tel"
                      name="phone"
                      placeholder="+977-98XXXXXXXX"
                      autoComplete="tel"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="page-contact-email"
                    className="mb-1.5 block text-xs text-zinc-500"
                  >
                    Email Address
                  </label>
                  <input
                    id="page-contact-email"
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    autoComplete="email"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor="page-contact-service"
                    className="mb-1.5 block text-xs text-zinc-500"
                  >
                    Service Type
                  </label>
                  <select
                    id="page-contact-service"
                    name="service"
                    defaultValue=""
                    className={inputClass}
                  >
                    <option value="" disabled>
                      Select a service
                    </option>
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="page-contact-date"
                    className="mb-1.5 block text-xs text-zinc-500"
                  >
                    Preferred Date
                  </label>
                  <input
                    id="page-contact-date"
                    type="date"
                    name="date"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor="page-contact-message"
                    className="mb-1.5 block text-xs text-zinc-500"
                  >
                    Message
                  </label>
                  <textarea
                    id="page-contact-message"
                    name="message"
                    rows={5}
                    placeholder="Tell us about your shoot — style, location, any special requests..."
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded bg-gold px-6 py-3.5 text-sm font-semibold text-black transition-all duration-200 hover:brightness-110"
                >
                  Send Inquiry
                </button>
              </form>
            </div>

          </div>
        </Container>
      </section>

      {/* What happens next */}
      <section className="bg-zinc-950 border-t border-white/5">
        <Container>
          <div className="py-14 sm:py-16">
            <p className="mb-8 text-xs font-semibold uppercase tracking-[0.2em] text-gold text-center">
              What happens after you send an inquiry
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              {[
                { step: "01", text: "We review your inquiry and check availability for your preferred date." },
                { step: "02", text: "We reach back via phone or WhatsApp to discuss details and confirm a plan." },
                { step: "03", text: "Once everything is agreed, your session is confirmed and we prepare for the shoot." },
              ].map((item) => (
                <div key={item.step} className="flex flex-col items-center gap-3">
                  <span className="text-2xl font-bold text-zinc-800">{item.step}</span>
                  <p className="text-sm leading-relaxed text-zinc-500 max-w-xs">{item.text}</p>
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
