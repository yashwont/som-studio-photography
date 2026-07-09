"use client";

import { useActionState, useState, type ChangeEvent } from "react";
import Link from "next/link";
import type { getAdminPortfolioCategoriesForSelect } from "@/src/lib/db/admin-portfolio";
import { updatePortfolioImage } from "./actions";
import { initialEditPortfolioImageState } from "./types";

function getSafePreviewUrl(value: string) {
  const trimmedUrl = value.trim();

  if (!trimmedUrl || trimmedUrl.includes('"') || trimmedUrl.includes("'")) {
    return null;
  }

  if (trimmedUrl.startsWith("/") && !trimmedUrl.startsWith("//")) {
    return trimmedUrl;
  }

  try {
    const url = new URL(trimmedUrl);
    return url.protocol === "http:" || url.protocol === "https:"
      ? trimmedUrl
      : null;
  } catch {
    return null;
  }
}

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
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [urlPreview, setUrlPreview] = useState<string | null>(
    getSafePreviewUrl(image.imageUrl)
  );

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setFilePreview(file ? URL.createObjectURL(file) : null);
  }

  function handleImageUrlChange(event: ChangeEvent<HTMLInputElement>) {
    setUrlPreview(getSafePreviewUrl(event.target.value));
  }

  const previewUrl = filePreview ?? urlPreview;

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
            {categories.map((category: CategoryOption) => (
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
        <label htmlFor="imageFile" className={labelClassName}>
          Replace image
        </label>
        <input
          id="imageFile"
          name="imageFile"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className={`${inputClassName} cursor-pointer`}
        />
        <p className="mt-1.5 text-xs text-neutral-500">
          JPG, PNG, or WEBP, up to 5MB. Leave empty to keep the current image.
        </p>
      </div>

      <div>
        <label htmlFor="imageUrl" className={labelClassName}>
          Image URL{" "}
          <span className="normal-case text-neutral-500">
            (used if no file is uploaded)
          </span>
        </label>
        <input
          id="imageUrl"
          name="imageUrl"
          type="text"
          defaultValue={image.imageUrl}
          onChange={handleImageUrlChange}
          className={inputClassName}
        />
      </div>

      <div>
        <span className={labelClassName}>Preview</span>
        {previewUrl ? (
          <div
            aria-label="Image preview"
            role="img"
            className="h-32 w-full rounded border border-neutral-800 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${JSON.stringify(previewUrl)})` }}
          />
        ) : (
          <div className="flex h-32 w-full items-center justify-center rounded border border-neutral-800 bg-neutral-950 text-xs text-neutral-500">
            No preview
          </div>
        )}
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
