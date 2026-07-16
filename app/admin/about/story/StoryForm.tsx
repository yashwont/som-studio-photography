"use client";

import { useActionState } from "react";
import { updateAboutStory } from "./actions";
import { initialEditAboutStoryState } from "./types";
import type { AboutContentData } from "@/src/lib/db/about";

const inputClassName =
  "w-full rounded border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/40";

const labelClassName =
  "mb-1.5 block text-xs uppercase tracking-[0.15em] text-neutral-300";

export default function StoryForm({ content }: { content: AboutContentData }) {
  const [state, formAction, pending] = useActionState(
    updateAboutStory,
    initialEditAboutStoryState
  );

  return (
    <form action={formAction} className="space-y-6">
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
            Saved.
          </p>
        )}
      </div>
    </form>
  );
}
