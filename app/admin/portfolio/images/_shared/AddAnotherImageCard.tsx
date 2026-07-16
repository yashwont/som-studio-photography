"use client";

import { useState } from "react";
import type { getAdminPortfolioCategoriesForSelect } from "@/src/lib/db/admin-portfolio";
import { createPortfolioImageWithStory } from "../new/actions";
import PortfolioImageForm from "./PortfolioImageForm";

type CategoryOption = Awaited<
  ReturnType<typeof getAdminPortfolioCategoriesForSelect>
>[number];

export default function AddAnotherImageCard({
  categoryId,
  categories,
}: {
  categoryId: string;
  categories: CategoryOption[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full rounded border border-dashed border-neutral-700 p-6 text-center text-sm font-semibold text-neutral-300 transition-colors hover:border-gold hover:text-gold"
      >
        + Add another image
      </button>
    );
  }

  return (
    <div className="rounded border border-neutral-800 bg-neutral-950 p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-neutral-400">
          New image
        </h3>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="rounded border border-neutral-700 px-3 py-1.5 text-xs font-semibold text-neutral-100 transition-colors hover:border-gold hover:text-gold"
        >
          Cancel
        </button>
      </div>

      <PortfolioImageForm
        mode="new"
        action={createPortfolioImageWithStory}
        categories={categories}
        onCancel={() => setIsOpen(false)}
        submitLabel="Create Image"
        pendingLabel="Creating..."
        hasExistingStory={false}
        cover={{
          categoryId,
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
  );
}
