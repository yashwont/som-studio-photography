"use client";

import { useActionState } from "react";
import { updateHomeFinalCta } from "./actions";
import { initialEditHomeFinalCtaState } from "./types";
import type { HomeContentData } from "@/src/lib/db/home";

const inputClassName =
  "w-full rounded border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/40";

const labelClassName =
  "mb-1.5 block text-xs uppercase tracking-[0.15em] text-neutral-300";

export default function FinalCtaForm({ content }: { content: HomeContentData }) {
  const [state, formAction, pending] = useActionState(
    updateHomeFinalCta,
    initialEditHomeFinalCtaState
  );

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label htmlFor="ctaEyebrow" className={labelClassName}>
          Eyebrow
        </label>
        <input
          id="ctaEyebrow"
          name="ctaEyebrow"
          type="text"
          required
          defaultValue={content.ctaEyebrow}
          className={inputClassName}
        />
      </div>

      <div>
        <label htmlFor="ctaHeadline" className={labelClassName}>
          Headline
        </label>
        <input
          id="ctaHeadline"
          name="ctaHeadline"
          type="text"
          required
          defaultValue={content.ctaHeadline}
          className={inputClassName}
        />
      </div>

      <div>
        <label htmlFor="ctaSubtitle" className={labelClassName}>
          Subtitle
        </label>
        <textarea
          id="ctaSubtitle"
          name="ctaSubtitle"
          required
          rows={3}
          defaultValue={content.ctaSubtitle}
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
