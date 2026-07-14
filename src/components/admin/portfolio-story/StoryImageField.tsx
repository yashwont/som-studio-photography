"use client";

import { useState, type ChangeEvent } from "react";
import type { EditableImageDraft } from "./types";
import { errorTextClassName, inputClassName, labelClassName } from "./fieldStyles";

/** Shared image + alt text + caption + upload field, used by the single-image,
 * image+text, and gallery block editors. Field names are keyed by
 * `${blockId}__${image.clientId}` so upload/order stay correct across reordering. */
export default function StoryImageField({
  blockId,
  image,
  onChange,
  onRemove,
  label,
  error,
}: {
  blockId: string;
  image: EditableImageDraft;
  onChange: (next: EditableImageDraft) => void;
  onRemove?: () => void;
  label: string;
  error?: string;
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    image.existingSrc || null
  );
  const prefix = `${blockId}__${image.clientId}`;

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setPreviewUrl(file ? URL.createObjectURL(file) : image.existingSrc || null);
  }

  return (
    <div className="space-y-3 rounded border border-neutral-800 bg-neutral-950/40 p-4">
      <div className="flex items-center justify-between gap-3">
        <span className={labelClassName}>{label}</span>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-xs font-semibold text-red-400 transition-colors hover:text-red-300"
          >
            Remove image
          </button>
        )}
      </div>

      {previewUrl ? (
        <div
          aria-label="Image preview"
          role="img"
          className="h-40 w-full rounded border border-neutral-800 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${JSON.stringify(previewUrl)})` }}
        />
      ) : (
        <div className="flex h-40 w-full items-center justify-center rounded border border-neutral-800 bg-neutral-950 text-xs text-neutral-500">
          No image yet
        </div>
      )}

      <div>
        <label htmlFor={`imgFile__${prefix}`} className={labelClassName}>
          Upload image{" "}
          {image.existingSrc && (
            <span className="normal-case text-neutral-500">
              (leave blank to keep the current image)
            </span>
          )}
        </label>
        <input
          id={`imgFile__${prefix}`}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          name={`imgFile__${prefix}`}
          onChange={handleFileChange}
          className={`${inputClassName} cursor-pointer`}
        />
      </div>

      <input type="hidden" name={`imgExistingSrc__${prefix}`} value={image.existingSrc} readOnly />
      <input
        type="hidden"
        name={`imgExistingPublicId__${prefix}`}
        value={image.existingPublicId}
        readOnly
      />
      <input
        type="hidden"
        name={`imgExistingWidth__${prefix}`}
        value={image.existingWidth}
        readOnly
      />
      <input
        type="hidden"
        name={`imgExistingHeight__${prefix}`}
        value={image.existingHeight}
        readOnly
      />

      <div>
        <label htmlFor={`imgAlt__${prefix}`} className={labelClassName}>
          Alt text
        </label>
        <input
          id={`imgAlt__${prefix}`}
          type="text"
          name={`imgAlt__${prefix}`}
          defaultValue={image.alt}
          onChange={(event) => onChange({ ...image, alt: event.target.value })}
          placeholder="Describe what's in the photo"
          className={inputClassName}
        />
      </div>

      <div>
        <label htmlFor={`imgCaption__${prefix}`} className={labelClassName}>
          Caption <span className="normal-case text-neutral-500">(optional)</span>
        </label>
        <input
          id={`imgCaption__${prefix}`}
          type="text"
          name={`imgCaption__${prefix}`}
          defaultValue={image.caption}
          onChange={(event) => onChange({ ...image, caption: event.target.value })}
          className={inputClassName}
        />
      </div>

      {error && <p className={errorTextClassName}>{error}</p>}
    </div>
  );
}
