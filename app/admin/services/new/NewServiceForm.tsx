"use client";

import { useActionState, useState, type ChangeEvent } from "react";
import Link from "next/link";
import { createService } from "./actions";
import { initialNewServiceState } from "./types";

const inputClassName =
  "w-full rounded border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/40";

const labelClassName =
  "mb-1.5 block text-xs uppercase tracking-[0.15em] text-neutral-300";

export default function NewServiceForm() {
  const [state, formAction, pending] = useActionState(
    createService,
    initialNewServiceState
  );
  const [filePreview, setFilePreview] = useState<string | null>(null);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setFilePreview(file ? URL.createObjectURL(file) : null);
  }

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="title" className={labelClassName}>
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
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
            defaultValue={0}
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
          required
          rows={4}
          className={inputClassName}
        />
      </div>

      <div>
        <label htmlFor="price" className={labelClassName}>
          Price (NRS)
        </label>
        <input
          id="price"
          name="price"
          type="number"
          min="0"
          step="0.01"
          placeholder="Leave blank for contact pricing"
          className={inputClassName}
        />
      </div>

      <div>
        <label htmlFor="imageFile" className={labelClassName}>
          Add photo
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
          JPG, PNG, or WEBP, up to 5MB. Optional - shows a placeholder until
          set.
        </p>
      </div>

      <div>
        <span className={labelClassName}>Preview</span>
        {filePreview ? (
          <div
            aria-label="Image preview"
            role="img"
            className="h-32 w-full rounded border border-neutral-800 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${JSON.stringify(filePreview)})` }}
          />
        ) : (
          <div className="flex h-32 w-full items-center justify-center rounded border border-neutral-800 bg-neutral-950 text-xs text-neutral-500">
            No preview
          </div>
        )}
      </div>

      <div>
        <label htmlFor="inclusions" className={labelClassName}>
          Inclusions{" "}
          <span className="normal-case text-neutral-500">(one per line)</span>
        </label>
        <textarea
          id="inclusions"
          name="inclusions"
          rows={5}
          className={inputClassName}
        />
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-neutral-200">
          <input
            type="checkbox"
            name="featured"
            className="h-4 w-4 rounded border-neutral-600 bg-neutral-900 text-gold focus:ring-gold/40"
          />
          Featured
        </label>

        <label className="flex items-center gap-2 text-sm text-neutral-200">
          <input
            type="checkbox"
            name="active"
            defaultChecked
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
          {pending ? "Creating..." : "Create Service"}
        </button>

        <Link
          href="/admin/services"
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
