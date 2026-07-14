"use client";

import type { EditableImageDraft, GalleryBlockDraft } from "./types";
import { createEmptyImageDraft } from "./types";
import { inputClassName, labelClassName } from "./fieldStyles";
import StoryImageField from "./StoryImageField";

export default function GalleryBlockEditor({
  block,
  onChange,
  errors,
}: {
  block: GalleryBlockDraft;
  onChange: (next: GalleryBlockDraft) => void;
  /** Keyed by the gallery image's clientId. */
  errors?: Record<string, string>;
}) {
  const prefix = block.clientId;

  function updateImage(index: number, next: EditableImageDraft) {
    const images = [...block.images];
    images[index] = next;
    onChange({ ...block, images });
  }

  function removeImage(index: number) {
    onChange({ ...block, images: block.images.filter((_, i) => i !== index) });
  }

  function addImage() {
    onChange({ ...block, images: [...block.images, createEmptyImageDraft()] });
  }

  function moveImage(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= block.images.length) {
      return;
    }
    const images = [...block.images];
    [images[index], images[target]] = [images[target], images[index]];
    onChange({ ...block, images });
  }

  return (
    <div className="space-y-4">
      <input type="hidden" name={`blockType__${prefix}`} value="GALLERY" readOnly />

      <div>
        <label htmlFor={`blockColumns__${prefix}`} className={labelClassName}>
          Columns
        </label>
        <select
          id={`blockColumns__${prefix}`}
          name={`blockColumns__${prefix}`}
          defaultValue={String(block.columns)}
          onChange={(event) =>
            onChange({ ...block, columns: Number(event.target.value) === 3 ? 3 : 2 })
          }
          className={inputClassName}
        >
          <option value="2">2 columns</option>
          <option value="3">3 columns</option>
        </select>
      </div>

      {block.images.map((image) => (
        <input
          key={`order-${image.clientId}`}
          type="hidden"
          name={`imgOrder__${prefix}`}
          value={image.clientId}
          readOnly
        />
      ))}

      <div>
        <p className={labelClassName}>
          Images{" "}
          <span className="normal-case text-neutral-500">(at least 2 required)</span>
        </p>
        <div className="space-y-4">
          {block.images.map((image, index) => (
            <div key={image.clientId} className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-neutral-400">
                  Image {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => moveImage(index, -1)}
                  disabled={index === 0}
                  aria-label={`Move image ${index + 1} up`}
                  className="rounded border border-neutral-700 px-2 py-1 text-xs text-neutral-200 transition-colors hover:border-gold hover:text-gold disabled:cursor-not-allowed disabled:opacity-40"
                >
                  &uarr;
                </button>
                <button
                  type="button"
                  onClick={() => moveImage(index, 1)}
                  disabled={index === block.images.length - 1}
                  aria-label={`Move image ${index + 1} down`}
                  className="rounded border border-neutral-700 px-2 py-1 text-xs text-neutral-200 transition-colors hover:border-gold hover:text-gold disabled:cursor-not-allowed disabled:opacity-40"
                >
                  &darr;
                </button>
              </div>
              <StoryImageField
                blockId={block.clientId}
                image={image}
                onChange={(next) => updateImage(index, next)}
                onRemove={
                  block.images.length > 1 ? () => removeImage(index) : undefined
                }
                label={`Image ${index + 1}`}
                error={errors?.[image.clientId]}
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addImage}
          className="mt-3 rounded border border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-100 transition-colors hover:border-gold hover:text-gold"
        >
          + Add image
        </button>
      </div>
    </div>
  );
}
