"use client";

import {
  useActionState,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { useRouter } from "next/navigation";
import { updatePortfolioGallery } from "./actions";
import { initialPortfolioGalleryState } from "./types";

type GalleryFormProps = {
  serviceId: string;
  title: string;
  imageUrls: string[];
  galleryIntro: string | null;
  galleryClosing: string | null;
};

type PhotoDraft = {
  clientId: string;
  existingUrl: string | null;
  preview: string | null;
};

const inputClassName =
  "w-full rounded border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm text-neutral-100 file:mr-4 file:rounded file:border-0 file:bg-gold file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-neutral-950 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/40";

const textareaClassName =
  "w-full rounded border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm text-neutral-100 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/40";

const labelClassName =
  "mb-1.5 block text-xs font-semibold uppercase tracking-[0.15em] text-neutral-300";

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

function createExistingPhoto(url: string, index: number): PhotoDraft {
  return { clientId: `existing-${index}-${url}`, existingUrl: url, preview: null };
}

function createEmptyPhoto(): PhotoDraft {
  return { clientId: crypto.randomUUID(), existingUrl: null, preview: null };
}

export default function GalleryForm({
  serviceId,
  title,
  imageUrls,
  galleryIntro,
  galleryClosing,
}: GalleryFormProps) {
  const router = useRouter();
  const updateGalleryWithId = updatePortfolioGallery.bind(null, serviceId);
  const [state, formAction, pending] = useActionState(
    updateGalleryWithId,
    initialPortfolioGalleryState
  );

  const safeImageUrls = imageUrls
    .map((url: string) => getSafePreviewUrl(url))
    .filter((url): url is string => Boolean(url));

  const [topPhoto, setTopPhoto] = useState<PhotoDraft>(() =>
    safeImageUrls.length > 0
      ? createExistingPhoto(safeImageUrls[0], 0)
      : createEmptyPhoto()
  );
  const [photos, setPhotos] = useState<PhotoDraft[]>(() =>
    safeImageUrls.slice(1).map((url, index) => createExistingPhoto(url, index))
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

  useEffect(() => {
    if (state.success) {
      router.refresh();
    }
  }, [router, state.success]);

  function handleTopFileChange(event: ChangeEvent<HTMLInputElement>) {
    const previous = previewRefs.current[topPhoto.clientId];

    if (previous) {
      URL.revokeObjectURL(previous);
    }

    const file = event.target.files?.[0];
    const nextPreview = file ? URL.createObjectURL(file) : null;
    previewRefs.current[topPhoto.clientId] = nextPreview;
    setTopPhoto((current) => ({ ...current, preview: nextPreview }));
  }

  function removeTopPhoto() {
    const preview = previewRefs.current[topPhoto.clientId];

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    delete previewRefs.current[topPhoto.clientId];
    setTopPhoto(createEmptyPhoto());
  }

  function handleFileChange(clientId: string, event: ChangeEvent<HTMLInputElement>) {
    const previous = previewRefs.current[clientId];

    if (previous) {
      URL.revokeObjectURL(previous);
    }

    const file = event.target.files?.[0];
    const nextPreview = file ? URL.createObjectURL(file) : null;
    previewRefs.current[clientId] = nextPreview;
    setPhotos((current) =>
      current.map((photo: PhotoDraft) =>
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
    setPhotos((current) =>
      current.filter((photo: PhotoDraft) => photo.clientId !== clientId)
    );
  }

  function movePhoto(clientId: string, direction: -1 | 1) {
    setPhotos((current) => {
      const index = current.findIndex((photo) => photo.clientId === clientId);
      const targetIndex = index + direction;

      if (index === -1 || targetIndex < 0 || targetIndex >= current.length) {
        return current;
      }

      const next = [...current];
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next;
    });
  }

  const topPreviewUrl = topPhoto.preview ?? topPhoto.existingUrl;

  return (
    <form action={formAction} className="space-y-8">
      <div>
        <label htmlFor="topImage" className={labelClassName}>
          Top Photo
        </label>
        {topPhoto.existingUrl && (
          <input
            type="hidden"
            name="topExistingUrl"
            value={topPhoto.existingUrl}
            readOnly
          />
        )}
        <div className="space-y-2 rounded border border-neutral-800 bg-neutral-950/40 p-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-neutral-500">
              Shown first on the gallery page
            </span>
            {topPreviewUrl && (
              <button
                type="button"
                onClick={removeTopPhoto}
                className="rounded border border-red-900/60 px-2.5 py-1 text-xs font-semibold text-red-400 transition-colors hover:border-red-500 hover:text-red-300"
              >
                Remove
              </button>
            )}
          </div>
          <input
            id="topImage"
            name="topImageFile"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleTopFileChange}
            className={inputClassName}
          />
          {topPreviewUrl ? (
            <div
              aria-label={`${title} top photo preview`}
              role="img"
              className="h-40 rounded border border-neutral-800 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${JSON.stringify(topPreviewUrl)})` }}
            />
          ) : (
            <div className="flex h-40 items-center justify-center rounded border border-neutral-800 bg-neutral-950 text-xs text-neutral-500">
              No photo
            </div>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="galleryIntro" className={labelClassName}>
          Intro Paragraph
        </label>
        <textarea
          id="galleryIntro"
          name="galleryIntro"
          rows={4}
          placeholder="Optional - shown at the top of the gallery page"
          defaultValue={galleryIntro ?? ""}
          className={textareaClassName}
        />
      </div>

      <div>
        <span className={labelClassName}>Gallery Photos</span>

        {photos.map((photo: PhotoDraft) => (
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

        <div className="grid gap-4 sm:grid-cols-2">
          {photos.map((photo: PhotoDraft, index: number) => {
            const previewUrl = photo.preview ?? photo.existingUrl;

            return (
              <div
                key={photo.clientId}
                className="space-y-2 rounded border border-neutral-800 bg-neutral-950/40 p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <label
                    htmlFor={`galleryImage-${photo.clientId}`}
                    className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-300"
                  >
                    Gallery Photo {index + 1}
                  </label>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => movePhoto(photo.clientId, -1)}
                      disabled={index === 0}
                      aria-label="Move photo earlier"
                      className="rounded border border-neutral-700 px-2 py-1 text-xs font-semibold text-neutral-300 transition-colors hover:border-gold hover:text-gold disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      &uarr;
                    </button>
                    <button
                      type="button"
                      onClick={() => movePhoto(photo.clientId, 1)}
                      disabled={index === photos.length - 1}
                      aria-label="Move photo later"
                      className="rounded border border-neutral-700 px-2 py-1 text-xs font-semibold text-neutral-300 transition-colors hover:border-gold hover:text-gold disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      &darr;
                    </button>
                    <button
                      type="button"
                      onClick={() => removePhoto(photo.clientId)}
                      className="rounded border border-red-900/60 px-2.5 py-1 text-xs font-semibold text-red-400 transition-colors hover:border-red-500 hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <input
                  id={`galleryImage-${photo.clientId}`}
                  name={`imageFile__${photo.clientId}`}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) => handleFileChange(photo.clientId, event)}
                  className={inputClassName}
                />
                {previewUrl ? (
                  <div
                    aria-label={`${title} gallery preview`}
                    role="img"
                    className="h-28 rounded border border-neutral-800 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${JSON.stringify(previewUrl)})` }}
                  />
                ) : (
                  <div className="flex h-28 items-center justify-center rounded border border-neutral-800 bg-neutral-950 text-xs text-neutral-500">
                    No preview
                  </div>
                )}
              </div>
            );
          })}
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
        <label htmlFor="galleryClosing" className={labelClassName}>
          Closing Paragraph
        </label>
        <textarea
          id="galleryClosing"
          name="galleryClosing"
          rows={4}
          placeholder="Optional - shown at the bottom of the gallery page"
          defaultValue={galleryClosing ?? ""}
          className={textareaClassName}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-neutral-800 pt-5">
        <button
          type="submit"
          disabled={pending}
          className="rounded bg-gold px-4 py-2 text-sm font-semibold text-neutral-950 transition-colors hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {pending ? "Saving..." : "Save Gallery"}
        </button>
        <p aria-live="polite" className="min-h-5 text-sm">
          {state.error && <span className="text-red-300">{state.error}</span>}
          {!state.error && state.success && (
            <span className="text-emerald-300">{state.success}</span>
          )}
        </p>
      </div>
    </form>
  );
}
