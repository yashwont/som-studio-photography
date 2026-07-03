import Link from "next/link";
import Container from "@/src/components/layout/Container";
import { navLinks } from "@/src/data/navigation";
import { contactInfo } from "@/src/data/contact";
import { services } from "@/src/data/services";

export default function Footer() {
  const footerServices = services.slice(0, 6);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-50 border-t border-neutral-200">
      <Container>
        <div className="grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="text-xl font-semibold tracking-tight text-neutral-950"
            >
              Som<span className="text-gold">Studio</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-neutral-500">
              Premium photography studio in {contactInfo.city},{" "}
              {contactInfo.country}. Capturing life&apos;s most important
              moments.
            </p>
            <div className="mt-5 flex flex-wrap gap-4">
              {contactInfo.socialLinks.map((social) => (
                <Link
                  key={social.platform}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-neutral-500 transition-colors hover:text-gold"
                  aria-label={`${social.label} - opens in new tab`}
                >
                  {social.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-neutral-950">
              Navigation
            </h3>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-500 transition-colors hover:text-neutral-950"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-neutral-950">
              Services
            </h3>
            <ul className="space-y-2.5">
              {footerServices.map((service) => (
                <li key={service.id}>
                  <span className="text-sm text-neutral-500">
                    {service.title}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-neutral-950">
              Contact
            </h3>
            <address className="space-y-2.5 not-italic">
              <p className="text-sm text-neutral-500">
                {contactInfo.address}, {contactInfo.city}
              </p>
              <p className="text-sm text-neutral-500">{contactInfo.country}</p>
              <Link
                href={`tel:${contactInfo.phone}`}
                className="block text-sm text-neutral-500 transition-colors hover:text-neutral-950"
              >
                {contactInfo.phone}
              </Link>
              <Link
                href={`mailto:${contactInfo.email}`}
                className="block break-all text-sm text-neutral-500 transition-colors hover:text-neutral-950"
              >
                {contactInfo.email}
              </Link>
            </address>
            <div className="mt-4 space-y-1.5">
              {contactInfo.businessHours.map((slot) => (
                <p key={slot.days} className="text-xs text-neutral-400">
                  {slot.days}: {slot.hours}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-neutral-200 py-5 sm:flex-row">
          <p className="text-xs text-neutral-400">
            &copy; {currentYear} SomStudioPhotography. All rights reserved.
          </p>
          <p className="text-xs text-neutral-500">
            {contactInfo.city}, {contactInfo.country}
          </p>
        </div>
      </Container>
    </footer>
  );
}
