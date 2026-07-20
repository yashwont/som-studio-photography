"use client";

import { useMemo } from "react";
import type { BlockFieldErrors } from "@/src/lib/portfolio/story-form";
import { inputClassName, labelClassName } from "@/src/components/admin/portfolio-story/fieldStyles";
import ImageBlockEditor from "@/src/components/admin/portfolio-story/ImageBlockEditor";
import GalleryBlockEditor from "@/src/components/admin/portfolio-story/GalleryBlockEditor";
import {
  createEmptyGalleryBlock,
  createEmptyImageBlock,
  createEmptyTextBlock,
  type EditableBlock,
  type GalleryBlockDraft,
  type ImageBlockDraft,
  type TextBlockDraft,
} from "@/src/components/admin/portfolio-story/types";

type PhotoBlock = ImageBlockDraft | GalleryBlockDraft;

const controlButtonClassName =
  "rounded border border-neutral-700 px-3 py-1.5 text-xs font-semibold text-neutral-100 transition-colors hover:border-gold hover:text-gold disabled:cursor-not-allowed disabled:opacity-40";

const addButtonClassName =
  "rounded border border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-100 transition-colors hover:border-gold hover:text-gold";

function isPhotoBlock(block: EditableBlock): block is PhotoBlock {
  return block.type === "IMAGE" || block.type === "GALLERY";
}

function getEndingBlock(blocks: EditableBlock[]): TextBlockDraft {
  const textBlocks = blocks.filter((block): block is TextBlockDraft => block.type === "TEXT");
  return textBlocks[textBlocks.length - 1] ?? createEmptyTextBlock();
}

function hasEndingText(block: TextBlockDraft) {
  return Boolean(block.eyebrow.trim() || block.heading.trim() || block.paragraphs.trim());
}

export default function BlogStoryBlocks({
  blocks,
  onChange,
  errors,
}: {
  blocks: EditableBlock[];
  onChange: (next: EditableBlock[]) => void;
  errors?: Record<string, BlockFieldErrors>;
}) {
  const photoBlocks = blocks.filter(isPhotoBlock);
  const endingBlock = useMemo(() => getEndingBlock(blocks), [blocks]);
  const savedBlocks: EditableBlock[] = hasEndingText(endingBlock)
    ? [...photoBlocks, endingBlock]
    : photoBlocks;

  function commit(nextPhotos: PhotoBlock[], nextEnding: TextBlockDraft) {
    onChange(hasEndingText(nextEnding) ? [...nextPhotos, nextEnding] : nextPhotos);
  }

  function addPhotoBlock(block: PhotoBlock) {
    commit([...photoBlocks, block], endingBlock);
  }

  function updatePhotoBlock(index: number, next: PhotoBlock) {
    const updated = [...photoBlocks];
    updated[index] = next;
    commit(updated, endingBlock);
  }

  function movePhotoBlock(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= photoBlocks.length) {
      return;
    }
    const updated = [...photoBlocks];
    [updated[index], updated[target]] = [updated[target], updated[index]];
    commit(updated, endingBlock);
  }

  function removePhotoBlock(index: number) {
    commit(
      photoBlocks.filter((_, blockIndex) => blockIndex !== index),
      endingBlock
    );
  }

  function updateEndingBlock(next: TextBlockDraft) {
    commit(photoBlocks, next);
  }

  return (
    <div className="space-y-6">
      {savedBlocks.map((block) => (
        <input
          key={`order-${block.clientId}`}
          type="hidden"
          name="blockIds"
          value={block.clientId}
          readOnly
        />
      ))}

      <div className="space-y-4">
        {photoBlocks.length === 0 && (
          <p className="rounded border border-dashed border-neutral-800 p-6 text-center text-sm text-neutral-500">
            No extra photos yet. Add single photos or a gallery below the opening paragraph.
          </p>
        )}

        {photoBlocks.map((block, index) => (
          <div key={block.clientId} className="rounded border border-neutral-800 bg-neutral-900 p-4 sm:p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-gold">
                Photo section {index + 1}
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => movePhotoBlock(index, -1)}
                  disabled={index === 0}
                  className={controlButtonClassName}
                >
                  Up
                </button>
                <button
                  type="button"
                  onClick={() => movePhotoBlock(index, 1)}
                  disabled={index === photoBlocks.length - 1}
                  className={controlButtonClassName}
                >
                  Down
                </button>
                <button
                  type="button"
                  onClick={() => removePhotoBlock(index)}
                  className="rounded border border-red-900/60 px-3 py-1.5 text-xs font-semibold text-red-400 transition-colors hover:border-red-500 hover:text-red-300"
                >
                  Remove
                </button>
              </div>
            </div>

            {block.type === "IMAGE" ? (
              <ImageBlockEditor
                block={block}
                onChange={(next) => updatePhotoBlock(index, next)}
                error={errors?.[block.clientId]?.image}
              />
            ) : (
              <GalleryBlockEditor
                block={block}
                onChange={(next) => updatePhotoBlock(index, next)}
                errors={errors?.[block.clientId]?.images}
              />
            )}
          </div>
        ))}

        <div className="flex flex-wrap gap-3 border-t border-neutral-800 pt-5">
          <button
            type="button"
            onClick={() => addPhotoBlock(createEmptyImageBlock())}
            className={addButtonClassName}
          >
            + Add photo
          </button>
          <button
            type="button"
            onClick={() => addPhotoBlock(createEmptyGalleryBlock())}
            className={addButtonClassName}
          >
            + Add more photos
          </button>
        </div>
      </div>

      <div className="rounded border border-neutral-800 bg-neutral-900 p-4 sm:p-5">
        <input type="hidden" name={`blockType__${endingBlock.clientId}`} value="TEXT" readOnly />
        <input
          type="hidden"
          name={`blockEyebrow__${endingBlock.clientId}`}
          value={endingBlock.eyebrow}
          readOnly
        />
        <input
          type="hidden"
          name={`blockHeading__${endingBlock.clientId}`}
          value={endingBlock.heading}
          readOnly
        />

        <label htmlFor={`blockParagraphs__${endingBlock.clientId}`} className={labelClassName}>
          Ending paragraph
        </label>
        <textarea
          id={`blockParagraphs__${endingBlock.clientId}`}
          name={`blockParagraphs__${endingBlock.clientId}`}
          rows={5}
          value={endingBlock.paragraphs}
          onChange={(event) =>
            updateEndingBlock({ ...endingBlock, paragraphs: event.target.value })
          }
          placeholder="Close the story with booking context, session notes, or a call to action."
          className={inputClassName}
        />
        {errors?.[endingBlock.clientId]?.paragraphs && (
          <p className="mt-1.5 text-xs text-red-400">
            {errors[endingBlock.clientId]?.paragraphs}
          </p>
        )}
      </div>
    </div>
  );
}
