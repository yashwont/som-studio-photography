import Link from "next/link";

const SECTIONS = [
  { href: "/admin/home/hero", label: "Hero" },
  { href: "/admin/home/about-teaser", label: "About Teaser" },
  { href: "/admin/home/services", label: "Services" },
  { href: "/admin/home/reviews", label: "Reviews" },
  { href: "/admin/home/final-cta", label: "Final CTA" },
] as const;

export default function HomeNav({ active }: { active: (typeof SECTIONS)[number]["href"] }) {
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
