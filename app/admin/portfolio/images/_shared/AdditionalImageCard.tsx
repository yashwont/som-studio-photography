"use client";

import { useState } from "react";
import type { getAdminPortfolioCategoriesForSelect } from "@/src/lib/db/admin-portfolio";
import type { storyStateFrom } from "@/src/lib/db/admin-portfolio-story";
import DeletePortfolioImageButton from "../DeletePortfolioImageButton";
import { updatePortfolioImageWithStory } from "../[id]/edit/actions";
import { StatusBadge, FeaturedBadge, StoryStatusBadge } from "./Badges";
import PortfolioImageForm, {
  type PortfolioImageFormInitialCover,
  type PortfolioImageFormInitialStory,
} from "./PortfolioImageForm";

type CategoryOption = Awaited<
  ReturnType<typeof getAdminPortfolioCategoriesForSelect>
>[number];

function getSafeThumbnailUrl(imageUrl: string) {
  const trimmedUrl = imageUrl.trim();

  if (!trimmedUrl || trimmedUrl.includes('"') || trimmedUrl.includes("'")) {
    return null;
  }

  if (trimmedUrl.startsWith("/") && !trimmedUrl.startsWith("//")) {
    return trimmedUrl;
  }

  try {
    const url = new URL(trimmedUrl);
    return url.protocol === "http:" || url.protocol === "https:" ? trimmedUrl : null;
  } catch {
    return null;
  }
}

export default function AdditionalImageCard({
  imageId,
  title,
  slug,
  imageUrl,
  active,
  featured,
  storyState,
  categories,
  cover,
  story,
  hasExistingStory,
  defaultExpanded = false,
}: {
  imageId: string;
  title: string;
  slug: string;
  imageUrl: string;
  active: boolean;
  featured: boolean;
  storyState: ReturnType<typeof storyStateFrom>;
  categories: CategoryOption[];
  cover: PortfolioImageFormInitialCover;
  story: PortfolioImageFormInitialStory;
  hasExistingStory: boolean;
  defaultExpanded?: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const thumbnailUrl = getSafeThumbnailUrl(imageUrl);

  if (!isExpanded) {
    return (
      <div className="flex flex-col gap-4 rounded border border-neutral-800 bg-neutral-950 p-4 sm:flex-row sm:items-center">
        {thumbnailUrl ? (
          <div
            aria-label={`${title} thumbnail`}
            role="img"
            className="h-16 w-20 shrink-0 rounded border border-neutral-800 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${JSON.stringify(thumbnailUrl)})` }}
          />
        ) : (
          <div className="flex h-16 w-20 shrink-0 items-center justify-center rounded border border-neutral-800 bg-neutral-900 text-xs text-neutral-500">
            No preview
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-medium text-neutral-50">{title}</h3>
            <StatusBadge active={active} />
            <FeaturedBadge featured={featured} />
            <StoryStatusBadge state={storyState} />
          </div>
        </div>

        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="rounded border border-gold/40 px-3 py-1.5 text-xs font-semibold text-gold transition-colors hover:border-gold hover:bg-gold/10"
          >
            Edit
          </button>
          <DeletePortfolioImageButton imageId={imageId} imageTitle={title} />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded border border-neutral-800 bg-neutral-950 p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-neutral-400">
          {title}
        </h3>
        <button
          type="button"
          onClick={() => setIsExpanded(false)}
          className="rounded border border-neutral-700 px-3 py-1.5 text-xs font-semibold text-neutral-100 transition-colors hover:border-gold hover:text-gold"
        >
          Collapse
        </button>
      </div>

      <PortfolioImageForm
        mode="edit"
        action={updatePortfolioImageWithStory.bind(null, imageId)}
        categories={categories}
        imageId={imageId}
        publicUrl={`/portfolio/${slug}`}
        onCancel={() => setIsExpanded(false)}
        submitLabel="Save Image"
        pendingLabel="Saving..."
        hasExistingStory={hasExistingStory}
        cover={cover}
        story={story}
      />
    </div>
  );
}
