"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks, ctaLink } from "@/src/data/navigation";
import type { NavLink } from "@/src/types/site";
import Container from "@/src/components/layout/Container";

function isLinkActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Keep the bar solid whenever the mobile menu is open so links stay legible.
  const solid = scrolled || isMenuOpen;

  return (
    <header
      data-scrolled={solid ? "true" : "false"}
      className="nav-shell fixed left-0 right-0 top-0 z-50 border-b"
    >
      <Container>
        <div className="flex h-16 items-center justify-between sm:h-20">
          <Link href="/" className="flex flex-col leading-none">
            <span className="font-serif text-xl font-bold tracking-tight text-neutral-950 sm:text-2xl">
              Som<span className="text-gold">Studio</span>
            </span>
            <span className="mt-1 hidden items-center gap-1.5 text-[0.6rem] font-medium uppercase tracking-[0.28em] text-neutral-500 sm:flex">
              <span className="accent-rule h-px w-3" aria-hidden="true" />
              Photography
            </span>
          </Link>

          <nav
            className="hidden items-center gap-9 md:flex"
            aria-label="Main navigation"
          >
            {navLinks.map((link: NavLink) => {
              const active = isLinkActive(pathname ?? "/", link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`group relative py-2 text-sm font-medium transition-colors duration-200 ${
                    active
                      ? "text-neutral-950"
                      : "text-neutral-600 hover:text-neutral-950"
                  }`}
                >
                  {link.label}
                  <span
                    aria-hidden="true"
                    className={`absolute -bottom-0.5 left-0 h-px bg-gold transition-all duration-300 ease-out ${
                      active ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:block">
            <Link
              href={ctaLink.href}
              className="btn-shimmer group relative inline-flex items-center justify-center gap-2 rounded-full bg-accent-hover px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-neutral-950 hover:shadow-lg hover:shadow-accent/25"
            >
              {ctaLink.label}
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
              >
                <path d="M5 12h14" />
                <path d="m13 6 6 6-6 6" />
              </svg>
            </Link>
          </div>

          <button
            className="relative flex h-10 w-10 items-center justify-center text-neutral-900 transition-all duration-200 hover:scale-110 hover:text-neutral-950 md:hidden"
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
            className="-mx-2 mt-2 rounded-2xl border border-white/50 bg-white/70 px-2 pb-4 pt-3 backdrop-blur-xl md:hidden"
          >
            <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
              {navLinks.map((link: NavLink) => {
                const active = isLinkActive(pathname ?? "/", link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-neutral-100 text-neutral-950"
                        : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-5 border-t border-neutral-200 pt-5">
              <Link
                href={ctaLink.href}
                className="group flex w-full items-center justify-center gap-2 rounded-full bg-accent-hover px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-neutral-950 hover:shadow-lg hover:shadow-black/25"
                onClick={() => setIsMenuOpen(false)}
              >
                {ctaLink.label}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                >
                  <path d="M5 12h14" />
                  <path d="m13 6 6 6-6 6" />
                </svg>
              </Link>
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}
