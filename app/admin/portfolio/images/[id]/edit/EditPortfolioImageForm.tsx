"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { getAdminPortfolioCategoriesForSelect } from "@/src/lib/db/admin-portfolio";
import { updatePortfolioImage } from "./actions";
import { initialEditPortfolioImageState } from "./types";

export type PortfolioImageFormValues = {
  id: string;
  title: string;
  slug: string;
  imageUrl: string;
  altText: string;
  description: string | null;
  featured: boolean;
  active: boolean;
  displayOrder: number;
  category: { id: string; name: string };
};
type CategoryOption = Awaited<
  ReturnType<typeof getAdminPortfolioCategoriesForSelect>
>[number];

const inputClassName =
  "w-full rounded border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/40";

const labelClassName =
  "mb-1.5 block text-xs uppercase tracking-[0.15em] text-neutral-300";

export default function EditPortfolioImageForm({
  image,
  categories,
}: {
  image: PortfolioImageFormValues;
  categories: CategoryOption[];
}) {
  const updateImageWithId = updatePortfolioImage.bind(null, image.id);
  const [state, formAction, pending] = useActionState(
    updateImageWithId,
    initialEditPortfolioImageState
  );

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="categoryId" className={labelClassName}>
            Category
          </label>
          <select
            id="categoryId"
            name="categoryId"
            required
            defaultValue={image.category.id}
            className={inputClassName}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="title" className={labelClassName}>
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            defaultValue={image.title}
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="slug" className={labelClassName}>
            Slug
          </label>
          <input
            id="slug"
            name="slug"
            type="text"
            required
            defaultValue={image.slug}
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="displayOrder" className={labelClassName}>
            Display order
          </label>
          <input
            id="displayOrder"
            name="displayOrder"
            type="number"
            required
            defaultValue={image.displayOrder}
            className={inputClassName}
          />
        </div>
      </div>

      <div>
        <label htmlFor="imageUrl" className={labelClassName}>
          Image URL
        </label>
        <input
          id="imageUrl"
          name="imageUrl"
          type="text"
          required
          defaultValue={image.imageUrl}
          className={inputClassName}
        />
      </div>

      <div>
        <label htmlFor="altText" className={labelClassName}>
          Alt text
        </label>
        <input
          id="altText"
          name="altText"
          type="text"
          required
          defaultValue={image.altText}
          className={inputClassName}
        />
      </div>

      <div>
        <label htmlFor="description" className={labelClassName}>
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={image.description ?? ""}
          className={inputClassName}
        />
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-neutral-200">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={image.featured}
            className="h-4 w-4 rounded border-neutral-600 bg-neutral-900 text-gold focus:ring-gold/40"
          />
          Featured
        </label>

        <label className="flex items-center gap-2 text-sm text-neutral-200">
          <input
            type="checkbox"
            name="active"
            defaultChecked={image.active}
            className="h-4 w-4 rounded border-neutral-600 bg-neutral-900 text-gold focus:ring-gold/40"
          />
          Active
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-4 border-t border-neutral-800 pt-6">
        <button
          type="submit"
          disabled={pending}
          className="rounded bg-gold px-5 py-2.5 text-sm font-semibold text-neutral-950 transition-colors hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {pending ? "Saving..." : "Save Changes"}
        </button>

        <Link
          href={`/admin/portfolio/images/${image.id}`}
          className="text-sm text-neutral-300 transition-colors hover:text-gold"
        >
          Cancel
        </Link>

        <p aria-live="polite" className="text-sm text-red-300">
          {state.error}
        </p>
      </div>
    </form>
  );
}
