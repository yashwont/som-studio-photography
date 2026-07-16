"use client";

import { useActionState } from "react";
import { updateMapInfo } from "./actions";
import { initialEditMapInfoState } from "./types";
import type { ContactInfo } from "@/src/types/site";

const inputClassName =
  "w-full rounded border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/40";

const labelClassName =
  "mb-1.5 block text-xs uppercase tracking-[0.15em] text-neutral-300";

export default function MapForm({ contact }: { contact: ContactInfo }) {
  const [state, formAction, pending] = useActionState(
    updateMapInfo,
    initialEditMapInfoState
  );

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label htmlFor="mapUrl" className={labelClassName}>
          Map link{" "}
          <span className="normal-case text-neutral-500">
            (the &ldquo;Open Map&rdquo; button - links out to Google Maps)
          </span>
        </label>
        <input
          id="mapUrl"
          name="mapUrl"
          type="text"
          defaultValue={contact.mapUrl}
          className={inputClassName}
        />
      </div>

      <div>
        <label htmlFor="mapEmbedUrl" className={labelClassName}>
          Map embed URL{" "}
          <span className="normal-case text-neutral-500">
            (used for the embedded map iframe)
          </span>
        </label>
        <input
          id="mapEmbedUrl"
          name="mapEmbedUrl"
          type="text"
          defaultValue={contact.mapEmbedUrl}
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
