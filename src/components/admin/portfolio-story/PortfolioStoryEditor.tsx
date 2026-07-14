"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { savePortfolioStory } from "@/app/admin/portfolio/images/[id]/story/actions";
import { initialSaveStoryState } from "@/app/admin/portfolio/images/[id]/story/types";
import StoryOverviewForm from "./StoryOverviewForm";
import SessionDetailsForm from "./SessionDetailsForm";
import StoryBlockBuilder from "./StoryBlockBuilder";
import StoryCtaForm from "./StoryCtaForm";
import StorySeoForm from "./StorySeoForm";
import StoryPreviewPanel from "./StoryPreviewPanel";
import DeleteStoryButton from "./DeleteStoryButton";
import type {
  EditableBlock,
  SessionDetailsDraft,
  StoryCtaDraft,
  StoryOverviewDraft,
  StorySeoDraft,
} from "./types";

export interface PortfolioReferenceInfo {
  title: string;
  categoryName: string;
  categorySlug: string;
  slug: string;
  description: string;
  coverImageSrc: string;
  coverImageAlt: string;
  publicUrl: string;
}

export interface PortfolioStoryEditorInitial {
  overview: StoryOverviewDraft;
  sessionDetails: SessionDetailsDraft;
  cta: StoryCtaDraft;
  seo: StorySeoDraft;
  blocks: EditableBlock[];
}

const sectionCardClassName = "rounded border border-neutral-800 bg-neutral-900 p-5 sm:p-6";
const sectionHeadingClassName =
  "mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-neutral-400";

function ReferenceSection({ reference }: { reference: PortfolioReferenceInfo }) {
  return (
    <div className={sectionCardClassName}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div
          aria-label={`${reference.title} cover`}
          role="img"
          className="h-24 w-32 shrink-0 rounded border border-neutral-800 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${JSON.stringify(reference.coverImageSrc)})` }}
        />
        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase tracking-[0.15em] text-neutral-500">
            {reference.categoryName} &middot; {reference.slug}
          </p>
          <h2 className="mt-1 text-lg font-semibold text-neutral-50">
            {reference.title}
          </h2>
          <p className="mt-1 line-clamp-2 text-sm text-neutral-400">
            {reference.description}
          </p>
        </div>
        <Link
          href={reference.publicUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded border border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-100 transition-colors hover:border-gold hover:text-gold"
        >
          View public page &rarr;
        </Link>
      </div>
      <p className="mt-4 text-xs text-neutral-500">
        Title, slug, category, cover image, and description are managed on the
        portfolio item&rsquo;s own edit page &mdash; not here.
      </p>
    </div>
  );
}

export default function PortfolioStoryEditor({
  imageId,
  reference,
  initial,
  hasExistingStory,
}: {
  imageId: string;
  reference: PortfolioReferenceInfo;
  initial: PortfolioStoryEditorInitial;
  hasExistingStory: boolean;
}) {
  const saveAction = savePortfolioStory.bind(null, imageId);
  const [state, formAction, pending] = useActionState(saveAction, initialSaveStoryState);

  const [overview, setOverview] = useState(initial.overview);
  const [sessionDetails, setSessionDetails] = useState(initial.sessionDetails);
  const [cta, setCta] = useState(initial.cta);
  const [seo, setSeo] = useState(initial.seo);
  const [blocks, setBlocks] = useState(initial.blocks);
  const [isDirty, setIsDirty] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Reset the dirty flag exactly once when a new (successful) action result comes
  // in - React's documented "adjusting state during rendering" pattern (using
  // state, not a ref, to track the previous value) rather than a setState-in-effect.
  const [handledState, setHandledState] = useState(state);
  if (state !== handledState) {
    setHandledState(state);
    if (state.status === "success" && isDirty) {
      setIsDirty(false);
    }
  }

  useEffect(() => {
    function handleBeforeUnload(event: BeforeUnloadEvent) {
      if (!isDirty) {
        return;
      }
      event.preventDefault();
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  function handleReset() {
    if (isDirty && !window.confirm("Discard all unsaved changes?")) {
      return;
    }

    setOverview(initial.overview);
    setSessionDetails(initial.sessionDetails);
    setCta(initial.cta);
    setSeo(initial.seo);
    setBlocks(initial.blocks);
    formRef.current?.reset();
    setIsDirty(false);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_26rem] xl:items-start">
      <form
        ref={formRef}
        action={formAction}
        onChange={() => setIsDirty(true)}
        className="space-y-6"
      >
        <ReferenceSection reference={reference} />

        <div className={sectionCardClassName}>
          <h2 className={sectionHeadingClassName}>Session overview</h2>
          <StoryOverviewForm value={overview} onChange={setOverview} />
        </div>

        <div className={sectionCardClassName}>
          <h2 className={sectionHeadingClassName}>Session details</h2>
          <SessionDetailsForm value={sessionDetails} onChange={setSessionDetails} />
        </div>

        <div className={sectionCardClassName}>
          <h2 className={sectionHeadingClassName}>Story blocks</h2>
          <StoryBlockBuilder
            blocks={blocks}
            onChange={(next) => {
              setBlocks(next);
              setIsDirty(true);
            }}
            errors={state.blockErrors}
          />
        </div>

        <div className={sectionCardClassName}>
          <h2 className={sectionHeadingClassName}>Booking CTA</h2>
          <StoryCtaForm value={cta} onChange={setCta} />
        </div>

        <div className={sectionCardClassName}>
          <h2 className={sectionHeadingClassName}>SEO</h2>
          <StorySeoForm value={seo} onChange={setSeo} />
        </div>

        <div className="sticky bottom-0 flex flex-wrap items-center gap-4 rounded border border-neutral-800 bg-neutral-950 p-4 shadow-[0_-8px_24px_rgba(0,0,0,0.4)]">
          <button
            type="submit"
            disabled={pending}
            className="rounded bg-gold px-5 py-2.5 text-sm font-semibold text-neutral-950 transition-colors hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {pending ? "Saving..." : "Save Story"}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="rounded border border-neutral-700 px-5 py-2.5 text-sm font-semibold text-neutral-100 transition-colors hover:border-gold hover:text-gold"
          >
            Reset unsaved changes
          </button>
          <Link
            href={reference.publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-neutral-300 transition-colors hover:text-gold"
          >
            View public page &rarr;
          </Link>
          {hasExistingStory && (
            <DeleteStoryButton imageId={imageId} workTitle={reference.title} />
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
      </form>

      <div className="xl:sticky xl:top-6">
        <StoryPreviewPanel
          categoryName={reference.categoryName}
          categorySlug={reference.categorySlug}
          title={reference.title}
          summary={reference.description}
          coverImageSrc={reference.coverImageSrc}
          coverImageAlt={reference.coverImageAlt}
          overview={overview}
          sessionDetails={sessionDetails}
          blocks={blocks}
          cta={cta}
        />
      </div>
    </div>
  );
}
