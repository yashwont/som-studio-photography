import Link from "next/link";
import Container from "@/src/components/layout/Container";
import { navLinks } from "@/src/data/navigation";
import { contactInfo } from "@/src/data/contact";
import { services } from "@/src/data/services";

export default function Footer() {
  const footerServices = services.slice(0, 6);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-950 border-t border-white/5">
      <Container>
        {/* Main grid */}
        <div className="py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="text-white font-semibold text-xl tracking-tight"
            >
              Som<span className="text-gold">Studio</span>
            </Link>
            <p className="mt-3 text-zinc-500 text-sm leading-relaxed max-w-xs">
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
                  className="text-zinc-500 hover:text-gold text-sm transition-colors"
                  aria-label={`${social.label} – opens in new tab`}
                >
                  {social.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white text-xs font-semibold uppercase tracking-[0.15em] mb-4">
              Navigation
            </h3>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-zinc-500 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white text-xs font-semibold uppercase tracking-[0.15em] mb-4">
              Services
            </h3>
            <ul className="space-y-2.5">
              {footerServices.map((service) => (
                <li key={service.id}>
                  <span className="text-zinc-500 text-sm">{service.title}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white text-xs font-semibold uppercase tracking-[0.15em] mb-4">
              Contact
            </h3>
            <address className="not-italic space-y-2.5">
              <p className="text-zinc-500 text-sm">
                {contactInfo.address}, {contactInfo.city}
              </p>
              <p className="text-zinc-500 text-sm">{contactInfo.country}</p>
              <Link
                href={`tel:${contactInfo.phone}`}
                className="text-zinc-500 hover:text-white text-sm block transition-colors"
              >
                {contactInfo.phone}
              </Link>
              <Link
                href={`mailto:${contactInfo.email}`}
                className="text-zinc-500 hover:text-white text-sm block transition-colors break-all"
              >
                {contactInfo.email}
              </Link>
            </address>
            <div className="mt-4 space-y-1.5">
              {contactInfo.businessHours.map((slot) => (
                <p key={slot.days} className="text-zinc-600 text-xs">
                  {slot.days}: {slot.hours}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-zinc-600 text-xs">
            &copy; {currentYear} SomStudioPhotography. All rights reserved.
          </p>
          <p className="text-zinc-700 text-xs">
            {contactInfo.city}, {contactInfo.country}
          </p>
        </div>
      </Container>
    </footer>
  );
}
