"use client";

import type { FormEvent } from "react";
import { deletePortfolioGallery } from "./actions";

export default function DeleteGalleryButton({
  serviceId,
  title,
  disabled,
}: {
  serviceId: string;
  title: string;
  disabled?: boolean;
}) {
  const deleteGalleryWithId = deletePortfolioGallery.bind(null, serviceId);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (
      !window.confirm(
        `Delete all gallery photos for "${title}"? This removes every photo from this category's gallery page.`
      )
    ) {
      event.preventDefault();
    }
  }

  return (
    <form action={deleteGalleryWithId} onSubmit={handleSubmit}>
      <button
        type="submit"
        disabled={disabled}
        className="rounded border border-red-900/60 px-3 py-1.5 text-xs font-semibold text-red-400 transition-colors hover:border-red-500 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-30"
      >
        Delete Gallery
      </button>
    </form>
  );
}
