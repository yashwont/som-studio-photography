"use client";

import { useActionState } from "react";
import Link from "next/link";
import { updatePortfolioCategory } from "./actions";
import { initialEditPortfolioCategoryState } from "./types";

export type PortfolioCategoryFormValues = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  displayOrder: number;
};

const inputClassName =
  "w-full rounded border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/40";

const labelClassName =
  "mb-1.5 block text-xs uppercase tracking-[0.15em] text-neutral-300";

export default function EditPortfolioCategoryForm({
  category,
}: {
  category: PortfolioCategoryFormValues;
}) {
  const updateCategoryWithId = updatePortfolioCategory.bind(
    null,
    category.id
  );
  const [state, formAction, pending] = useActionState(
    updateCategoryWithId,
    initialEditPortfolioCategoryState
  );

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClassName}>
            Title
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={category.name}
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
            defaultValue={category.displayOrder}
            className={inputClassName}
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className={labelClassName}>
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={category.description ?? ""}
          className={inputClassName}
        />
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
          href={`/admin/portfolio/${category.id}`}
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
