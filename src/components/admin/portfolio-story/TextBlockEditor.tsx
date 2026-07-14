"use client";

import type { TextBlockDraft } from "./types";
import { errorTextClassName, inputClassName, labelClassName } from "./fieldStyles";

export default function TextBlockEditor({
  block,
  onChange,
  error,
}: {
  block: TextBlockDraft;
  onChange: (next: TextBlockDraft) => void;
  error?: string;
}) {
  const prefix = block.clientId;

  return (
    <div className="space-y-4">
      <input type="hidden" name={`blockType__${prefix}`} value="TEXT" readOnly />

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
          rows={5}
          defaultValue={block.paragraphs}
          onChange={(event) => onChange({ ...block, paragraphs: event.target.value })}
          className={inputClassName}
        />
        {error && <p className={errorTextClassName}>{error}</p>}
      </div>
    </div>
  );
}
