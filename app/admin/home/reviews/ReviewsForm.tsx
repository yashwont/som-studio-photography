"use client";

import { useActionState, useState } from "react";
import { updateHomeReviews, syncGoogleReviews } from "./actions";
import {
  initialEditHomeReviewsState,
  initialSyncGoogleReviewsState,
  type GoogleSyncedReview,
} from "./types";
import type { HomeContentData } from "@/src/lib/db/home";

const inputClassName =
  "w-full rounded border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/40";

const labelClassName =
  "mb-1.5 block text-xs uppercase tracking-[0.15em] text-neutral-300";

type ReviewDraft = { clientId: string; quote: string; name: string; context: string; rating: number };

function createEmptyReview(): ReviewDraft {
  return { clientId: crypto.randomUUID(), quote: "", name: "", context: "", rating: 5 };
}

function formatSyncedAt(iso: string | null): string | null {
  if (!iso) {
    return null;
  }

  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? null
    : date.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}

export default function ReviewsForm({ content }: { content: HomeContentData }) {
  const [state, formAction, pending] = useActionState(
    updateHomeReviews,
    initialEditHomeReviewsState
  );
  const [syncState, syncFormAction, syncPending] = useActionState(
    syncGoogleReviews,
    initialSyncGoogleReviewsState
  );
  const [addedFetchedIndexes, setAddedFetchedIndexes] = useState<number[]>([]);

  const [reviews, setReviews] = useState<ReviewDraft[]>(() =>
    content.reviews.length > 0
      ? content.reviews.map((item) => ({ clientId: crypto.randomUUID(), ...item }))
      : [createEmptyReview()]
  );

  function updateReview(clientId: string, patch: Partial<ReviewDraft>) {
    setReviews((current) =>
      current.map((item) => (item.clientId === clientId ? { ...item, ...patch } : item))
    );
  }

  function removeReview(clientId: string) {
    setReviews((current) => current.filter((item) => item.clientId !== clientId));
  }

  function addFetchedReview(review: GoogleSyncedReview, index: number) {
    setReviews((current) => [...current, { clientId: crypto.randomUUID(), ...review }]);
    setAddedFetchedIndexes((current) => [...current, index]);
  }

  const displayRating = syncState.success ? syncState.rating : content.googleRating;
  const displayReviewCount = syncState.success ? syncState.reviewCount : content.googleReviewCount;
  const syncedAtLabel = syncState.success ? "just now" : formatSyncedAt(content.googleReviewsSyncedAt);

  return (
    <>
      <form action={syncFormAction} className="mb-8 space-y-4 rounded border border-neutral-800 bg-neutral-950/40 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className={labelClassName}>Google reviews</p>
            {displayRating !== null ? (
              <p className="text-sm text-neutral-300">
                {displayRating.toFixed(1)} out of 5
                {displayReviewCount !== null ? ` - ${displayReviewCount} Google reviews` : ""}
                {syncedAtLabel ? (
                  <span className="text-neutral-500"> (synced {syncedAtLabel})</span>
                ) : null}
              </p>
            ) : (
              <p className="text-sm text-neutral-500">
                Not synced yet. This reads the business found at the Google Maps link in Settings &gt; Map.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={syncPending}
            className="shrink-0 rounded border border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-100 transition-colors hover:border-gold hover:text-gold disabled:cursor-not-allowed disabled:opacity-70"
          >
            {syncPending ? "Syncing..." : "Sync from Google"}
          </button>
        </div>

        {syncState.error && (
          <p aria-live="polite" className="text-sm text-red-300">
            {syncState.error}
          </p>
        )}

        {syncState.success && syncState.reviews.length === 0 && (
          <p aria-live="polite" className="text-sm text-neutral-500">
            Rating synced, but Google returned no written reviews for this business.
          </p>
        )}

        {syncState.reviews.length > 0 && (
          <div className="space-y-3">
            <p className={labelClassName}>Fetched reviews - add any you want to show below</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {syncState.reviews.map((review, index) => {
                const alreadyAdded = addedFetchedIndexes.includes(index);

                return (
                  <div
                    key={`${review.name}-${index}`}
                    className="space-y-2 rounded border border-neutral-800 bg-neutral-900 p-3"
                  >
                    <p className="text-xs text-neutral-500">{review.context}</p>
                    <p className="text-sm text-neutral-200">&ldquo;{review.quote}&rdquo;</p>
                    <p className="text-xs font-semibold text-neutral-400">
                      {review.name} - {review.rating}/5
                    </p>
                    <button
                      type="button"
                      disabled={alreadyAdded}
                      onClick={() => addFetchedReview(review, index)}
                      className="rounded border border-neutral-700 px-3 py-1.5 text-xs font-semibold text-neutral-100 transition-colors hover:border-gold hover:text-gold disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {alreadyAdded ? "Added" : "+ Add to reviews"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </form>

      <form action={formAction} className="space-y-8">
      {reviews.map((item) => (
        <input key={`id-${item.clientId}`} type="hidden" name="reviewIds" value={item.clientId} readOnly />
      ))}

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="reviewsEyebrow" className={labelClassName}>
            Eyebrow
          </label>
          <input
            id="reviewsEyebrow"
            name="reviewsEyebrow"
            type="text"
            required
            defaultValue={content.reviewsEyebrow}
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="reviewsTitle" className={labelClassName}>
            Section title
          </label>
          <input
            id="reviewsTitle"
            name="reviewsTitle"
            type="text"
            required
            defaultValue={content.reviewsTitle}
            className={inputClassName}
          />
        </div>
      </div>

      <div>
        <p className={labelClassName}>Client reviews</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {reviews.map((item, index) => (
            <div
              key={item.clientId}
              className="space-y-3 rounded border border-neutral-800 bg-neutral-950/40 p-4"
            >
              <div className="flex items-center justify-between">
                <p className={labelClassName}>Review {index + 1}</p>
                <button
                  type="button"
                  onClick={() => removeReview(item.clientId)}
                  className="rounded border border-red-900/60 px-2.5 py-1 text-xs font-semibold text-red-400 transition-colors hover:border-red-500 hover:text-red-300"
                >
                  Remove
                </button>
              </div>

              <div>
                <label htmlFor={`reviewQuote-${item.clientId}`} className={labelClassName}>
                  Quote
                </label>
                <textarea
                  id={`reviewQuote-${item.clientId}`}
                  name={`reviewQuote__${item.clientId}`}
                  rows={3}
                  value={item.quote}
                  onChange={(event) => updateReview(item.clientId, { quote: event.target.value })}
                  className={inputClassName}
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor={`reviewName-${item.clientId}`} className={labelClassName}>
                    Name
                  </label>
                  <input
                    id={`reviewName-${item.clientId}`}
                    name={`reviewName__${item.clientId}`}
                    type="text"
                    value={item.name}
                    onChange={(event) => updateReview(item.clientId, { name: event.target.value })}
                    className={inputClassName}
                  />
                </div>

                <div>
                  <label htmlFor={`reviewContext-${item.clientId}`} className={labelClassName}>
                    Context
                  </label>
                  <input
                    id={`reviewContext-${item.clientId}`}
                    name={`reviewContext__${item.clientId}`}
                    type="text"
                    value={item.context}
                    onChange={(event) => updateReview(item.clientId, { context: event.target.value })}
                    className={inputClassName}
                  />
                </div>
              </div>

              <div>
                <label htmlFor={`reviewRating-${item.clientId}`} className={labelClassName}>
                  Rating (1-5)
                </label>
                <input
                  id={`reviewRating-${item.clientId}`}
                  name={`reviewRating__${item.clientId}`}
                  type="number"
                  min={1}
                  max={5}
                  value={item.rating}
                  onChange={(event) =>
                    updateReview(item.clientId, { rating: Number(event.target.value) || 5 })
                  }
                  className={inputClassName}
                />
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setReviews((current) => [...current, createEmptyReview()])}
          className="mt-3 rounded border border-dashed border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-300 transition-colors hover:border-gold hover:text-gold"
        >
          + Add Review
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-4 border-t border-neutral-800 pt-6">
        <button
          type="submit"
          disabled={pending}
          className="rounded bg-gold px-5 py-2.5 text-sm font-semibold text-neutral-950 transition-colors hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {pending ? "Saving..." : "Save Changes"}
        </button>

        <p aria-live="polite" className="text-sm text-red-300">
          {state.error}
        </p>

        {!state.error && state.success && (
          <p aria-live="polite" className="text-sm text-green-400">
            Saved.
          </p>
        )}
      </div>
      </form>
    </>
  );
}
