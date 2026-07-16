"use client";

import { useActionState, useState } from "react";
import { updateHomeServices } from "./actions";
import { initialEditHomeServicesState } from "./types";
import type { HomeContentData } from "@/src/lib/db/home";

const inputClassName =
  "w-full rounded border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/40";

const labelClassName =
  "mb-1.5 block text-xs uppercase tracking-[0.15em] text-neutral-300";

type CardDraft = { clientId: string; title: string; tagline: string };

function createEmptyCard(): CardDraft {
  return { clientId: crypto.randomUUID(), title: "", tagline: "" };
}

export default function ServicesForm({
  content,
  availableServiceTitles,
}: {
  content: HomeContentData;
  availableServiceTitles: string[];
}) {
  const [state, formAction, pending] = useActionState(
    updateHomeServices,
    initialEditHomeServicesState
  );

  const [cards, setCards] = useState<CardDraft[]>(() =>
    content.serviceCards.length > 0
      ? content.serviceCards.map((item) => ({ clientId: crypto.randomUUID(), ...item }))
      : [createEmptyCard()]
  );

  function updateCard(clientId: string, patch: Partial<CardDraft>) {
    setCards((current) =>
      current.map((item) => (item.clientId === clientId ? { ...item, ...patch } : item))
    );
  }

  function removeCard(clientId: string) {
    setCards((current) => current.filter((item) => item.clientId !== clientId));
  }

  return (
    <form action={formAction} className="space-y-8">
      {cards.map((item) => (
        <input key={`id-${item.clientId}`} type="hidden" name="cardIds" value={item.clientId} readOnly />
      ))}

      <div className="grid gap-6 sm:grid-cols-3">
        <div>
          <label htmlFor="servicesEyebrow" className={labelClassName}>
            Eyebrow
          </label>
          <input
            id="servicesEyebrow"
            name="servicesEyebrow"
            type="text"
            required
            defaultValue={content.servicesEyebrow}
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="servicesTitle" className={labelClassName}>
            Section title
          </label>
          <input
            id="servicesTitle"
            name="servicesTitle"
            type="text"
            required
            defaultValue={content.servicesTitle}
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="servicesSubtitle" className={labelClassName}>
            Subtitle
          </label>
          <input
            id="servicesSubtitle"
            name="servicesSubtitle"
            type="text"
            required
            defaultValue={content.servicesSubtitle}
            className={inputClassName}
          />
        </div>
      </div>

      <div>
        <p className={labelClassName}>Service cards</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {cards.map((item, index) => (
            <div
              key={item.clientId}
              className="space-y-3 rounded border border-neutral-800 bg-neutral-950/40 p-4"
            >
              <div className="flex items-center justify-between">
                <p className={labelClassName}>Card {index + 1}</p>
                <button
                  type="button"
                  onClick={() => removeCard(item.clientId)}
                  className="rounded border border-red-900/60 px-2.5 py-1 text-xs font-semibold text-red-400 transition-colors hover:border-red-500 hover:text-red-300"
                >
                  Remove
                </button>
              </div>

              <div>
                <label htmlFor={`cardTitle-${item.clientId}`} className={labelClassName}>
                  Title
                </label>
                <select
                  id={`cardTitle-${item.clientId}`}
                  name={`cardTitle__${item.clientId}`}
                  value={item.title}
                  onChange={(event) => updateCard(item.clientId, { title: event.target.value })}
                  className={inputClassName}
                >
                  <option value="">Select a service...</option>
                  {(item.title && !availableServiceTitles.includes(item.title)
                    ? [item.title, ...availableServiceTitles]
                    : availableServiceTitles
                  ).map((title) => (
                    <option key={title} value={title}>
                      {title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor={`cardTagline-${item.clientId}`} className={labelClassName}>
                  Tagline
                </label>
                <input
                  id={`cardTagline-${item.clientId}`}
                  name={`cardTagline__${item.clientId}`}
                  type="text"
                  value={item.tagline}
                  onChange={(event) => updateCard(item.clientId, { tagline: event.target.value })}
                  className={inputClassName}
                />
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setCards((current) => [...current, createEmptyCard()])}
          className="mt-3 rounded border border-dashed border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-300 transition-colors hover:border-gold hover:text-gold"
        >
          + Add Service Card
        </button>
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
