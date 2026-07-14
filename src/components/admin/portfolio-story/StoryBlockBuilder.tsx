"use client";

import type { EditableBlock } from "./types";
import {
  createEmptyGalleryBlock,
  createEmptyImageBlock,
  createEmptyImageTextBlock,
  createEmptyTextBlock,
  duplicateBlock,
} from "./types";
import StoryBlockCard from "./StoryBlockCard";
import type { BlockFieldErrors } from "@/app/admin/portfolio/images/[id]/story/types";

const addButtonClassName =
  "rounded border border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-100 transition-colors hover:border-gold hover:text-gold";

export default function StoryBlockBuilder({
  blocks,
  onChange,
  errors,
}: {
  blocks: EditableBlock[];
  onChange: (next: EditableBlock[]) => void;
  errors?: Record<string, BlockFieldErrors>;
}) {
  function addBlock(block: EditableBlock) {
    onChange([...blocks, block]);
  }

  function updateBlock(index: number, next: EditableBlock) {
    const updated = [...blocks];
    updated[index] = next;
    onChange(updated);
  }

  function moveBlock(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= blocks.length) {
      return;
    }
    const updated = [...blocks];
    [updated[index], updated[target]] = [updated[target], updated[index]];
    onChange(updated);
  }

  function duplicateAt(index: number) {
    const updated = [...blocks];
    updated.splice(index + 1, 0, duplicateBlock(blocks[index]));
    onChange(updated);
  }

  function deleteAt(index: number) {
    onChange(blocks.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-5">
      {blocks.map((block) => (
        <input
          key={`order-${block.clientId}`}
          type="hidden"
          name="blockIds"
          value={block.clientId}
          readOnly
        />
      ))}

      {blocks.length === 0 && (
        <p className="rounded border border-dashed border-neutral-800 p-6 text-center text-sm text-neutral-500">
          No story blocks yet. Add one below to start building the editorial story.
        </p>
      )}

      {blocks.map((block, index) => (
        <StoryBlockCard
          key={block.clientId}
          block={block}
          index={index}
          total={blocks.length}
          onChange={(next) => updateBlock(index, next)}
          onMoveUp={() => moveBlock(index, -1)}
          onMoveDown={() => moveBlock(index, 1)}
          onDuplicate={() => duplicateAt(index)}
          onDelete={() => deleteAt(index)}
          errors={errors?.[block.clientId]}
        />
      ))}

      <div className="flex flex-wrap gap-3 border-t border-neutral-800 pt-5">
        <button
          type="button"
          onClick={() => addBlock(createEmptyTextBlock())}
          className={addButtonClassName}
        >
          + Text block
        </button>
        <button
          type="button"
          onClick={() => addBlock(createEmptyImageBlock())}
          className={addButtonClassName}
        >
          + Single image
        </button>
        <button
          type="button"
          onClick={() => addBlock(createEmptyGalleryBlock())}
          className={addButtonClassName}
        >
          + Gallery
        </button>
        <button
          type="button"
          onClick={() => addBlock(createEmptyImageTextBlock())}
          className={addButtonClassName}
        >
          + Image + text
        </button>
      </div>
    </div>
  );
}
