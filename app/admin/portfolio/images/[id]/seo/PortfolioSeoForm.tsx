"use client";

import { useActionState } from "react";
import Link from "next/link";
import StorySeoForm from "@/src/components/admin/portfolio-story/StorySeoForm";
import type { StorySeoDraft } from "@/src/components/admin/portfolio-story/types";
import {
  initialPortfolioSeoFormState,
  type PortfolioSeoFormState,
} from "./types";

export default function PortfolioSeoForm({
  action,
  initialSeo,
  cancelHref,
  publicUrl,
}: {
  action: (
    state: PortfolioSeoFormState,
    formData: FormData
  ) => Promise<PortfolioSeoFormState>;
  initialSeo: StorySeoDraft;
  cancelHref: string;
  publicUrl: string;
}) {
  const [state, formAction, pending] = useActionState(
    action,
    initialPortfolioSeoFormState
  );

  return (
    <form action={formAction} className="space-y-6">
      <div className="rounded border border-neutral-800 bg-neutral-900 p-5 sm:p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-neutral-400">
          Search metadata
        </h2>
        <StorySeoForm value={initialSeo} onChange={() => undefined} />
      </div>

      <div className="sticky bottom-0 flex flex-wrap items-center gap-4 rounded border border-neutral-800 bg-neutral-950 p-4 shadow-[0_-8px_24px_rgba(0,0,0,0.4)]">
        <button
          type="submit"
          disabled={pending}
          className="rounded bg-gold px-5 py-2.5 text-sm font-semibold text-neutral-950 transition-colors hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {pending ? "Saving..." : "Save SEO"}
        </button>

        <Link
          href={cancelHref}
          className="text-sm text-neutral-300 transition-colors hover:text-gold"
        >
          Cancel
        </Link>

        <Link
          href={publicUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-neutral-300 transition-colors hover:text-gold"
        >
          View public page &rarr;
        </Link>

        {state.message && (
          <p
            aria-live="polite"
            className={`text-sm ${
              state.status === "error" ? "text-red-300" : "text-emerald-400"
            }`}
          >
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}
