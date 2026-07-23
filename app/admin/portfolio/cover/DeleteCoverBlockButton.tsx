"use client";

import type { FormEvent } from "react";
import { deletePortfolioCoverBlock } from "./actions";

export default function DeleteCoverBlockButton({
  serviceId,
  title,
}: {
  serviceId: string;
  title: string;
}) {
  const deleteCoverBlockWithId = deletePortfolioCoverBlock.bind(null, serviceId);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (
      !window.confirm(
        `Delete "${title}" from the portfolio cover page? This also removes the matching service record.`
      )
    ) {
      event.preventDefault();
    }
  }

  return (
    <form action={deleteCoverBlockWithId} onSubmit={handleSubmit}>
      <button
        type="submit"
        className="rounded border border-red-900/60 px-4 py-2 text-sm font-semibold text-red-400 transition-colors hover:border-red-500 hover:text-red-300"
      >
        Delete
      </button>
    </form>
  );
}
