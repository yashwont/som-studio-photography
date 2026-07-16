export type EditHomeReviewsState = {
  error: string | null;
  success: boolean;
};

export const initialEditHomeReviewsState: EditHomeReviewsState = {
  error: null,
  success: false,
};

export type GoogleSyncedReview = {
  name: string;
  quote: string;
  context: string;
  rating: number;
};

export type SyncGoogleReviewsState = {
  error: string | null;
  success: boolean;
  rating: number | null;
  reviewCount: number | null;
  reviews: GoogleSyncedReview[];
};

export const initialSyncGoogleReviewsState: SyncGoogleReviewsState = {
  error: null,
  success: false,
  rating: null,
  reviewCount: null,
  reviews: [],
};
