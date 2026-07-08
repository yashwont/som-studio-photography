"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { getAdminServiceById } from "@/src/lib/db/admin-services";
import { updateService } from "./actions";
import { initialEditServiceState } from "./types";

type ServiceDetail = NonNullable<
  Awaited<ReturnType<typeof getAdminServiceById>>
>;

const inputClassName =
  "w-full rounded border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/40";

const labelClassName =
  "mb-1.5 block text-xs uppercase tracking-[0.15em] text-neutral-300";

export default function EditServiceForm({
  service,
}: {
  service: ServiceDetail;
}) {
  const updateServiceWithId = updateService.bind(null, service.id);
  const [state, formAction, pending] = useActionState(
    updateServiceWithId,
    initialEditServiceState
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
            defaultValue={service.title}
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
            defaultValue={service.slug}
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="category" className={labelClassName}>
            Category
          </label>
          <input
            id="category"
            name="category"
            type="text"
            defaultValue={service.category ?? ""}
            className={inputClassName}
          />
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
            defaultValue={service.displayOrder}
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
          defaultValue={service.shortDescription}
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
          defaultValue={service.fullDescription ?? ""}
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
          defaultValue={service.highlights.join("\n")}
          className={inputClassName}
        />
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-neutral-200">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={service.featured}
            className="h-4 w-4 rounded border-neutral-600 bg-neutral-900 text-gold focus:ring-gold/40"
          />
          Featured
        </label>

        <label className="flex items-center gap-2 text-sm text-neutral-200">
          <input
            type="checkbox"
            name="active"
            defaultChecked={service.active}
            className="h-4 w-4 rounded border-neutral-600 bg-neutral-900 text-gold focus:ring-gold/40"
          />
          Active
        </label>
      </div>

      <div className="rounded border border-neutral-800 bg-neutral-900/60 p-4 text-sm text-neutral-400">
        Package management will be added later.
      </div>

      <div className="flex flex-wrap items-center gap-4 border-t border-neutral-800 pt-6">
        <button
          type="submit"
          disabled={pending}
          className="rounded bg-gold px-5 py-2.5 text-sm font-semibold text-neutral-950 transition-colors hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {pending ? "Saving..." : "Save Changes"}
        </button>

        <Link
          href={`/admin/services/${service.id}`}
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
