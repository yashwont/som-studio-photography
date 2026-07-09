"use client";

import { useActionState } from "react";
import { updateInquiry } from "./actions";
import { initialUpdateInquiryState } from "./types";

const inputClassName =
  "w-full rounded border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/40";

const labelClassName =
  "mb-1.5 block text-xs uppercase tracking-[0.15em] text-neutral-300";

export default function UpdateInquiryForm({
  inquiryId,
  status,
  notes,
}: {
  inquiryId: string;
  status: string;
  notes: string | null;
}) {
  const updateInquiryWithId = updateInquiry.bind(null, inquiryId);
  const [state, formAction, pending] = useActionState(
    updateInquiryWithId,
    initialUpdateInquiryState
  );

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label htmlFor="status" className={labelClassName}>
          Status
        </label>
        <select
          id="status"
          name="status"
          required
          defaultValue={status}
          className={inputClassName}
        >
          <option value="NEW">New</option>
          <option value="CONTACTED">Contacted</option>
          <option value="BOOKED">Booked</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>

      <div>
        <label htmlFor="notes" className={labelClassName}>
          Admin notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={5}
          defaultValue={notes ?? ""}
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
      </div>
    </form>
  );
}
