"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/src/lib/auth/admin";
import { saveHomeContent, type HomeReview } from "@/src/lib/db/home";
import { getContactInfo } from "@/src/lib/db/contact";
import { syncGooglePlaceReviews } from "@/src/lib/google-places";
import type { EditHomeReviewsState, SyncGoogleReviewsState } from "./types";

function readReviews(formData: FormData): HomeReview[] {
  const ids = formData.getAll("reviewIds").map(String);

  return ids
    .map((id) => {
      const ratingRaw = Number(formData.get(`reviewRating__${id}`));
      const rating = Number.isFinite(ratingRaw) ? Math.min(5, Math.max(1, Math.round(ratingRaw))) : 5;

      return {
        quote: String(formData.get(`reviewQuote__${id}`) ?? "").trim(),
        name: String(formData.get(`reviewName__${id}`) ?? "").trim(),
        context: String(formData.get(`reviewContext__${id}`) ?? "").trim(),
        rating,
      };
    })
    .filter((item) => item.quote || item.name);
}

export async function updateHomeReviews(
  _previousState: EditHomeReviewsState,
  formData: FormData
): Promise<EditHomeReviewsState> {
  await requireAdmin();

  const reviewsEyebrow = String(formData.get("reviewsEyebrow") ?? "").trim();
  const reviewsTitle = String(formData.get("reviewsTitle") ?? "").trim();
  const reviews = readReviews(formData);

  if (!reviewsEyebrow || !reviewsTitle) {
    return { error: "Eyebrow and title are both required.", success: false };
  }

  if (reviews.length === 0) {
    return { error: "At least one client review is required.", success: false };
  }

  if (reviews.some((item) => !item.quote || !item.name || !item.context)) {
    return {
      error: "Each review needs a quote, a name, and a context.",
      success: false,
    };
  }

  await saveHomeContent({ reviewsEyebrow, reviewsTitle, reviews });

  revalidatePath("/");
  revalidatePath("/admin/home/reviews");

  return { error: null, success: true };
}

export async function syncGoogleReviews(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- required by useActionState's action signature
  _previousState: SyncGoogleReviewsState
): Promise<SyncGoogleReviewsState> {
  await requireAdmin();

  const contact = await getContactInfo();
  const result = await syncGooglePlaceReviews(contact.mapUrl);

  if (!result.ok) {
    return {
      error: result.error,
      success: false,
      rating: null,
      reviewCount: null,
      reviews: [],
    };
  }

  await saveHomeContent({
    googleRating: result.rating,
    googleReviewCount: result.reviewCount,
    googleReviewsSyncedAt: new Date().toISOString(),
  });

  revalidatePath("/");
  revalidatePath("/admin/home/reviews");

  return {
    error: null,
    success: true,
    rating: result.rating,
    reviewCount: result.reviewCount,
    reviews: result.reviews,
  };
}
