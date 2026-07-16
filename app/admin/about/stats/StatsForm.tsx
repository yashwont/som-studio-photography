"use client";

import { useActionState, useState } from "react";
import { updateAboutStats } from "./actions";
import { initialEditAboutStatsState } from "./types";
import type { AboutContentData } from "@/src/lib/db/about";

const inputClassName =
  "w-full rounded border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/40";

const labelClassName =
  "mb-1.5 block text-xs uppercase tracking-[0.15em] text-neutral-300";

type StatDraft = {
  clientId: string;
  value: string;
  label: string;
};

function createEmptyStat(): StatDraft {
  return { clientId: crypto.randomUUID(), value: "", label: "" };
}

export default function StatsForm({ content }: { content: AboutContentData }) {
  const [state, formAction, pending] = useActionState(
    updateAboutStats,
    initialEditAboutStatsState
  );
  const [stats, setStats] = useState<StatDraft[]>(() =>
    content.stats.length > 0
      ? content.stats.map((item) => ({ clientId: crypto.randomUUID(), ...item }))
      : [createEmptyStat()]
  );

  function updateStat(clientId: string, patch: Partial<StatDraft>) {
    setStats((current) =>
      current.map((item) => (item.clientId === clientId ? { ...item, ...patch } : item))
    );
  }

  function removeStat(clientId: string) {
    setStats((current) => current.filter((item) => item.clientId !== clientId));
  }

  return (
    <form action={formAction} className="space-y-6">
      {stats.map((item) => (
        <input
          key={`id-${item.clientId}`}
          type="hidden"
          name="statIds"
          value={item.clientId}
          readOnly
        />
      ))}

      <div className="grid gap-4 sm:grid-cols-2">
        {stats.map((item, index) => (
          <div
            key={item.clientId}
            className="space-y-3 rounded border border-neutral-800 bg-neutral-950/40 p-4"
          >
            <div className="flex items-center justify-between">
              <p className={labelClassName}>Stat {index + 1}</p>
              <button
                type="button"
                onClick={() => removeStat(item.clientId)}
                className="rounded border border-red-900/60 px-2.5 py-1 text-xs font-semibold text-red-400 transition-colors hover:border-red-500 hover:text-red-300"
              >
                Remove
              </button>
            </div>

            <div>
              <label htmlFor={`value-${item.clientId}`} className={labelClassName}>
                Value
              </label>
              <input
                id={`value-${item.clientId}`}
                name={`value__${item.clientId}`}
                type="text"
                value={item.value}
                onChange={(event) => updateStat(item.clientId, { value: event.target.value })}
                className={inputClassName}
              />
            </div>

            <div>
              <label htmlFor={`label-${item.clientId}`} className={labelClassName}>
                Label
              </label>
              <input
                id={`label-${item.clientId}`}
                name={`label__${item.clientId}`}
                type="text"
                value={item.label}
                onChange={(event) => updateStat(item.clientId, { label: event.target.value })}
                className={inputClassName}
              />
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setStats((current) => [...current, createEmptyStat()])}
        className="rounded border border-dashed border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-300 transition-colors hover:border-gold hover:text-gold"
      >
        + Add Stat
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
