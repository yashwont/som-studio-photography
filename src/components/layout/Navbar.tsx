"use client";

import { useState } from "react";
import Link from "next/link";
import { navLinks, ctaLink } from "@/src/data/navigation";
import type { NavLink } from "@/src/types/site";
import Button from "@/src/components/ui/Button";
import Container from "@/src/components/layout/Container";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-neutral-200 bg-white/90 backdrop-blur-sm">
      <Container>
        <div className="flex h-16 items-center justify-between sm:h-20">
          <Link
            href="/"
            className="text-xl font-semibold tracking-tight text-neutral-950"
          >
            Som<span className="text-neutral-900">Studio</span>
          </Link>

          <nav
            className="hidden items-center gap-8 md:flex"
            aria-label="Main navigation"
          >
            {navLinks.map((link: NavLink) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-neutral-900 transition-colors duration-200 hover:text-neutral-950"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block">
            <Button href={ctaLink.href} variant="primary" size="sm">
              {ctaLink.label}
            </Button>
          </div>

          <button
            className="relative flex h-10 w-10 items-center justify-center text-neutral-900 transition-colors hover:text-neutral-950 md:hidden"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <span className="sr-only">
              {isMenuOpen ? "Close menu" : "Open menu"}
            </span>
            <span className="relative block h-4 w-5" aria-hidden="true">
              <span
                className={`absolute left-0 top-0 h-px w-5 bg-current transition-transform ${
                  isMenuOpen ? "translate-y-2 rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-2 h-px w-5 bg-current transition-opacity ${
                  isMenuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute bottom-0 left-0 h-px w-5 bg-current transition-transform ${
                  isMenuOpen ? "-translate-y-[7px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>

        {isMenuOpen && (
          <div
            id="mobile-menu"
            className="border-t border-neutral-200 pb-6 pt-4 md:hidden"
          >
            <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
              {navLinks.map((link: NavLink) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="py-2 text-sm text-neutral-900 transition-colors hover:text-neutral-950"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-4">
              <Button
                href={ctaLink.href}
                variant="primary"
                size="sm"
                className="w-full"
                onClick={() => setIsMenuOpen(false)}
              >
                {ctaLink.label}
              </Button>
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}
