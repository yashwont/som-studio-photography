"use client";

import { useActionState, useState } from "react";
import { updateBusinessHours } from "./actions";
import { initialEditBusinessHoursState } from "./types";
import type { ContactInfo } from "@/src/types/site";

const inputClassName =
  "w-full rounded border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/40";

const labelClassName =
  "mb-1.5 block text-xs uppercase tracking-[0.15em] text-neutral-300";

type BusinessHoursDraft = {
  clientId: string;
  days: string;
  hours: string;
};

function createEmptyRow(): BusinessHoursDraft {
  return { clientId: crypto.randomUUID(), days: "", hours: "" };
}

export default function BusinessHoursForm({ contact }: { contact: ContactInfo }) {
  const [state, formAction, pending] = useActionState(
    updateBusinessHours,
    initialEditBusinessHoursState
  );
  const [rows, setRows] = useState<BusinessHoursDraft[]>(() =>
    contact.businessHours.length > 0
      ? contact.businessHours.map((entry) => ({ clientId: crypto.randomUUID(), ...entry }))
      : [createEmptyRow()]
  );

  function updateRow(clientId: string, patch: Partial<BusinessHoursDraft>) {
    setRows((current) =>
      current.map((row) => (row.clientId === clientId ? { ...row, ...patch } : row))
    );
  }

  function removeRow(clientId: string) {
    setRows((current) => current.filter((row) => row.clientId !== clientId));
  }

  return (
    <form action={formAction} className="space-y-6">
      {rows.map((row) => (
        <input
          key={`id-${row.clientId}`}
          type="hidden"
          name="rowIds"
          value={row.clientId}
          readOnly
        />
      ))}

      <div className="grid gap-4 sm:grid-cols-2">
        {rows.map((row, index) => (
          <div
            key={row.clientId}
            className="space-y-3 rounded border border-neutral-800 bg-neutral-950/40 p-4"
          >
            <div className="flex items-center justify-between">
              <p className={labelClassName}>Row {index + 1}</p>
              <button
                type="button"
                onClick={() => removeRow(row.clientId)}
                className="rounded border border-red-900/60 px-2.5 py-1 text-xs font-semibold text-red-400 transition-colors hover:border-red-500 hover:text-red-300"
              >
                Remove
              </button>
            </div>

            <div>
              <label htmlFor={`days-${row.clientId}`} className={labelClassName}>
                Days
              </label>
              <input
                id={`days-${row.clientId}`}
                name={`days__${row.clientId}`}
                type="text"
                placeholder="Sunday - Friday"
                value={row.days}
                onChange={(event) => updateRow(row.clientId, { days: event.target.value })}
                className={inputClassName}
              />
            </div>

            <div>
              <label htmlFor={`hours-${row.clientId}`} className={labelClassName}>
                Hours
              </label>
              <input
                id={`hours-${row.clientId}`}
                name={`hours__${row.clientId}`}
                type="text"
                placeholder="9:00 AM - 6:00 PM"
                value={row.hours}
                onChange={(event) => updateRow(row.clientId, { hours: event.target.value })}
                className={inputClassName}
              />
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setRows((current) => [...current, createEmptyRow()])}
        className="rounded border border-dashed border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-300 transition-colors hover:border-gold hover:text-gold"
      >
        + Add Row
      </button>

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
