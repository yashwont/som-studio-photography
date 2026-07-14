"use client";

import { useState } from "react";
import type { EditableBlock } from "./types";
import { blockPreviewText, blockTypeLabel } from "./types";
import type { BlockFieldErrors } from "@/app/admin/portfolio/images/[id]/story/types";
import TextBlockEditor from "./TextBlockEditor";
import ImageBlockEditor from "./ImageBlockEditor";
import ImageTextBlockEditor from "./ImageTextBlockEditor";
import GalleryBlockEditor from "./GalleryBlockEditor";

const controlButtonClassName =
  "rounded border border-neutral-700 px-2.5 py-1.5 text-xs font-semibold text-neutral-200 transition-colors hover:border-gold hover:text-gold disabled:cursor-not-allowed disabled:opacity-40";

export default function StoryBlockCard({
  block,
  index,
  total,
  onChange,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
  errors,
}: {
  block: EditableBlock;
  index: number;
  total: number;
  onChange: (next: EditableBlock) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  errors?: BlockFieldErrors;
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="rounded border border-neutral-800 bg-neutral-900">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 p-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold">
            {index + 1}. {blockTypeLabel(block.type)}
          </p>
          {!isExpanded && (
            <p className="mt-1 truncate text-sm text-neutral-400">
              {blockPreviewText(block)}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={index === 0}
            aria-label={`Move block ${index + 1} up`}
            className={controlButtonClassName}
          >
            &uarr; Up
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={index === total - 1}
            aria-label={`Move block ${index + 1} down`}
            className={controlButtonClassName}
          >
            &darr; Down
          </button>
          <button
            type="button"
            onClick={onDuplicate}
            className={controlButtonClassName}
          >
            Duplicate
          </button>
          <button
            type="button"
            onClick={() => setIsExpanded((current) => !current)}
            className={controlButtonClassName}
          >
            {isExpanded ? "Collapse" : "Expand"}
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="rounded border border-red-900/60 px-2.5 py-1.5 text-xs font-semibold text-red-400 transition-colors hover:border-red-500 hover:text-red-300"
          >
            Delete
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 sm:p-5">
          {errors?.general && (
            <p className="mb-4 text-xs text-red-400">{errors.general}</p>
          )}

          {block.type === "TEXT" && (
            <TextBlockEditor
              block={block}
              onChange={onChange}
              error={errors?.paragraphs}
            />
          )}
          {block.type === "IMAGE" && (
            <ImageBlockEditor block={block} onChange={onChange} error={errors?.image} />
          )}
          {block.type === "IMAGE_TEXT" && (
            <ImageTextBlockEditor
              block={block}
              onChange={onChange}
              error={errors?.image}
            />
          )}
          {block.type === "GALLERY" && (
            <GalleryBlockEditor
              block={block}
              onChange={onChange}
              errors={errors?.images}
            />
          )}
        </div>
      )}
    </div>
  );
}
