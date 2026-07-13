"use client";

import { useActionState } from "react";
import { updateAboutContent } from "./actions";
import { initialEditAboutContentState } from "./types";
import type { AboutContentData } from "@/src/lib/db/about";

const inputClassName =
  "w-full rounded border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/40";

const labelClassName =
  "mb-1.5 block text-xs uppercase tracking-[0.15em] text-neutral-300";

const HIGHLIGHT_COUNT = 4;
const TIMELINE_COUNT = 4;
const EXPERIENCE_STEP_COUNT = 5;
const STAT_COUNT = 4;

function getHighlight(content: AboutContentData, index: number) {
  return content.highlights[index] ?? { title: "", description: "" };
}

function getTimelineItem(content: AboutContentData, index: number) {
  return content.timeline[index] ?? { year: "", title: "", description: "" };
}

function getExperienceStep(content: AboutContentData, index: number) {
  return content.experienceSteps[index] ?? { title: "", description: "" };
}

function getStat(content: AboutContentData, index: number) {
  return content.stats[index] ?? { value: "", label: "" };
}

export default function AboutContentForm({
  content,
}: {
  content: AboutContentData;
}) {
  const [state, formAction, pending] = useActionState(
    updateAboutContent,
    initialEditAboutContentState
  );

  return (
    <form action={formAction} className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-gold">
          Hero
        </h2>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="heroEyebrow" className={labelClassName}>
              Eyebrow
            </label>
            <input
              id="heroEyebrow"
              name="heroEyebrow"
              type="text"
              defaultValue={content.heroEyebrow}
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="heroTitle" className={labelClassName}>
              Title
            </label>
            <input
              id="heroTitle"
              name="heroTitle"
              type="text"
              required
              defaultValue={content.heroTitle}
              className={inputClassName}
            />
          </div>
        </div>

        <div>
          <label htmlFor="heroSubtitle" className={labelClassName}>
            Subtitle
          </label>
          <textarea
            id="heroSubtitle"
            name="heroSubtitle"
            rows={2}
            defaultValue={content.heroSubtitle}
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="quoteText" className={labelClassName}>
            Hero quote{" "}
            <span className="normal-case text-neutral-500">
              (shown in the side panel next to the hero)
            </span>
          </label>
          <textarea
            id="quoteText"
            name="quoteText"
            required
            rows={2}
            defaultValue={content.quoteText}
            className={inputClassName}
          />
        </div>
      </section>

      <section className="space-y-4 border-t border-neutral-800 pt-6">
        <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-gold">
          Studio Story
        </h2>

        <div>
          <label htmlFor="storyParagraph1" className={labelClassName}>
            Paragraph 1
          </label>
          <textarea
            id="storyParagraph1"
            name="storyParagraph1"
            required
            rows={3}
            defaultValue={content.storyParagraph1}
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="storyParagraph2" className={labelClassName}>
            Paragraph 2
          </label>
          <textarea
            id="storyParagraph2"
            name="storyParagraph2"
            rows={3}
            defaultValue={content.storyParagraph2}
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="storyParagraph3" className={labelClassName}>
            Paragraph 3
          </label>
          <textarea
            id="storyParagraph3"
            name="storyParagraph3"
            rows={2}
            defaultValue={content.storyParagraph3}
            className={inputClassName}
          />
        </div>
      </section>

      <section className="space-y-4 border-t border-neutral-800 pt-6">
        <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-gold">
          Timeline
        </h2>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="timelineEyebrow" className={labelClassName}>
              Eyebrow
            </label>
            <input
              id="timelineEyebrow"
              name="timelineEyebrow"
              type="text"
              defaultValue={content.timelineEyebrow}
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="timelineTitle" className={labelClassName}>
              Section title
            </label>
            <input
              id="timelineTitle"
              name="timelineTitle"
              type="text"
              defaultValue={content.timelineTitle}
              className={inputClassName}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: TIMELINE_COUNT }, (_, index) => {
            const item = getTimelineItem(content, index);

            return (
              <div
                key={index}
                className="space-y-3 rounded border border-neutral-800 bg-neutral-950/40 p-4"
              >
                <p className={labelClassName}>Milestone {index + 1}</p>

                <div>
                  <label
                    htmlFor={`timeline-${index}-year`}
                    className={labelClassName}
                  >
                    Year
                  </label>
                  <input
                    id={`timeline-${index}-year`}
                    name={`timeline-${index}-year`}
                    type="text"
                    defaultValue={item.year}
                    className={inputClassName}
                  />
                </div>

                <div>
                  <label
                    htmlFor={`timeline-${index}-title`}
                    className={labelClassName}
                  >
                    Title
                  </label>
                  <input
                    id={`timeline-${index}-title`}
                    name={`timeline-${index}-title`}
                    type="text"
                    defaultValue={item.title}
                    className={inputClassName}
                  />
                </div>

                <div>
                  <label
                    htmlFor={`timeline-${index}-description`}
                    className={labelClassName}
                  >
                    Description
                  </label>
                  <textarea
                    id={`timeline-${index}-description`}
                    name={`timeline-${index}-description`}
                    rows={3}
                    defaultValue={item.description}
                    className={inputClassName}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="space-y-4 border-t border-neutral-800 pt-6">
        <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-gold">
          Highlights
        </h2>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="highlightsEyebrow" className={labelClassName}>
              Eyebrow
            </label>
            <input
              id="highlightsEyebrow"
              name="highlightsEyebrow"
              type="text"
              defaultValue={content.highlightsEyebrow}
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="highlightsTitle" className={labelClassName}>
              Section title
            </label>
            <input
              id="highlightsTitle"
              name="highlightsTitle"
              type="text"
              defaultValue={content.highlightsTitle}
              className={inputClassName}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: HIGHLIGHT_COUNT }, (_, index) => {
            const highlight = getHighlight(content, index);

            return (
              <div
                key={index}
                className="space-y-3 rounded border border-neutral-800 bg-neutral-950/40 p-4"
              >
                <p className={labelClassName}>Card {index + 1}</p>

                <div>
                  <label
                    htmlFor={`highlight-${index}-title`}
                    className={labelClassName}
                  >
                    Title
                  </label>
                  <input
                    id={`highlight-${index}-title`}
                    name={`highlight-${index}-title`}
                    type="text"
                    defaultValue={highlight.title}
                    className={inputClassName}
                  />
                </div>

                <div>
                  <label
                    htmlFor={`highlight-${index}-description`}
                    className={labelClassName}
                  >
                    Description
                  </label>
                  <textarea
                    id={`highlight-${index}-description`}
                    name={`highlight-${index}-description`}
                    rows={4}
                    defaultValue={highlight.description}
                    className={inputClassName}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="space-y-4 border-t border-neutral-800 pt-6">
        <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-gold">
          Studio Experience
        </h2>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="experienceEyebrow" className={labelClassName}>
              Eyebrow
            </label>
            <input
              id="experienceEyebrow"
              name="experienceEyebrow"
              type="text"
              defaultValue={content.experienceEyebrow}
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="experienceTitle" className={labelClassName}>
              Section title
            </label>
            <input
              id="experienceTitle"
              name="experienceTitle"
              type="text"
              defaultValue={content.experienceTitle}
              className={inputClassName}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: EXPERIENCE_STEP_COUNT }, (_, index) => {
            const step = getExperienceStep(content, index);

            return (
              <div
                key={index}
                className="space-y-3 rounded border border-neutral-800 bg-neutral-950/40 p-4"
              >
                <p className={labelClassName}>Step {index + 1}</p>

                <div>
                  <label
                    htmlFor={`experience-${index}-title`}
                    className={labelClassName}
                  >
                    Title
                  </label>
                  <input
                    id={`experience-${index}-title`}
                    name={`experience-${index}-title`}
                    type="text"
                    defaultValue={step.title}
                    className={inputClassName}
                  />
                </div>

                <div>
                  <label
                    htmlFor={`experience-${index}-description`}
                    className={labelClassName}
                  >
                    Description
                  </label>
                  <textarea
                    id={`experience-${index}-description`}
                    name={`experience-${index}-description`}
                    rows={3}
                    defaultValue={step.description}
                    className={inputClassName}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="space-y-4 border-t border-neutral-800 pt-6">
        <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-gold">
          Trust Stats
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: STAT_COUNT }, (_, index) => {
            const stat = getStat(content, index);

            return (
              <div
                key={index}
                className="space-y-3 rounded border border-neutral-800 bg-neutral-950/40 p-4"
              >
                <p className={labelClassName}>Stat {index + 1}</p>

                <div>
                  <label
                    htmlFor={`stat-${index}-value`}
                    className={labelClassName}
                  >
                    Value
                  </label>
                  <input
                    id={`stat-${index}-value`}
                    name={`stat-${index}-value`}
                    type="text"
                    defaultValue={stat.value}
                    className={inputClassName}
                  />
                </div>

                <div>
                  <label
                    htmlFor={`stat-${index}-label`}
                    className={labelClassName}
                  >
                    Label
                  </label>
                  <input
                    id={`stat-${index}-label`}
                    name={`stat-${index}-label`}
                    type="text"
                    defaultValue={stat.label}
                    className={inputClassName}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

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
            Saved. The About page has been updated.
          </p>
        )}
      </div>
    </form>
  );
}
