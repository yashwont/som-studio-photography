"use client";

import { useActionState, useId, useState, type ChangeEvent } from "react";
import Link from "next/link";
import type { getAdminPortfolioCategoriesForSelect } from "@/src/lib/db/admin-portfolio";
import StoryPreviewPanel from "@/src/components/admin/portfolio-story/StoryPreviewPanel";
import { inputClassName, labelClassName } from "@/src/components/admin/portfolio-story/fieldStyles";
import type {
  EditableBlock,
  SessionDetailsDraft,
  StoryCtaDraft,
  StoryOverviewDraft,
} from "@/src/components/admin/portfolio-story/types";
import { initialPortfolioImageFormState, type PortfolioImageFormState } from "./types";
import BlogStoryBlocks from "./BlogStoryBlocks";

type CategoryOption = Awaited<
  ReturnType<typeof getAdminPortfolioCategoriesForSelect>
>[number];

const sectionCardClassName = "rounded border border-neutral-800 bg-neutral-900 p-5 sm:p-6";
const sectionHeadingClassName =
  "mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-neutral-400";

const PLACEHOLDER_IMAGE = "/images/visuals/studio.jpg";

function getSafePreviewUrl(value: string) {
  const trimmedUrl = value.trim();

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

export interface PortfolioImageFormCategoryFields {
  name: string;
  /** Present only when editing an existing story grouping, for preview links. */
  slug?: string;
  description: string;
  displayOrder: number;
}

export interface PortfolioImageFormInitialCover {
  categoryId: string;
  title: string;
  slug: string;
  imageUrl: string;
  altText: string;
  description: string;
  featured: boolean;
  active: boolean;
  displayOrder: number;
}

export interface PortfolioImageFormInitialStory {
  heroEyebrow: string;
  overview: StoryOverviewDraft;
  sessionDetails: SessionDetailsDraft;
  cta: StoryCtaDraft;
  blocks: EditableBlock[];
}

export default function PortfolioImageForm({
  mode,
  action,
  categories,
  categoryFields,
  cover,
  story,
  imageId,
  publicUrl,
  cancelHref,
  onCancel,
  submitLabel,
  pendingLabel,
}: {
  mode: "new" | "edit";
  action: (
    state: PortfolioImageFormState,
    formData: FormData
  ) => Promise<PortfolioImageFormState>;
  categories: CategoryOption[];
  /** When provided, renders portfolio story grouping fields above the cover card. */
  categoryFields?: PortfolioImageFormCategoryFields;
  cover: PortfolioImageFormInitialCover;
  story: PortfolioImageFormInitialStory;
  imageId?: string;
  publicUrl?: string;
  /** Navigates away - use for a standalone page. Omit in favor of `onCancel`
   * when this form is embedded inline (e.g. an expandable card) and "Cancel"
   * should just collapse it instead of navigating. */
  cancelHref?: string;
  onCancel?: () => void;
  submitLabel: string;
  pendingLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialPortfolioImageFormState);

  const [categoryId, setCategoryId] = useState(cover.categoryId);
  const [categoryName, setCategoryName] = useState(categoryFields?.name ?? "");
  const [categoryDescription, setCategoryDescription] = useState(
    categoryFields?.description ?? ""
  );
  const [title, setTitle] = useState(cover.title);
  const [description, setDescription] = useState(cover.description);
  const [altText, setAltText] = useState(cover.altText);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const urlPreview = getSafePreviewUrl(cover.imageUrl);

  const [heroEyebrow, setHeroEyebrow] = useState(story.heroEyebrow);
  const [overview, setOverview] = useState(story.overview);
  const [sessionDetails] = useState(story.sessionDetails);
  const [cta] = useState(story.cta);
  const [blocks, setBlocks] = useState(story.blocks);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setFilePreview(file ? URL.createObjectURL(file) : null);
  }

  const previewImageUrl = filePreview ?? urlPreview ?? PLACEHOLDER_IMAGE;
  const selectedCategory = categories.find((category) => category.id === categoryId);
  const previewCategoryName = categoryFields ? categoryName : selectedCategory?.name ?? "";
  const previewCategorySlug = categoryFields ? categoryFields.slug ?? "" : selectedCategory?.slug ?? "";
  const uid = useId();
  const formId = `${uid}-form`;

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_26rem] xl:items-start">
      <div>
        <form id={formId} action={formAction} className="space-y-6">
          {categoryFields && (
            <div className={sectionCardClassName}>
              <h2 className={sectionHeadingClassName}>Portfolio story</h2>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor={`${uid}-categoryName`} className={labelClassName}>
                    Title
                  </label>
                  <input
                    id={`${uid}-categoryName`}
                    name="categoryName"
                    type="text"
                    required
                    value={categoryName}
                    onChange={(event) => setCategoryName(event.target.value)}
                    className={inputClassName}
                  />
                </div>

                <div>
                  <label htmlFor={`${uid}-categoryDisplayOrder`} className={labelClassName}>
                    Display order
                  </label>
                  <input
                    id={`${uid}-categoryDisplayOrder`}
                    name="categoryDisplayOrder"
                    type="number"
                    min={1}
                    required
                    defaultValue={categoryFields.displayOrder + 1}
                    className={inputClassName}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor={`${uid}-categoryDescription`} className={labelClassName}>
                    Short description{" "}
                    <span className="normal-case text-neutral-500">
                      (shown on the public portfolio grid card)
                    </span>
                  </label>
                  <textarea
                    id={`${uid}-categoryDescription`}
                    name="categoryDescription"
                    rows={3}
                    value={categoryDescription}
                    onChange={(event) => setCategoryDescription(event.target.value)}
                    className={inputClassName}
                  />
                </div>
              </div>
            </div>
          )}

          {categoryFields && <input type="hidden" name="imageId" value={imageId ?? ""} />}

          <div className={sectionCardClassName}>
            <h2 className={sectionHeadingClassName}>Main photo</h2>
            <div className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                {!categoryFields && (
                  <div>
                    <label htmlFor={`${uid}-categoryId`} className={labelClassName}>
                      Portfolio section
                    </label>
                    <select
                      id={`${uid}-categoryId`}
                      name="categoryId"
                      required
                      value={categoryId}
                      onChange={(event) => setCategoryId(event.target.value)}
                      className={inputClassName}
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label htmlFor={`${uid}-title`} className={labelClassName}>
                    Photo title
                  </label>
                  <input
                    id={`${uid}-title`}
                    name="title"
                    type="text"
                    required
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    className={inputClassName}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor={`${uid}-heroEyebrow`} className={labelClassName}>
                    Hero eyebrow{" "}
                    <span className="normal-case text-neutral-500">
                      (optional - shown above the title at the top of the public page)
                    </span>
                  </label>
                  <input
                    id={`${uid}-heroEyebrow`}
                    name="heroEyebrow"
                    type="text"
                    value={heroEyebrow}
                    onChange={(event) => setHeroEyebrow(event.target.value)}
                    placeholder={`${previewCategoryName || "Portfolio"} Photography`}
                    className={inputClassName}
                  />
                </div>

                <input type="hidden" name="slug" value={cover.slug || title} readOnly />

                <div>
                  <label htmlFor={`${uid}-displayOrder`} className={labelClassName}>
                    Display order
                  </label>
                  <input
                    id={`${uid}-displayOrder`}
                    name="displayOrder"
                    type="number"
                    min={1}
                    required
                    defaultValue={cover.displayOrder + 1}
                    className={inputClassName}
                  />
                </div>
              </div>

              <div>
                <label htmlFor={`${uid}-imageFile`} className={labelClassName}>
                  {mode === "edit" ? "Replace image" : "Upload image"}
                </label>
                <input
                  id={`${uid}-imageFile`}
                  name="imageFile"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className={`${inputClassName} cursor-pointer`}
                />
                <p className="mt-1.5 text-xs text-neutral-500">
                  JPG, PNG, or WEBP, up to 5MB.
                  {mode === "edit" ? " Leave empty to keep the current image." : ""}
                </p>
              </div>

              <input type="hidden" name="imageUrl" value={cover.imageUrl} readOnly />

              <div>
                <span className={labelClassName}>Preview</span>
                <div
                  aria-label="Image preview"
                  role="img"
                  className="h-32 w-full rounded border border-neutral-800 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${JSON.stringify(previewImageUrl)})` }}
                />
              </div>

              <div>
                <label htmlFor={`${uid}-altText`} className={labelClassName}>
                  Alt text
                </label>
                <input
                  id={`${uid}-altText`}
                  name="altText"
                  type="text"
                  required
                  value={altText}
                  onChange={(event) => setAltText(event.target.value)}
                  className={inputClassName}
                />
              </div>

              <div>
                <label htmlFor={`${uid}-description`} className={labelClassName}>
                  Description
                </label>
                <textarea
                  id={`${uid}-description`}
                  name="description"
                  rows={3}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  className={inputClassName}
                />
              </div>

              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2 text-sm text-neutral-200">
                  <input
                    type="checkbox"
                    name="featured"
                    defaultChecked={cover.featured}
                    className="h-4 w-4 rounded border-neutral-600 bg-neutral-900 text-gold focus:ring-gold/40"
                  />
                  Featured
                </label>

                <label className="flex items-center gap-2 text-sm text-neutral-200">
                  <input
                    type="checkbox"
                    name="active"
                    defaultChecked={cover.active}
                    className="h-4 w-4 rounded border-neutral-600 bg-neutral-900 text-gold focus:ring-gold/40"
                  />
                  Active
                </label>
              </div>
            </div>
          </div>

          <input type="hidden" name="overviewEyebrow" value={overview.eyebrow} readOnly />
          <input type="hidden" name="overviewHeading" value={overview.heading} readOnly />
          <input type="hidden" name="studio" value={sessionDetails.studio} readOnly />
          <input type="hidden" name="service" value={sessionDetails.service} readOnly />
          <input type="hidden" name="location" value={sessionDetails.location} readOnly />
          <input type="hidden" name="style" value={sessionDetails.style} readOnly />
          <input type="hidden" name="setting" value={sessionDetails.setting} readOnly />
          <input type="hidden" name="ctaEyebrow" value={cta.eyebrow} readOnly />
          <input type="hidden" name="ctaHeading" value={cta.heading} readOnly />
          <input type="hidden" name="ctaBody" value={cta.body} readOnly />
          <input type="hidden" name="primaryCtaLabel" value={cta.primaryLabel} readOnly />
          <input type="hidden" name="secondaryCtaLabel" value={cta.secondaryLabel} readOnly />

          <div className={sectionCardClassName}>
            <h2 className={sectionHeadingClassName}>Opening paragraph</h2>
            <label htmlFor={`${uid}-overviewParagraphs`} className={labelClassName}>
              Paragraph after the main photo
            </label>
            <textarea
              id={`${uid}-overviewParagraphs`}
              name="overviewParagraphs"
              rows={7}
              value={overview.paragraphs}
              onChange={(event) =>
                setOverview({ ...overview, paragraphs: event.target.value })
              }
              placeholder="Write the first story paragraph that appears below the main photo."
              className={inputClassName}
            />
          </div>

          <div className={sectionCardClassName}>
            <h2 className={sectionHeadingClassName}>More photos and ending paragraph</h2>
            <BlogStoryBlocks
              blocks={blocks}
              onChange={setBlocks}
              errors={state.blockErrors}
            />
          </div>
        </form>

        {/* Outside the <form> so the sticky action bar can target the form by id. */}
        <div className="sticky bottom-0 flex flex-wrap items-center gap-4 rounded border border-neutral-800 bg-neutral-950 p-4 shadow-[0_-8px_24px_rgba(0,0,0,0.4)]">
          <button
            type="submit"
            form={formId}
            disabled={pending}
            className="rounded bg-gold px-5 py-2.5 text-sm font-semibold text-neutral-950 transition-colors hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {pending ? pendingLabel : submitLabel}
          </button>

          {cancelHref && (
            <Link
              href={cancelHref}
              className="text-sm text-neutral-300 transition-colors hover:text-gold"
            >
              Cancel
            </Link>
          )}

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="text-sm text-neutral-300 transition-colors hover:text-gold"
            >
              Cancel
            </button>
          )}

          {publicUrl && (
            <Link
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-neutral-300 transition-colors hover:text-gold"
            >
              View public page &rarr;
            </Link>
          )}

          {state.status === "error" && state.message && (
            <p aria-live="polite" className="text-sm text-red-300">
              {state.message}
            </p>
          )}
          {state.status === "success" && state.message && (
            <p aria-live="polite" className="text-sm text-emerald-400">
              {state.message}
            </p>
          )}
        </div>
      </div>

      <div className="xl:sticky xl:top-6">
        <StoryPreviewPanel
          categoryName={previewCategoryName}
          categorySlug={previewCategorySlug}
          title={title}
          summary={description}
          heroEyebrow={heroEyebrow}
          coverImageSrc={previewImageUrl}
          coverImageAlt={altText}
          overview={overview}
          sessionDetails={sessionDetails}
          blocks={blocks}
          cta={cta}
        />
      </div>
    </div>
  );
}
