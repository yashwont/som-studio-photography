import Link from "next/link";
import Container from "@/src/components/layout/Container";
import SocialIcon from "@/src/components/ui/SocialIcon";
import { renderContactTemplate } from "@/src/lib/contact-template";
import type { ContactInfo, SocialLink } from "@/src/types/site";

export default function Footer({ contact: contactInfo }: { contact: ContactInfo }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-950 text-neutral-300">
      <div aria-hidden="true" className="footer-sprocket-strip" />

      <Container>
        <div className="flex flex-col items-center gap-6 py-14 text-center sm:py-16">
          <Link
            href="/"
            className="inline-block border-b border-neutral-800 pb-2 font-serif text-2xl font-semibold tracking-tight text-white"
          >
            Som<span className="text-gold">Studio</span>
          </Link>

          <span className="flex items-center gap-1.5 text-[0.65rem] font-medium uppercase tracking-[0.3em] text-neutral-500">
            <span className="accent-rule h-px w-3.5" aria-hidden="true" />
            Photography
          </span>

          <p className="max-w-2xl text-sm leading-relaxed text-neutral-400">
            {renderContactTemplate(contactInfo.footerDescription, contactInfo)}
          </p>

          <div className="flex items-center gap-3">
            {contactInfo.socialLinks.map((social: SocialLink) => (
              <Link
                key={social.platform}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${social.label} - opens in new tab`}
                className="flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-white/[0.03] text-neutral-300 transition-all duration-200 hover:border-white hover:bg-white hover:text-neutral-950"
              >
                <SocialIcon platform={social.platform} className="h-4 w-4" />
              </Link>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-neutral-300">
            <a
              href={`tel:${contactInfo.phone}`}
              className="transition-colors hover:text-white hover:underline underline-offset-4"
            >
              {contactInfo.phone}
            </a>
            <span
              aria-hidden="true"
              className="hidden h-1 w-1 rounded-full bg-neutral-700 sm:block"
            />
            <a
              href={`mailto:${contactInfo.email}`}
              className="break-all transition-colors hover:text-white hover:underline underline-offset-4"
            >
              {contactInfo.email}
            </a>
            <span
              aria-hidden="true"
              className="hidden h-1 w-1 rounded-full bg-neutral-700 sm:block"
            />
            <span>
              {contactInfo.address}, {contactInfo.city}
            </span>
          </div>
        </div>
      </Container>

      <div aria-hidden="true" className="footer-sprocket-strip" />

      <div className="py-5 text-center">
        <p className="text-xs text-neutral-600">
          &copy; {currentYear} SomStudioPhotography. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
