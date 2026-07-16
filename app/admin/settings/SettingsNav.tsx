import Link from "next/link";

const SECTIONS = [
  { href: "/admin/settings/contact", label: "Contact Details" },
  { href: "/admin/settings/map", label: "Map" },
  { href: "/admin/settings/social-links", label: "Social Links" },
  { href: "/admin/settings/business-hours", label: "Business Hours" },
  { href: "/admin/settings/account", label: "Your Account" },
] as const;

export default function SettingsNav({ active }: { active: (typeof SECTIONS)[number]["href"] }) {
  return (
    <div className="mb-8 flex flex-wrap gap-2 border-b border-neutral-800 pb-6">
      {SECTIONS.map((section) => {
        const isActive = section.href === active;

        return (
          <Link
            key={section.href}
            href={section.href}
            aria-current={isActive ? "page" : undefined}
            className={
              isActive
                ? "rounded bg-gold px-3 py-1.5 text-sm font-semibold text-neutral-950"
                : "rounded border border-neutral-700 px-3 py-1.5 text-sm font-semibold text-neutral-100 transition-colors hover:border-gold hover:text-gold"
            }
          >
            {section.label}
          </Link>
        );
      })}
    </div>
  );
}
