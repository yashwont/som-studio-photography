"use client";

import { useActionState, useState } from "react";
import { updateHomeHero } from "./actions";
import { initialEditHomeHeroState } from "./types";
import type { HomeContentData } from "@/src/lib/db/home";

const inputClassName =
  "w-full rounded border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/40";

const labelClassName =
  "mb-1.5 block text-xs uppercase tracking-[0.15em] text-neutral-300";

const addButtonClassName =
  "rounded border border-dashed border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-300 transition-colors hover:border-gold hover:text-gold";

type Draft = { clientId: string; value: string };

function createDraft(value = ""): Draft {
  return { clientId: crypto.randomUUID(), value };
}

export default function HeroContentForm({ content }: { content: HomeContentData }) {
  const [state, formAction, pending] = useActionState(
    updateHomeHero,
    initialEditHomeHeroState
  );

  const [trustPoints, setTrustPoints] = useState<Draft[]>(() =>
    content.heroTrustPoints.map((value) => createDraft(value))
  );

  function updateDraft(
    setter: React.Dispatch<React.SetStateAction<Draft[]>>,
    clientId: string,
    value: string
  ) {
    setter((current) =>
      current.map((item) => (item.clientId === clientId ? { ...item, value } : item))
    );
  }

  function removeDraft(setter: React.Dispatch<React.SetStateAction<Draft[]>>, clientId: string) {
    setter((current) => current.filter((item) => item.clientId !== clientId));
  }

  return (
    <form action={formAction} className="space-y-8">
      {trustPoints.map((item) => (
        <input key={`id-${item.clientId}`} type="hidden" name="trustPointIds" value={item.clientId} readOnly />
      ))}

      <div>
        <label htmlFor="heroWelcomeText" className={labelClassName}>
          Welcome text
        </label>
        <textarea
          id="heroWelcomeText"
          name="heroWelcomeText"
          required
          rows={5}
          defaultValue={content.heroWelcomeText}
          className={inputClassName}
        />
      </div>

      <div>
        <p className={labelClassName}>Trust points</p>
        <div className="space-y-3">
          {trustPoints.map((item, index) => (
            <div key={item.clientId} className="flex items-center gap-2">
              <input
                name={`trustPoint__${item.clientId}`}
                type="text"
                value={item.value}
                onChange={(event) => updateDraft(setTrustPoints, item.clientId, event.target.value)}
                placeholder={`Trust point ${index + 1}`}
                className={inputClassName}
              />
              <button
                type="button"
                onClick={() => removeDraft(setTrustPoints, item.clientId)}
                className="shrink-0 rounded border border-red-900/60 px-2.5 py-2 text-xs font-semibold text-red-400 transition-colors hover:border-red-500 hover:text-red-300"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setTrustPoints((current) => [...current, createDraft()])}
          className={`mt-3 ${addButtonClassName}`}
        >
          + Add Trust Point
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
