"use client";

import {
  useActionState,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import Link from "next/link";
import type { getAdminPortfolioCategoriesForSelect } from "@/src/lib/db/admin-portfolio";
import { updateService } from "./actions";
import { initialEditServiceState } from "./types";

type PortfolioCategoryOption = Awaited<
  ReturnType<typeof getAdminPortfolioCategoriesForSelect>
>[number];

const PHOTO_SLOT_COUNT = 4;

export type ServiceFormValues = {
  id: string;
  title: string;
  description: string;
  imageUrls: string[];
  price: number | null;
  inclusions: string[];
  category: string | null;
  featured: boolean;
  active: boolean;
};

const inputClassName =
  "w-full rounded border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/40";

const labelClassName =
  "mb-1.5 block text-xs uppercase tracking-[0.15em] text-neutral-300";

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

function PhotoSlot({
  index,
  existingUrl,
  filePreview,
  removed,
  onFileChange,
  onRemoveToggle,
}: {
  index: number;
  existingUrl: string | null;
  filePreview: string | null;
  removed: boolean;
  onFileChange: (index: number, event: ChangeEvent<HTMLInputElement>) => void;
  onRemoveToggle: (index: number, event: ChangeEvent<HTMLInputElement>) => void;
}) {
  const previewUrl = filePreview ?? (removed ? null : existingUrl);

  return (
    <div className="space-y-2 rounded border border-neutral-800 bg-neutral-950/40 p-3">
      <label htmlFor={`imageFile${index}`} className={labelClassName}>
        Photo {index + 1}
      </label>
      <input
        id={`imageFile${index}`}
        name={`imageFile${index}`}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(event) => onFileChange(index, event)}
        className={`${inputClassName} cursor-pointer`}
      />

      {previewUrl ? (
        <div
          aria-label={`Photo ${index + 1} preview`}
          role="img"
          className="h-24 w-full rounded border border-neutral-800 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${JSON.stringify(previewUrl)})` }}
        />
      ) : (
        <div className="flex h-24 w-full items-center justify-center rounded border border-neutral-800 bg-neutral-950 text-xs text-neutral-500">
          No preview
        </div>
      )}

      {existingUrl && (
        <label className="flex items-center gap-2 text-xs text-neutral-300">
          <input
            type="checkbox"
            name={`removePhoto${index}`}
            checked={removed}
            onChange={(event) => onRemoveToggle(index, event)}
            className="h-3.5 w-3.5 rounded border-neutral-600 bg-neutral-900 text-gold focus:ring-gold/40"
          />
          Remove this photo
        </label>
      )}
    </div>
  );
}

export default function EditServiceForm({
  service,
  portfolioCategories,
}: {
  service: ServiceFormValues;
  portfolioCategories: PortfolioCategoryOption[];
}) {
  const updateServiceWithId = updateService.bind(null, service.id);
  const [state, formAction, pending] = useActionState(
    updateServiceWithId,
    initialEditServiceState
  );

  const existingUrls = Array.from(
    { length: PHOTO_SLOT_COUNT },
    (_, index) => getSafePreviewUrl(service.imageUrls[index] ?? "")
  );

  const [filePreviews, setFilePreviews] = useState<(string | null)[]>(
    Array.from({ length: PHOTO_SLOT_COUNT }, () => null)
  );
  const [removedSlots, setRemovedSlots] = useState<boolean[]>(
    Array.from({ length: PHOTO_SLOT_COUNT }, () => false)
  );
  const filePreviewRefs = useRef<(string | null)[]>(
    Array.from({ length: PHOTO_SLOT_COUNT }, () => null)
  );

  useEffect(() => {
    return () => {
      filePreviewRefs.current.forEach((url) => {
        if (url) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, []);

  function handleFileChange(
    index: number,
    event: ChangeEvent<HTMLInputElement>
  ) {
    const previous = filePreviewRefs.current[index];

    if (previous) {
      URL.revokeObjectURL(previous);
    }

    const file = event.target.files?.[0];
    const nextPreview = file ? URL.createObjectURL(file) : null;
    filePreviewRefs.current[index] = nextPreview;
    setFilePreviews((current) => {
      const next = [...current];
      next[index] = nextPreview;
      return next;
    });

    if (file) {
      setRemovedSlots((current) => {
        const next = [...current];
        next[index] = false;
        return next;
      });
    }
  }

  function handleRemoveToggle(
    index: number,
    event: ChangeEvent<HTMLInputElement>
  ) {
    const checked = event.target.checked;
    setRemovedSlots((current) => {
      const next = [...current];
      next[index] = checked;
      return next;
    });
  }

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label htmlFor="title" className={labelClassName}>
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={service.title}
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
          required
          rows={4}
          defaultValue={service.description}
          className={inputClassName}
        />
      </div>

      <div>
        <label htmlFor="category" className={labelClassName}>
          Portfolio Category
        </label>
        <select
          id="category"
          name="category"
          defaultValue={service.category ?? ""}
          className={inputClassName}
        >
          <option value="">No matching gallery (links to /portfolio)</option>
          {portfolioCategories.map((category: PortfolioCategoryOption) => (
            <option key={category.id} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
        <p className="mt-1.5 text-xs text-neutral-500">
          Controls where this service&rsquo;s &ldquo;View Portfolio&rdquo;
          button links to.
        </p>
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
          defaultValue={service.price ?? ""}
          className={inputClassName}
        />
      </div>

      <div>
        <span className={labelClassName}>
          Photos{" "}
          <span className="normal-case text-neutral-500">
            (up to {PHOTO_SLOT_COUNT}, shown as a rotating gallery on the
            public page)
          </span>
        </span>
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: PHOTO_SLOT_COUNT }, (_, index) => (
            <PhotoSlot
              key={index}
              index={index}
              existingUrl={existingUrls[index]}
              filePreview={filePreviews[index]}
              removed={removedSlots[index]}
              onFileChange={handleFileChange}
              onRemoveToggle={handleRemoveToggle}
            />
          ))}
        </div>
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
          defaultValue={service.inclusions.join("\n")}
          className={inputClassName}
        />
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-neutral-200">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={service.featured}
            className="h-4 w-4 rounded border-neutral-600 bg-neutral-900 text-gold focus:ring-gold/40"
          />
          Featured
        </label>

        <label className="flex items-center gap-2 text-sm text-neutral-200">
          <input
            type="checkbox"
            name="active"
            defaultChecked={service.active}
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
          href={`/admin/services/${service.id}`}
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
