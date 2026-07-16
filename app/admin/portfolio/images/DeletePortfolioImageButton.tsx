"use client";

import type { FormEvent } from "react";
import { deletePortfolioImage } from "./actions";

export default function DeletePortfolioImageButton({
  imageId,
  imageTitle,
  className = "",
}: {
  imageId: string;
  imageTitle: string;
  className?: string;
}) {
  const deleteImageWithId = deletePortfolioImage.bind(null, imageId);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (
      !window.confirm(
        `Delete "${imageTitle}"? This also deletes its story content and removes it from the public portfolio. This cannot be undone.`
      )
    ) {
      event.preventDefault();
    }
  }

  return (
    <form action={deleteImageWithId} onSubmit={handleSubmit}>
      <button
        type="submit"
        className={`rounded border border-red-900/60 px-3 py-1.5 text-xs font-semibold text-red-400 transition-colors hover:border-red-500 hover:text-red-300 ${className}`}
      >
        Delete
      </button>
    </form>
  );
}
