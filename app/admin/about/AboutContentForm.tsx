"use client";

import { useActionState } from "react";
import { updateAboutContent } from "./actions";
import { initialEditAboutContentState } from "./types";
import type { AboutContentData } from "@/src/lib/db/about";

const inputClassName =
  "w-full rounded border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/40";

const labelClassName =
  "mb-1.5 block text-xs uppercase tracking-[0.15em] text-neutral-300";

function highlightsToLines(highlights: AboutContentData["highlights"]) {
  return highlights.map((item) => `${item.title} | ${item.description}`).join("\n");
}

export default function AboutContentForm({
  content,
}: {
  content: AboutContentData;
}) {
  const [state, formAction, pending] = useActionState(
    updateAboutContent,
    initialEditAboutContentState
  );

  return (
    <form action={formAction} className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-gold">
          Hero
        </h2>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="heroEyebrow" className={labelClassName}>
              Eyebrow
            </label>
            <input
              id="heroEyebrow"
              name="heroEyebrow"
              type="text"
              defaultValue={content.heroEyebrow}
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="heroTitle" className={labelClassName}>
              Title
            </label>
            <input
              id="heroTitle"
              name="heroTitle"
              type="text"
              required
              defaultValue={content.heroTitle}
              className={inputClassName}
            />
          </div>
        </div>

        <div>
          <label htmlFor="heroSubtitle" className={labelClassName}>
            Subtitle
          </label>
          <textarea
            id="heroSubtitle"
            name="heroSubtitle"
            rows={2}
            defaultValue={content.heroSubtitle}
            className={inputClassName}
          />
        </div>
      </section>

      <section className="space-y-4 border-t border-neutral-800 pt-6">
        <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-gold">
          Studio Story
        </h2>

        <div>
          <label htmlFor="storyParagraph1" className={labelClassName}>
            Paragraph 1
          </label>
          <textarea
            id="storyParagraph1"
            name="storyParagraph1"
            required
            rows={3}
            defaultValue={content.storyParagraph1}
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="storyParagraph2" className={labelClassName}>
            Paragraph 2
          </label>
          <textarea
            id="storyParagraph2"
            name="storyParagraph2"
            rows={3}
            defaultValue={content.storyParagraph2}
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="storyParagraph3" className={labelClassName}>
            Paragraph 3
          </label>
          <textarea
            id="storyParagraph3"
            name="storyParagraph3"
            rows={2}
            defaultValue={content.storyParagraph3}
            className={inputClassName}
          />
        </div>
      </section>

      <section className="space-y-4 border-t border-neutral-800 pt-6">
        <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-gold">
          Highlights
        </h2>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="highlightsEyebrow" className={labelClassName}>
              Eyebrow
            </label>
            <input
              id="highlightsEyebrow"
              name="highlightsEyebrow"
              type="text"
              defaultValue={content.highlightsEyebrow}
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="highlightsTitle" className={labelClassName}>
              Section title
            </label>
            <input
              id="highlightsTitle"
              name="highlightsTitle"
              type="text"
              defaultValue={content.highlightsTitle}
              className={inputClassName}
            />
          </div>
        </div>

        <div>
          <label htmlFor="highlights" className={labelClassName}>
            What to expect cards{" "}
            <span className="normal-case text-neutral-500">
              (one per line, format: Title | Description)
            </span>
          </label>
          <textarea
            id="highlights"
            name="highlights"
            rows={8}
            defaultValue={highlightsToLines(content.highlights)}
            className={`${inputClassName} font-mono text-xs`}
          />
        </div>
      </section>

      <section className="space-y-4 border-t border-neutral-800 pt-6">
        <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-gold">
          Call To Action
        </h2>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="ctaEyebrow" className={labelClassName}>
              Eyebrow
            </label>
            <input
              id="ctaEyebrow"
              name="ctaEyebrow"
              type="text"
              defaultValue={content.ctaEyebrow}
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="ctaTitle" className={labelClassName}>
              Title
            </label>
            <input
              id="ctaTitle"
              name="ctaTitle"
              type="text"
              required
              defaultValue={content.ctaTitle}
              className={inputClassName}
            />
          </div>
        </div>

        <div>
          <label htmlFor="ctaDescription" className={labelClassName}>
            Description
          </label>
          <textarea
            id="ctaDescription"
            name="ctaDescription"
            rows={2}
            defaultValue={content.ctaDescription}
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="ctaButtonLabel" className={labelClassName}>
            Button label
          </label>
          <input
            id="ctaButtonLabel"
            name="ctaButtonLabel"
            type="text"
            required
            defaultValue={content.ctaButtonLabel}
            className={inputClassName}
          />
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-4 border-t border-neutral-800 pt-6">
        <button
          type="submit"
          disabled={pending}
          className="rounded bg-gold px-5 py-2.5 text-sm font-semibold text-neutral-950 transition-colors hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {pending ? "Saving..." : "Save Changes"}
        </button>

        <p aria-live="polite" className="text-sm text-red-300">
          {state.error}
        </p>

        {!state.error && state.success && (
          <p aria-live="polite" className="text-sm text-green-400">
            Saved. The About page has been updated.
          </p>
        )}
      </div>
    </form>
  );
}
