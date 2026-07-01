import Container from "@/src/components/layout/Container";
import SectionHeader from "@/src/components/ui/SectionHeader";
import Button from "@/src/components/ui/Button";
import { contactInfo } from "@/src/data/contact";
import { services } from "@/src/data/services";

// Shared class for all form inputs, selects, and textarea
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

export default function Contact() {
  // wa.me requires the number without the leading +
  const whatsappUrl = `https://wa.me/${contactInfo.whatsapp.replace("+", "")}`;

  return (
    <section id="contact" className="bg-black border-t border-white/5">
      <Container>
        <div className="grid grid-cols-1 items-start gap-14 py-20 lg:grid-cols-2 lg:gap-20 sm:py-28">

          {/* ── Left: info ── */}
          <div>
            <SectionHeader
              eyebrow="Book a Session"
              title="Let's plan your next photoshoot."
              centered={false}
            />

            <p className="mt-6 max-w-lg text-base leading-relaxed text-zinc-400">
              Tell us what you need and we&rsquo;ll guide you with the right
              package, timing, and shoot plan.
            </p>

            {/* Contact details */}
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
            </div>

            {/* Studio hours */}
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

            {/* WhatsApp CTA */}
            <div className="mt-8">
              <Button href={whatsappUrl} variant="secondary" size="md">
                Chat on WhatsApp
              </Button>
            </div>

            <p className="mt-8 max-w-xs text-xs leading-relaxed text-zinc-600">
              We typically respond within a few hours during studio hours. All
              inquiries are handled personally.
            </p>
          </div>

          {/* ── Right: inquiry form (visual placeholder — backend to be connected later) ── */}
          <div className="rounded border border-zinc-800 bg-zinc-900 p-6 sm:p-8">
            <p className="mb-6 text-sm font-semibold text-white">
              Send an Inquiry
            </p>

            <form className="space-y-5">

              {/* Name + Phone */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="mb-1.5 block text-xs text-zinc-500"
                  >
                    Full Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    placeholder="Your name"
                    autoComplete="name"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact-phone"
                    className="mb-1.5 block text-xs text-zinc-500"
                  >
                    Phone Number
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    name="phone"
                    placeholder="+977-98XXXXXXXX"
                    autoComplete="tel"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="contact-email"
                  className="mb-1.5 block text-xs text-zinc-500"
                >
                  Email Address
                </label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  autoComplete="email"
                  className={inputClass}
                />
              </div>

              {/* Service type */}
              <div>
                <label
                  htmlFor="contact-service"
                  className="mb-1.5 block text-xs text-zinc-500"
                >
                  Service Type
                </label>
                <select
                  id="contact-service"
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

              {/* Preferred date */}
              <div>
                <label
                  htmlFor="contact-date"
                  className="mb-1.5 block text-xs text-zinc-500"
                >
                  Preferred Date
                </label>
                <input
                  id="contact-date"
                  type="date"
                  name="date"
                  className={inputClass}
                />
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="contact-message"
                  className="mb-1.5 block text-xs text-zinc-500"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  placeholder="Tell us about your shoot — style, location, any special requests..."
                  className={`${inputClass} resize-none`}
                />
              </div>

              {/* Submit */}
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
  );
}
