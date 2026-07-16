"use client";

import { useActionState } from "react";
import { updateAfterInquiry } from "./actions";
import { initialEditAfterInquiryState } from "./types";
import type { ContactInfo } from "@/src/types/site";

const textareaClassName =
  "w-full rounded border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/40";

const labelClassName =
  "mb-1.5 block text-xs uppercase tracking-[0.15em] text-neutral-300";

export default function AfterInquiryForm({ contact }: { contact: ContactInfo }) {
  const [state, formAction, pending] = useActionState(
    updateAfterInquiry,
    initialEditAfterInquiryState
  );

  return (
    <form action={formAction} className="space-y-6">
      {contact.afterInquirySteps.map((step, index) => (
        <div key={index}>
          <label htmlFor={`step${index + 1}`} className={labelClassName}>
            Step {index + 1}
          </label>
          <textarea
            id={`step${index + 1}`}
            name={`step${index + 1}`}
            required
            rows={2}
            defaultValue={step}
            className={textareaClassName}
          />
        </div>
      ))}

      <p className="text-xs text-neutral-500">
        You can use {"{whatsapp}"}, {"{phone}"}, or {"{email}"} — they&apos;ll
        be replaced with the values from Contact Details automatically.
      </p>

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
            Saved. The &ldquo;After your inquiry&rdquo; steps have been updated.
          </p>
        )}
      </div>
    </form>
  );
}
