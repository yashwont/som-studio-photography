"use client";

import {
  useActionState,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import Link from "next/link";
import { updateService } from "./actions";
import { initialEditServiceState } from "./types";

export type ServiceFormValues = {
  id: string;
  title: string;
  description: string;
  imageUrls: string[];
  price: number | null;
  inclusions: string[];
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

type PhotoDraft = {
  clientId: string;
  existingUrl: string | null;
  preview: string | null;
};

function createExistingPhoto(url: string, index: number): PhotoDraft {
  return { clientId: `existing-${index}-${url}`, existingUrl: url, preview: null };
}

function createEmptyPhoto(): PhotoDraft {
  return { clientId: crypto.randomUUID(), existingUrl: null, preview: null };
}

function PhotoSlot({
  photo,
  onFileChange,
  onRemove,
}: {
  photo: PhotoDraft;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}) {
  const previewUrl = photo.preview ?? photo.existingUrl;

  return (
    <div className="space-y-2 rounded border border-neutral-800 bg-neutral-950/40 p-3">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={`imageFile-${photo.clientId}`} className={labelClassName}>
          Photo
        </label>
        <button
          type="button"
          onClick={onRemove}
          className="rounded border border-red-900/60 px-2.5 py-1 text-xs font-semibold text-red-400 transition-colors hover:border-red-500 hover:text-red-300"
        >
          Remove
        </button>
      </div>
      <input
        id={`imageFile-${photo.clientId}`}
        name={`imageFile__${photo.clientId}`}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={onFileChange}
        className={`${inputClassName} cursor-pointer`}
      />

      {previewUrl ? (
        <div
          aria-label="Photo preview"
          role="img"
          className="h-24 w-full rounded border border-neutral-800 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${JSON.stringify(previewUrl)})` }}
        />
      ) : (
        <div className="flex h-24 w-full items-center justify-center rounded border border-neutral-800 bg-neutral-950 text-xs text-neutral-500">
          No preview
        </div>
      )}
    </div>
  );
}

export default function EditServiceForm({
  service,
}: {
  service: ServiceFormValues;
}) {
  const updateServiceWithId = updateService.bind(null, service.id);
  const [state, formAction, pending] = useActionState(
    updateServiceWithId,
    initialEditServiceState
  );

  const [photos, setPhotos] = useState<PhotoDraft[]>(() =>
    service.imageUrls
      .map((url) => getSafePreviewUrl(url))
      .filter((url): url is string => Boolean(url))
      .map((url, index) => createExistingPhoto(url, index))
  );
  const previewRefs = useRef<Record<string, string | null>>({});

  useEffect(() => {
    const refs = previewRefs.current;

    return () => {
      Object.values(refs).forEach((url) => {
        if (url) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, []);

  function handleFileChange(clientId: string, event: ChangeEvent<HTMLInputElement>) {
    const previous = previewRefs.current[clientId];

    if (previous) {
      URL.revokeObjectURL(previous);
    }

    const file = event.target.files?.[0];
    const nextPreview = file ? URL.createObjectURL(file) : null;
    previewRefs.current[clientId] = nextPreview;
    setPhotos((current) =>
      current.map((photo) =>
        photo.clientId === clientId ? { ...photo, preview: nextPreview } : photo
      )
    );
  }

  function removePhoto(clientId: string) {
    const preview = previewRefs.current[clientId];

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    delete previewRefs.current[clientId];
    setPhotos((current) => current.filter((photo) => photo.clientId !== clientId));
  }

  return (
    <form action={formAction} className="space-y-6">
      {photos.map((photo) => (
        <div key={`hidden-${photo.clientId}`}>
          <input type="hidden" name="photoIds" value={photo.clientId} readOnly />
          {photo.existingUrl && (
            <input
              type="hidden"
              name={`existingUrl__${photo.clientId}`}
              value={photo.existingUrl}
              readOnly
            />
          )}
        </div>
      ))}

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
            (shown as a rotating gallery on the public page - all optional)
          </span>
        </span>
        <div className="grid gap-4 sm:grid-cols-2">
          {photos.map((photo) => (
            <PhotoSlot
              key={photo.clientId}
              photo={photo}
              onFileChange={(event) => handleFileChange(photo.clientId, event)}
              onRemove={() => removePhoto(photo.clientId)}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => setPhotos((current) => [...current, createEmptyPhoto()])}
          className="mt-4 rounded border border-dashed border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-300 transition-colors hover:border-gold hover:text-gold"
        >
          + Add Photo
        </button>
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
