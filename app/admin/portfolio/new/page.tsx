import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/src/lib/auth/admin";
import AdminShell from "@/src/components/admin/AdminShell";
import AdminPageHeader from "@/src/components/admin/AdminPageHeader";
import PortfolioImageForm from "../images/_shared/PortfolioImageForm";
import { createCategoryWithImage } from "./actions";

export const metadata: Metadata = {
  title: "Add Portfolio Category | Admin | SomStudioPhotography",
};

export default async function AdminNewPortfolioCategoryPage() {
  const admin = await requireAdmin();

  return (
    <AdminShell adminName={admin.name} adminEmail={admin.email}>
      <AdminPageHeader
        title="Add Portfolio Category"
        description="Create a new portfolio category along with its first image and story content."
        action={
          <Link
            href="/admin/portfolio"
            className="inline-flex rounded border border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-100 transition-colors hover:border-gold hover:text-gold"
          >
            &larr; Back to Portfolio
          </Link>
        }
      />

      <div className="mt-8">
        <PortfolioImageForm
          mode="new"
          action={createCategoryWithImage}
          categories={[]}
          categoryFields={{ name: "", description: "", displayOrder: 0 }}
          cancelHref="/admin/portfolio"
          submitLabel="Create Category"
          pendingLabel="Creating..."
          hasExistingStory={false}
          cover={{
            categoryId: "",
            title: "",
            slug: "",
            imageUrl: "",
            altText: "",
            description: "",
            featured: false,
            active: true,
            displayOrder: 0,
          }}
          story={{
            heroEyebrow: "",
            overview: { eyebrow: "", heading: "", paragraphs: "" },
            sessionDetails: { studio: "", service: "", location: "", style: "", setting: "" },
            cta: { eyebrow: "", heading: "", body: "", primaryLabel: "", secondaryLabel: "" },
            seo: { title: "", description: "" },
            blocks: [],
          }}
        />
      </div>
    </AdminShell>
  );
}
