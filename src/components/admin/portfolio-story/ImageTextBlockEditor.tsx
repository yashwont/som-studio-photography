"use client";

import type { ImageTextBlockDraft } from "./types";
import { errorTextClassName, inputClassName, labelClassName } from "./fieldStyles";
import StoryImageField from "./StoryImageField";

export default function ImageTextBlockEditor({
  block,
  onChange,
  error,
}: {
  block: ImageTextBlockDraft;
  onChange: (next: ImageTextBlockDraft) => void;
  error?: string;
}) {
  const prefix = block.clientId;

  return (
    <div className="space-y-4">
      <input type="hidden" name={`blockType__${prefix}`} value="IMAGE_TEXT" readOnly />
      <input type="hidden" name={`imgId__${prefix}`} value={block.image.clientId} readOnly />

      <div>
        <label htmlFor={`blockImagePosition__${prefix}`} className={labelClassName}>
          Image position
        </label>
        <select
          id={`blockImagePosition__${prefix}`}
          name={`blockImagePosition__${prefix}`}
          defaultValue={block.imagePosition}
          onChange={(event) =>
            onChange({
              ...block,
              imagePosition: event.target.value as ImageTextBlockDraft["imagePosition"],
            })
          }
          className={inputClassName}
        >
          <option value="left">Image on left</option>
          <option value="right">Image on right</option>
        </select>
      </div>

      <StoryImageField
        blockId={block.clientId}
        image={block.image}
        onChange={(image) => onChange({ ...block, image })}
        label="Image"
        error={error}
      />

      <div>
        <label htmlFor={`blockEyebrow__${prefix}`} className={labelClassName}>
          Eyebrow <span className="normal-case text-neutral-500">(optional)</span>
        </label>
        <input
          id={`blockEyebrow__${prefix}`}
          type="text"
          name={`blockEyebrow__${prefix}`}
          defaultValue={block.eyebrow}
          onChange={(event) => onChange({ ...block, eyebrow: event.target.value })}
          className={inputClassName}
        />
      </div>

      <div>
        <label htmlFor={`blockHeading__${prefix}`} className={labelClassName}>
          Heading <span className="normal-case text-neutral-500">(optional)</span>
        </label>
        <input
          id={`blockHeading__${prefix}`}
          type="text"
          name={`blockHeading__${prefix}`}
          defaultValue={block.heading}
          onChange={(event) => onChange({ ...block, heading: event.target.value })}
          className={inputClassName}
        />
      </div>

      <div>
        <label htmlFor={`blockParagraphs__${prefix}`} className={labelClassName}>
          Paragraphs{" "}
          <span className="normal-case text-neutral-500">
            (separate paragraphs with a blank line)
          </span>
        </label>
        <textarea
          id={`blockParagraphs__${prefix}`}
          name={`blockParagraphs__${prefix}`}
          rows={4}
          defaultValue={block.paragraphs}
          onChange={(event) => onChange({ ...block, paragraphs: event.target.value })}
          className={inputClassName}
        />
      </div>
      {error && <p className={errorTextClassName}>{error}</p>}
    </div>
  );
}
