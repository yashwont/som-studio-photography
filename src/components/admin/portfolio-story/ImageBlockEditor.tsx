"use client";

import type { ImageBlockDraft } from "./types";
import { labelClassName, inputClassName } from "./fieldStyles";
import StoryImageField from "./StoryImageField";

export default function ImageBlockEditor({
  block,
  onChange,
  error,
}: {
  block: ImageBlockDraft;
  onChange: (next: ImageBlockDraft) => void;
  error?: string;
}) {
  const prefix = block.clientId;

  return (
    <div className="space-y-4">
      <input type="hidden" name={`blockType__${prefix}`} value="IMAGE" readOnly />
      <input type="hidden" name={`imgId__${prefix}`} value={block.image.clientId} readOnly />

      <div>
        <label htmlFor={`blockLayout__${prefix}`} className={labelClassName}>
          Layout
        </label>
        <select
          id={`blockLayout__${prefix}`}
          name={`blockLayout__${prefix}`}
          defaultValue={block.layout}
          onChange={(event) =>
            onChange({
              ...block,
              layout: event.target.value as ImageBlockDraft["layout"],
            })
          }
          className={inputClassName}
        >
          <option value="full">Full width (landscape)</option>
          <option value="wide">Wide</option>
          <option value="portrait">Portrait</option>
        </select>
      </div>

      <StoryImageField
        blockId={block.clientId}
        image={block.image}
        onChange={(image) => onChange({ ...block, image })}
        label="Image"
        error={error}
      />
    </div>
  );
}
