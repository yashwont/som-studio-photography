"use client";

import type { StorySeoDraft } from "./types";
import { inputClassName, labelClassName } from "./fieldStyles";

export default function StorySeoForm({
  value,
  onChange,
}: {
  value: StorySeoDraft;
  onChange: (next: StorySeoDraft) => void;
}) {
  return (
    <div className="space-y-4">
      <p className="text-xs text-neutral-500">
        Leave these blank to keep generating the page title and meta description from
        the portfolio item&rsquo;s own title and description. The cover image stays the
        Open Graph image either way.
      </p>

      <div>
        <label htmlFor="seoTitle" className={labelClassName}>
          SEO title override <span className="normal-case text-neutral-500">(optional)</span>
        </label>
        <input
          id="seoTitle"
          name="seoTitle"
          type="text"
          defaultValue={value.title}
          onChange={(event) => onChange({ ...value, title: event.target.value })}
          className={inputClassName}
        />
      </div>

      <div>
        <label htmlFor="seoDescription" className={labelClassName}>
          Meta description override{" "}
          <span className="normal-case text-neutral-500">(optional)</span>
        </label>
        <textarea
          id="seoDescription"
          name="seoDescription"
          rows={3}
          defaultValue={value.description}
          onChange={(event) => onChange({ ...value, description: event.target.value })}
          className={inputClassName}
        />
      </div>
    </div>
  );
}
