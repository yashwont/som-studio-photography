import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/src/lib/auth/admin";
import AdminShell from "@/src/components/admin/AdminShell";
import AdminPageHeader from "@/src/components/admin/AdminPageHeader";

export const metadata: Metadata = {
  title: "About Page | Admin | SomStudioPhotography",
};

const SECTIONS = [
  {
    href: "/admin/about/hero",
    title: "Hero",
    description: "Eyebrow, title, subtitle, and the quote shown beside it.",
  },
  {
    href: "/admin/about/story",
    title: "Studio Story",
    description: "The three “Since 1995” paragraphs.",
  },
  {
    href: "/admin/about/timeline",
    title: "Timeline",
    description: "The studio's milestones, year by year.",
  },
  {
    href: "/admin/about/highlights",
    title: "Highlights",
    description: "The “What guides every session” value cards.",
  },
  {
    href: "/admin/about/experience",
    title: "Studio Experience",
    description: "The step-by-step “What to expect” cards.",
  },
  {
    href: "/admin/about/stats",
    title: "Trust Stats",
    description: "The numbers row (years of experience, services, etc).",
  },
] as const;

export default async function AdminAboutPage() {
  const admin = await requireAdmin();

  return (
    <AdminShell adminName={admin.name} adminEmail={admin.email}>
      <AdminPageHeader
        title="About Page"
        description="Manage each section of the public About page."
      />

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="rounded border border-neutral-800 bg-neutral-900 p-5 transition-colors hover:border-gold"
          >
            <h2 className="font-semibold text-neutral-50">{section.title}</h2>
            <p className="mt-2 text-sm text-neutral-400">{section.description}</p>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}
