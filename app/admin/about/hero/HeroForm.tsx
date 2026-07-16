"use client";

import { useActionState } from "react";
import { updateAboutHero } from "./actions";
import { initialEditAboutHeroState } from "./types";
import type { AboutContentData } from "@/src/lib/db/about";

const inputClassName =
  "w-full rounded border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/40";

const labelClassName =
  "mb-1.5 block text-xs uppercase tracking-[0.15em] text-neutral-300";

export default function HeroForm({ content }: { content: AboutContentData }) {
  const [state, formAction, pending] = useActionState(
    updateAboutHero,
    initialEditAboutHeroState
  );

  return (
    <form action={formAction} className="space-y-6">
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

      <div>
        <label htmlFor="quoteText" className={labelClassName}>
          Hero quote{" "}
          <span className="normal-case text-neutral-500">
            (shown in the side panel next to the hero)
          </span>
        </label>
        <textarea
          id="quoteText"
          name="quoteText"
          required
          rows={2}
          defaultValue={content.quoteText}
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
