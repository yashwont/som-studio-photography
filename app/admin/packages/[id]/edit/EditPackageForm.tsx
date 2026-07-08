"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { getAdminServices } from "@/src/lib/db/admin-services";
import { updatePackage } from "./actions";
import { initialEditPackageState } from "./types";

type PackageFormValues = {
  id: string;
  name: string;
  price: number | null;
  description: string | null;
  inclusions: string[];
  active: boolean;
  displayOrder: number;
  service: { id: string; title: string };
};
type ServiceOption = Awaited<ReturnType<typeof getAdminServices>>[number];

const inputClassName =
  "w-full rounded border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/40";

const labelClassName =
  "mb-1.5 block text-xs uppercase tracking-[0.15em] text-neutral-300";

export default function EditPackageForm({
  pkg,
  services,
}: {
  pkg: PackageFormValues;
  services: ServiceOption[];
}) {
  const updatePackageWithId = updatePackage.bind(null, pkg.id);
  const [state, formAction, pending] = useActionState(
    updatePackageWithId,
    initialEditPackageState
  );

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="serviceId" className={labelClassName}>
            Service
          </label>
          <select
            id="serviceId"
            name="serviceId"
            required
            defaultValue={pkg.service.id}
            className={inputClassName}
          >
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="name" className={labelClassName}>
            Package name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={pkg.name}
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="price" className={labelClassName}>
            Price (NRS)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            placeholder="Leave blank for contact pricing"
            defaultValue={pkg.price ?? ""}
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
            defaultValue={pkg.displayOrder}
            className={inputClassName}
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className={labelClassName}>
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={pkg.description ?? ""}
          className={inputClassName}
        />
      </div>

      <div>
        <label htmlFor="inclusions" className={labelClassName}>
          Inclusions{" "}
          <span className="normal-case text-neutral-500">(one per line)</span>
        </label>
        <textarea
          id="inclusions"
          name="inclusions"
          rows={5}
          defaultValue={pkg.inclusions.join("\n")}
          className={inputClassName}
        />
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-neutral-200">
          <input
            type="checkbox"
            name="active"
            defaultChecked={pkg.active}
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
          {pending ? "Saving..." : "Save Changes"}
        </button>

        <Link
          href={`/admin/packages/${pkg.id}`}
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
