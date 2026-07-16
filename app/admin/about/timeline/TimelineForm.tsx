"use client";

import { useActionState, useState } from "react";
import { updateAboutTimeline } from "./actions";
import { initialEditAboutTimelineState } from "./types";
import type { AboutContentData } from "@/src/lib/db/about";

const inputClassName =
  "w-full rounded border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/40";

const labelClassName =
  "mb-1.5 block text-xs uppercase tracking-[0.15em] text-neutral-300";

type MilestoneDraft = {
  clientId: string;
  year: string;
  title: string;
  description: string;
};

function createEmptyMilestone(): MilestoneDraft {
  return { clientId: crypto.randomUUID(), year: "", title: "", description: "" };
}

export default function TimelineForm({ content }: { content: AboutContentData }) {
  const [state, formAction, pending] = useActionState(
    updateAboutTimeline,
    initialEditAboutTimelineState
  );
  const [milestones, setMilestones] = useState<MilestoneDraft[]>(() =>
    content.timeline.length > 0
      ? content.timeline.map((item) => ({ clientId: crypto.randomUUID(), ...item }))
      : [createEmptyMilestone()]
  );

  function updateMilestone(clientId: string, patch: Partial<MilestoneDraft>) {
    setMilestones((current) =>
      current.map((item) => (item.clientId === clientId ? { ...item, ...patch } : item))
    );
  }

  function removeMilestone(clientId: string) {
    setMilestones((current) => current.filter((item) => item.clientId !== clientId));
  }

  return (
    <form action={formAction} className="space-y-6">
      {milestones.map((item) => (
        <input
          key={`id-${item.clientId}`}
          type="hidden"
          name="milestoneIds"
          value={item.clientId}
          readOnly
        />
      ))}

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="timelineEyebrow" className={labelClassName}>
            Eyebrow
          </label>
          <input
            id="timelineEyebrow"
            name="timelineEyebrow"
            type="text"
            defaultValue={content.timelineEyebrow}
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="timelineTitle" className={labelClassName}>
            Section title
          </label>
          <input
            id="timelineTitle"
            name="timelineTitle"
            type="text"
            defaultValue={content.timelineTitle}
            className={inputClassName}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {milestones.map((item, index) => (
          <div
            key={item.clientId}
            className="space-y-3 rounded border border-neutral-800 bg-neutral-950/40 p-4"
          >
            <div className="flex items-center justify-between">
              <p className={labelClassName}>Milestone {index + 1}</p>
              <button
                type="button"
                onClick={() => removeMilestone(item.clientId)}
                className="rounded border border-red-900/60 px-2.5 py-1 text-xs font-semibold text-red-400 transition-colors hover:border-red-500 hover:text-red-300"
              >
                Remove
              </button>
            </div>

            <div>
              <label htmlFor={`year-${item.clientId}`} className={labelClassName}>
                Year
              </label>
              <input
                id={`year-${item.clientId}`}
                name={`year__${item.clientId}`}
                type="text"
                value={item.year}
                onChange={(event) => updateMilestone(item.clientId, { year: event.target.value })}
                className={inputClassName}
              />
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
                onChange={(event) => updateMilestone(item.clientId, { title: event.target.value })}
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
                rows={3}
                value={item.description}
                onChange={(event) =>
                  updateMilestone(item.clientId, { description: event.target.value })
                }
                className={inputClassName}
              />
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setMilestones((current) => [...current, createEmptyMilestone()])}
        className="rounded border border-dashed border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-300 transition-colors hover:border-gold hover:text-gold"
      >
        + Add Milestone
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
