"use client";

import type { FormEvent } from "react";
import { deleteService } from "./actions";

export default function DeleteServiceButton({
  serviceId,
  serviceTitle,
  className = "",
}: {
  serviceId: string;
  serviceTitle: string;
  className?: string;
}) {
  const deleteServiceWithId = deleteService.bind(null, serviceId);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (
      !window.confirm(
        `Delete "${serviceTitle}"? This cannot be undone and will also remove its packages.`
      )
    ) {
      event.preventDefault();
    }
  }

  return (
    <form action={deleteServiceWithId} onSubmit={handleSubmit}>
      <button
        type="submit"
        className={`rounded border border-red-900/60 px-3 py-1.5 text-xs font-semibold text-red-400 transition-colors hover:border-red-500 hover:text-red-300 ${className}`}
      >
        Delete
      </button>
    </form>
  );
}
