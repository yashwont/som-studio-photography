"use client";

import type { FormEvent } from "react";
import { deletePortfolioStory } from "@/app/admin/portfolio/images/[id]/story/actions";

export default function DeleteStoryButton({
  imageId,
  workTitle,
}: {
  imageId: string;
  workTitle: string;
}) {
  const deleteStoryWithId = deletePortfolioStory.bind(null, imageId);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (
      !window.confirm(
        `Delete the extended story content for "${workTitle}"? The portfolio item, cover image, and listing card are not affected. This cannot be undone.`
      )
    ) {
      event.preventDefault();
    }
  }

  return (
    <form action={deleteStoryWithId} onSubmit={handleSubmit}>
      <button
        type="submit"
        className="rounded border border-red-900/60 px-4 py-2 text-sm font-semibold text-red-400 transition-colors hover:border-red-500 hover:text-red-300"
      >
        Delete Story Content
      </button>
    </form>
  );
}
