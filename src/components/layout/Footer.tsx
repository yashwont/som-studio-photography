import Link from "next/link";
import Container from "@/src/components/layout/Container";
import SocialIcon from "@/src/components/ui/SocialIcon";
import { contactInfo } from "@/src/data/contact";
import type { SocialLink } from "@/src/types/site";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-200 bg-neutral-50">
      <Container>
        <div className="flex flex-col items-center gap-6 py-14 text-center sm:py-16">
          <Link
            href="/"
            className="text-xl font-semibold tracking-tight text-neutral-950"
          >
            Som<span className="text-neutral-900">Studio</span>
          </Link>

          <p className="max-w-2xl text-sm leading-relaxed text-neutral-900">
            A professional photography studio in {contactInfo.city},{" "}
            {contactInfo.country} with 30 years of experience, specializing in
            weddings, pre-weddings, portraits, events, maternity, kids,
            graduation, and product photography. Proudly serving Kathmandu,
            Lalitpur, and Bhaktapur.
          </p>

          <div className="flex items-center gap-5">
            {contactInfo.socialLinks.map((social: SocialLink) => (
              <Link
                key={social.platform}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${social.label} - opens in new tab`}
                className="text-neutral-900 transition-colors hover:text-gold"
              >
                <SocialIcon platform={social.platform} />
              </Link>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-neutral-900">
            <a
              href={`tel:${contactInfo.phone}`}
              className="transition-colors hover:text-neutral-950"
            >
              {contactInfo.phone}
            </a>
            <span
              aria-hidden="true"
              className="hidden h-1 w-1 rounded-full bg-neutral-300 sm:block"
            />
            <a
              href={`mailto:${contactInfo.email}`}
              className="break-all transition-colors hover:text-neutral-950"
            >
              {contactInfo.email}
            </a>
            <span
              aria-hidden="true"
              className="hidden h-1 w-1 rounded-full bg-neutral-300 sm:block"
            />
            <span>
              {contactInfo.address}, {contactInfo.city}
            </span>
          </div>
        </div>

        <div className="border-t border-neutral-200 py-5 text-center">
          <p className="text-xs text-neutral-900">
            &copy; {currentYear} SomStudioPhotography. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
