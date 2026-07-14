"use client";

import type { StoryOverviewDraft } from "./types";
import { inputClassName, labelClassName } from "./fieldStyles";

export default function StoryOverviewForm({
  value,
  onChange,
}: {
  value: StoryOverviewDraft;
  onChange: (next: StoryOverviewDraft) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="overviewEyebrow" className={labelClassName}>
          Overview eyebrow <span className="normal-case text-neutral-500">(optional)</span>
        </label>
        <input
          id="overviewEyebrow"
          name="overviewEyebrow"
          type="text"
          defaultValue={value.eyebrow}
          onChange={(event) => onChange({ ...value, eyebrow: event.target.value })}
          placeholder="The Session"
          className={inputClassName}
        />
      </div>

      <div>
        <label htmlFor="overviewHeading" className={labelClassName}>
          Overview heading <span className="normal-case text-neutral-500">(optional)</span>
        </label>
        <input
          id="overviewHeading"
          name="overviewHeading"
          type="text"
          defaultValue={value.heading}
          onChange={(event) => onChange({ ...value, heading: event.target.value })}
          className={inputClassName}
        />
      </div>

      <div>
        <label htmlFor="overviewParagraphs" className={labelClassName}>
          Overview paragraphs{" "}
          <span className="normal-case text-neutral-500">
            (separate paragraphs with a blank line - at least two recommended)
          </span>
        </label>
        <textarea
          id="overviewParagraphs"
          name="overviewParagraphs"
          rows={6}
          defaultValue={value.paragraphs}
          onChange={(event) => onChange({ ...value, paragraphs: event.target.value })}
          className={inputClassName}
        />
      </div>
    </div>
  );
}
