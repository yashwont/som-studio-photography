"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createService } from "./actions";
import { initialNewServiceState } from "./types";

const inputClassName =
  "w-full rounded border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/40";

const labelClassName =
  "mb-1.5 block text-xs uppercase tracking-[0.15em] text-neutral-300";

export default function NewServiceForm() {
  const [state, formAction, pending] = useActionState(
    createService,
    initialNewServiceState
  );

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="title" className={labelClassName}>
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="slug" className={labelClassName}>
            Slug
          </label>
          <input
            id="slug"
            name="slug"
            type="text"
            required
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="category" className={labelClassName}>
            Category
          </label>
          <input id="category" name="category" type="text" className={inputClassName} />
        </div>

        <div>
          <label htmlFor="displayOrder" className={labelClassName}>
            Display order
          </label>
          <input
            id="displayOrder"
            name="displayOrder"
            type="number"
            required
            defaultValue={0}
            className={inputClassName}
          />
        </div>
      </div>

      <div>
        <label htmlFor="shortDescription" className={labelClassName}>
          Short description
        </label>
        <textarea
          id="shortDescription"
          name="shortDescription"
          required
          rows={2}
          className={inputClassName}
        />
      </div>

      <div>
        <label htmlFor="fullDescription" className={labelClassName}>
          Full description
        </label>
        <textarea
          id="fullDescription"
          name="fullDescription"
          rows={4}
          className={inputClassName}
        />
      </div>

      <div>
        <label htmlFor="highlights" className={labelClassName}>
          Highlights{" "}
          <span className="normal-case text-neutral-500">(one per line)</span>
        </label>
        <textarea
          id="highlights"
          name="highlights"
          rows={5}
          className={inputClassName}
        />
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-neutral-200">
          <input
            type="checkbox"
            name="featured"
            className="h-4 w-4 rounded border-neutral-600 bg-neutral-900 text-gold focus:ring-gold/40"
          />
          Featured
        </label>

        <label className="flex items-center gap-2 text-sm text-neutral-200">
          <input
            type="checkbox"
            name="active"
            defaultChecked
            className="h-4 w-4 rounded border-neutral-600 bg-neutral-900 text-gold focus:ring-gold/40"
          />
          Active
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-4 border-t border-neutral-800 pt-6">
        <button
          type="submit"
          disabled={pending}
          className="rounded bg-gold px-5 py-2.5 text-sm font-semibold text-neutral-950 transition-colors hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {pending ? "Creating..." : "Create Service"}
        </button>

        <Link
          href="/admin/services"
          className="text-sm text-neutral-300 transition-colors hover:text-gold"
        >
          Cancel
        </Link>

        <p aria-live="polite" className="text-sm text-red-300">
          {state.error}
        </p>
      </div>
    </form>
  );
}
