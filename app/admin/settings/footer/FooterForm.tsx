"use client";

import { useActionState } from "react";
import { updateFooter } from "./actions";
import { initialEditFooterState } from "./types";
import type { ContactInfo } from "@/src/types/site";

const textareaClassName =
  "w-full rounded border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/40";

const labelClassName =
  "mb-1.5 block text-xs uppercase tracking-[0.15em] text-neutral-300";

export default function FooterForm({ contact }: { contact: ContactInfo }) {
  const [state, formAction, pending] = useActionState(
    updateFooter,
    initialEditFooterState
  );

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label htmlFor="footerDescription" className={labelClassName}>
          Footer description
        </label>
        <textarea
          id="footerDescription"
          name="footerDescription"
          required
          rows={5}
          defaultValue={contact.footerDescription}
          className={textareaClassName}
        />
        <p className="mt-1.5 text-xs text-neutral-500">
          You can use {"{city}"} and {"{country}"} — they&apos;ll be replaced
          with the values from Contact Details automatically.
        </p>
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
            Saved. The footer description has been updated.
          </p>
        )}
      </div>
    </form>
  );
}
