"use client";

import type { FormEvent } from "react";
import { deleteCategory } from "./actions";

export default function DeleteCategoryButton({
  categoryId,
  categoryName,
  imageCount,
  className = "",
}: {
  categoryId: string;
  categoryName: string;
  imageCount: number;
  className?: string;
}) {
  const deleteCategoryWithId = deleteCategory.bind(null, categoryId);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const imageWarning =
      imageCount > 0
        ? ` This also deletes ${imageCount} image${imageCount === 1 ? "" : "s"} and all of their story content.`
        : "";

    if (
      !window.confirm(
        `Delete "${categoryName}"?${imageWarning} This cannot be undone.`
      )
    ) {
      event.preventDefault();
    }
  }

  return (
    <form action={deleteCategoryWithId} onSubmit={handleSubmit}>
      <button
        type="submit"
        className={`rounded border border-red-900/60 px-3 py-1.5 text-xs font-semibold text-red-400 transition-colors hover:border-red-500 hover:text-red-300 ${className}`}
      >
        Delete
      </button>
    </form>
  );
}
