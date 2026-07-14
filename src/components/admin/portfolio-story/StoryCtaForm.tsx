"use client";

import type { StoryCtaDraft } from "./types";
import { inputClassName, labelClassName } from "./fieldStyles";

export default function StoryCtaForm({
  value,
  onChange,
}: {
  value: StoryCtaDraft;
  onChange: (next: StoryCtaDraft) => void;
}) {
  return (
    <div className="space-y-4">
      <p className="text-xs text-neutral-500">
        The booking buttons already link to the contact page with the service and
        portfolio item pre-selected - these fields only control the wording shown
        above the buttons. Leave any field blank to use the default text.
      </p>

      <div>
        <label htmlFor="ctaEyebrow" className={labelClassName}>
          CTA eyebrow <span className="normal-case text-neutral-500">(optional)</span>
        </label>
        <input
          id="ctaEyebrow"
          name="ctaEyebrow"
          type="text"
          defaultValue={value.eyebrow}
          onChange={(event) => onChange({ ...value, eyebrow: event.target.value })}
          placeholder="Planning a Newborn Session?"
          className={inputClassName}
        />
      </div>

      <div>
        <label htmlFor="ctaHeading" className={labelClassName}>
          CTA heading <span className="normal-case text-neutral-500">(optional)</span>
        </label>
        <input
          id="ctaHeading"
          name="ctaHeading"
          type="text"
          defaultValue={value.heading}
          onChange={(event) => onChange({ ...value, heading: event.target.value })}
          className={inputClassName}
        />
      </div>

      <div>
        <label htmlFor="ctaBody" className={labelClassName}>
          CTA description <span className="normal-case text-neutral-500">(optional)</span>
        </label>
        <textarea
          id="ctaBody"
          name="ctaBody"
          rows={3}
          defaultValue={value.body}
          onChange={(event) => onChange({ ...value, body: event.target.value })}
          className={inputClassName}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="primaryCtaLabel" className={labelClassName}>
            Primary button label{" "}
            <span className="normal-case text-neutral-500">(optional)</span>
          </label>
          <input
            id="primaryCtaLabel"
            name="primaryCtaLabel"
            type="text"
            defaultValue={value.primaryLabel}
            onChange={(event) =>
              onChange({ ...value, primaryLabel: event.target.value })
            }
            placeholder="Book a Newborn Session"
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="secondaryCtaLabel" className={labelClassName}>
            Secondary button label{" "}
            <span className="normal-case text-neutral-500">(optional)</span>
          </label>
          <input
            id="secondaryCtaLabel"
            name="secondaryCtaLabel"
            type="text"
            defaultValue={value.secondaryLabel}
            onChange={(event) =>
              onChange({ ...value, secondaryLabel: event.target.value })
            }
            placeholder="Ask a Question"
            className={inputClassName}
          />
        </div>
      </div>
    </div>
  );
}
