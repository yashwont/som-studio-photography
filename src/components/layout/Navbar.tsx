"use client";

import { useState } from "react";
import Link from "next/link";
import { navLinks, ctaLink } from "@/src/data/navigation";
import Button from "@/src/components/ui/Button";
import Container from "@/src/components/layout/Container";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-white/5">
      <Container>
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="text-white font-semibold text-xl tracking-tight"
          >
            Som<span className="text-gold">Studio</span>
          </Link>

          {/* Desktop navigation */}
          <nav
            className="hidden md:flex items-center gap-8"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-zinc-400 hover:text-white transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Button href={ctaLink.href} variant="primary" size="sm">
              {ctaLink.label}
            </Button>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-zinc-400 hover:text-white p-2 transition-colors"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <span className="block w-5 text-xl leading-none select-none" aria-hidden="true">
              {isMenuOpen ? "✕" : "☰"}
            </span>
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div
            id="mobile-menu"
            className="md:hidden border-t border-white/5 pt-4 pb-6"
          >
            <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-zinc-400 hover:text-white py-2 transition-colors"
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
