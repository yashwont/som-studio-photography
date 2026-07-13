"use client";

import { useState } from "react";
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
  const pathname = usePathname();

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-neutral-200 bg-white/95 shadow-[0_2px_16px_-8px_rgba(10,10,10,0.12)] backdrop-blur-md">
      <Container>
        <div className="flex h-16 items-center justify-between sm:h-20">
          <Link href="/" className="flex flex-col leading-none">
            <span className="font-serif text-xl font-bold tracking-tight text-neutral-950 sm:text-2xl">
              Som<span className="text-accent">Studio</span>
            </span>
            <span className="mt-1 hidden items-center gap-1.5 text-[0.6rem] font-medium uppercase tracking-[0.28em] text-neutral-500 sm:flex">
              <span className="h-px w-3 bg-gold" aria-hidden="true" />
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
              className="relative inline-flex items-center justify-center rounded-full bg-accent-hover px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-neutral-950 hover:shadow-lg hover:shadow-accent/20"
            >
              {ctaLink.label}
            </Link>
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
                className="flex w-full items-center justify-center rounded-full bg-accent-hover px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-neutral-950"
                onClick={() => setIsMenuOpen(false)}
              >
                {ctaLink.label}
              </Link>
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}
