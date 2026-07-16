export type GooglePlaceReview = {
  name: string;
  quote: string;
  context: string;
  rating: number;
};

export type GooglePlaceSyncResult =
  | {
      ok: true;
      rating: number | null;
      reviewCount: number | null;
      reviews: GooglePlaceReview[];
    }
  | { ok: false; error: string };

/** Pulls the lat/lng out of a Google Maps place URL, e.g. the
 * `@27.7424254,85.3317994` or `!3d27.7424254!4d85.3317994` segments. */
function extractLatLngFromMapsUrl(url: string): { lat: number; lng: number } | null {
  const atMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);

  if (atMatch) {
    return { lat: Number(atMatch[1]), lng: Number(atMatch[2]) };
  }

  const dMatch = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);

  if (dMatch) {
    return { lat: Number(dMatch[1]), lng: Number(dMatch[2]) };
  }

  return null;
}

/** Pulls the business name out of a Google Maps place URL's /place/Name/ segment. */
function extractPlaceNameFromMapsUrl(url: string): string | null {
  const match = url.match(/\/maps\/place\/([^/@]+)/);

  if (!match) {
    return null;
  }

  return decodeURIComponent(match[1].replace(/\+/g, " "));
}

/** Looks up a business's Google rating and reviews using only its Google Maps
 * link (the same one already stored in Settings > Map) - no manual Place ID
 * entry needed. Requires GOOGLE_PLACES_API_KEY to be configured. */
export async function syncGooglePlaceReviews(mapsUrl: string): Promise<GooglePlaceSyncResult> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    return {
      ok: false,
      error: "GOOGLE_PLACES_API_KEY is not configured on the server.",
    };
  }

  const coords = extractLatLngFromMapsUrl(mapsUrl);
  const name = extractPlaceNameFromMapsUrl(mapsUrl);

  if (!coords || !name) {
    return {
      ok: false,
      error: "Could not read a business name and location from the Google Maps link in Settings > Map.",
    };
  }

  const findUrl = new URL("https://maps.googleapis.com/maps/api/place/findplacefromtext/json");
  findUrl.searchParams.set("input", name);
  findUrl.searchParams.set("inputtype", "textquery");
  findUrl.searchParams.set("locationbias", `point:${coords.lat},${coords.lng}`);
  findUrl.searchParams.set("fields", "place_id");
  findUrl.searchParams.set("key", apiKey);

  const findResponse = await fetch(findUrl, { cache: "no-store" });
  const findData = await findResponse.json();
  const placeId = findData.candidates?.[0]?.place_id;

  if (!placeId) {
    return {
      ok: false,
      error: `Could not find "${name}" on Google (${findData.status ?? "no match"}).`,
    };
  }

  const detailsUrl = new URL("https://maps.googleapis.com/maps/api/place/details/json");
  detailsUrl.searchParams.set("place_id", placeId);
  detailsUrl.searchParams.set("fields", "rating,user_ratings_total,reviews");
  detailsUrl.searchParams.set("key", apiKey);

  const detailsResponse = await fetch(detailsUrl, { cache: "no-store" });
  const detailsData = await detailsResponse.json();

  if (detailsData.status !== "OK") {
    return { ok: false, error: `Google Places error: ${detailsData.status}` };
  }

  type GoogleApiReview = {
    author_name?: string;
    text?: string;
    relative_time_description?: string;
    rating?: number;
  };

  const reviews: GooglePlaceReview[] = (detailsData.result?.reviews ?? []).map(
    (review: GoogleApiReview) => ({
      name: review.author_name ?? "",
      quote: review.text ?? "",
      context: review.relative_time_description ? `Google review - ${review.relative_time_description}` : "Google review",
      rating: Math.min(5, Math.max(1, Math.round(review.rating ?? 5))),
    })
  );

  return {
    ok: true,
    rating: typeof detailsData.result?.rating === "number" ? detailsData.result.rating : null,
    reviewCount:
      typeof detailsData.result?.user_ratings_total === "number"
        ? detailsData.result.user_ratings_total
        : null,
    reviews,
  };
}
