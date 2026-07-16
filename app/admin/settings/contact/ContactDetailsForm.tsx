"use client";

import { useActionState } from "react";
import { updateContactDetails } from "./actions";
import { initialEditContactDetailsState } from "./types";
import type { ContactInfo } from "@/src/types/site";

const inputClassName =
  "w-full rounded border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/40";

const labelClassName =
  "mb-1.5 block text-xs uppercase tracking-[0.15em] text-neutral-300";

export default function ContactDetailsForm({ contact }: { contact: ContactInfo }) {
  const [state, formAction, pending] = useActionState(
    updateContactDetails,
    initialEditContactDetailsState
  );

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className={labelClassName}>
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="text"
            required
            defaultValue={contact.phone}
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="whatsapp" className={labelClassName}>
            WhatsApp number
          </label>
          <input
            id="whatsapp"
            name="whatsapp"
            type="text"
            required
            defaultValue={contact.whatsapp}
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="email" className={labelClassName}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            defaultValue={contact.email}
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="address" className={labelClassName}>
            Street address
          </label>
          <input
            id="address"
            name="address"
            type="text"
            required
            defaultValue={contact.address}
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="city" className={labelClassName}>
            City
          </label>
          <input
            id="city"
            name="city"
            type="text"
            required
            defaultValue={contact.city}
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="country" className={labelClassName}>
            Country
          </label>
          <input
            id="country"
            name="country"
            type="text"
            required
            defaultValue={contact.country}
            className={inputClassName}
          />
        </div>
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
            Saved. Contact details have been updated everywhere they appear.
          </p>
        )}
      </div>
    </form>
  );
}
