"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type AdminNavLink = {
  href: string;
  label: string;
};

const NAV_LINKS: AdminNavLink[] = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/packages", label: "Packages" },
  { href: "/admin/portfolio", label: "Portfolio" },
  { href: "/admin/portfolio/images", label: "Portfolio Images" },
  { href: "/admin/inquiries", label: "Inquiries" },
  { href: "/admin/settings", label: "Settings" },
];

type AdminSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col border-r border-neutral-800 bg-neutral-900 px-4 py-6 transition-transform duration-200 md:static md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Link
          href="/admin"
          onClick={onClose}
          className="mb-8 block text-sm font-semibold uppercase tracking-[0.2em] text-gold"
        >
          SomStudio <span className="text-neutral-100">Admin</span>
        </Link>

        <nav
          className="flex flex-1 flex-col gap-1"
          aria-label="Admin navigation"
        >
          {NAV_LINKS.map((link: AdminNavLink) => {
            const isActive =
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname === link.href ||
                  pathname.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                aria-current={isActive ? "page" : undefined}
                className={`rounded px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-neutral-800 text-gold"
                    : "text-neutral-300 hover:bg-neutral-800/60 hover:text-neutral-50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
