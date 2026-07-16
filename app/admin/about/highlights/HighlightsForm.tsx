"use client";

import { useActionState, useState } from "react";
import { updateAboutHighlights } from "./actions";
import { initialEditAboutHighlightsState } from "./types";
import type { AboutContentData } from "@/src/lib/db/about";

const inputClassName =
  "w-full rounded border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/40";

const labelClassName =
  "mb-1.5 block text-xs uppercase tracking-[0.15em] text-neutral-300";

type HighlightDraft = {
  clientId: string;
  title: string;
  description: string;
};

function createEmptyHighlight(): HighlightDraft {
  return { clientId: crypto.randomUUID(), title: "", description: "" };
}

export default function HighlightsForm({ content }: { content: AboutContentData }) {
  const [state, formAction, pending] = useActionState(
    updateAboutHighlights,
    initialEditAboutHighlightsState
  );
  const [highlights, setHighlights] = useState<HighlightDraft[]>(() =>
    content.highlights.length > 0
      ? content.highlights.map((item) => ({ clientId: crypto.randomUUID(), ...item }))
      : [createEmptyHighlight()]
  );

  function updateHighlight(clientId: string, patch: Partial<HighlightDraft>) {
    setHighlights((current) =>
      current.map((item) => (item.clientId === clientId ? { ...item, ...patch } : item))
    );
  }

  function removeHighlight(clientId: string) {
    setHighlights((current) => current.filter((item) => item.clientId !== clientId));
  }

  return (
    <form action={formAction} className="space-y-6">
      {highlights.map((item) => (
        <input
          key={`id-${item.clientId}`}
          type="hidden"
          name="highlightIds"
          value={item.clientId}
          readOnly
        />
      ))}

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="highlightsEyebrow" className={labelClassName}>
            Eyebrow
          </label>
          <input
            id="highlightsEyebrow"
            name="highlightsEyebrow"
            type="text"
            defaultValue={content.highlightsEyebrow}
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="highlightsTitle" className={labelClassName}>
            Section title
          </label>
          <input
            id="highlightsTitle"
            name="highlightsTitle"
            type="text"
            defaultValue={content.highlightsTitle}
            className={inputClassName}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {highlights.map((item, index) => (
          <div
            key={item.clientId}
            className="space-y-3 rounded border border-neutral-800 bg-neutral-950/40 p-4"
          >
            <div className="flex items-center justify-between">
              <p className={labelClassName}>Card {index + 1}</p>
              <button
                type="button"
                onClick={() => removeHighlight(item.clientId)}
                className="rounded border border-red-900/60 px-2.5 py-1 text-xs font-semibold text-red-400 transition-colors hover:border-red-500 hover:text-red-300"
              >
                Remove
              </button>
            </div>

            <div>
              <label htmlFor={`title-${item.clientId}`} className={labelClassName}>
                Title
              </label>
              <input
                id={`title-${item.clientId}`}
                name={`title__${item.clientId}`}
                type="text"
                value={item.title}
                onChange={(event) => updateHighlight(item.clientId, { title: event.target.value })}
                className={inputClassName}
              />
            </div>

            <div>
              <label htmlFor={`description-${item.clientId}`} className={labelClassName}>
                Description
              </label>
              <textarea
                id={`description-${item.clientId}`}
                name={`description__${item.clientId}`}
                rows={4}
                value={item.description}
                onChange={(event) =>
                  updateHighlight(item.clientId, { description: event.target.value })
                }
                className={inputClassName}
              />
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setHighlights((current) => [...current, createEmptyHighlight()])}
        className="rounded border border-dashed border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-300 transition-colors hover:border-gold hover:text-gold"
      >
        + Add Highlight
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
