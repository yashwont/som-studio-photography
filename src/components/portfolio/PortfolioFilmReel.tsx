"use client";

import Image from "next/image";
import type { PortfolioImage } from "@/src/lib/portfolio/public-portfolio";

/**
 * A 35mm filmstrip: charcoal film with brass perforations and framed photos,
 * flanked by two continuously spinning reels. The strip auto-advances and can
 * also be dragged / swiped / scrolled left and right. Auto-motion pauses while
 * the visitor interacts, and everything stills under prefers-reduced-motion.
 */
export default function PortfolioFilmReel({
  images,
  compact = false,
}: {
  images: PortfolioImage[];
  compact?: boolean;
}) {
  const stageClass = compact ? "reel-stage reel-compact" : "reel-stage";
  const frames = images.slice(0, 10);

  // Tripled so the CSS marquee can loop one complete copy seamlessly.
  const loop = frames.length ? [...frames, ...frames, ...frames] : [];

  if (frames.length === 0) {
    return (
      <div className={stageClass}>
        <div className="reel-strip" aria-hidden="true">
          <div className="reel-track">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="reel-cell">
                <div className="reel-photo reel-photo-empty" />
                <p className="reel-caption">Coming soon</p>
              </div>
            ))}
          </div>
        </div>
        <div className="film-can" aria-hidden="true">
          <span className="film-can-spool" />
          <span className="film-can-cap film-can-cap-top" />
          <span className="film-can-body" />
          <span className="film-can-cap film-can-cap-bottom" />
          <span className="film-can-mouth" />
        </div>
      </div>
    );
  }

  return (
    <div className={stageClass}>
      <div
        className="reel-strip"
        aria-label="Portfolio film strip"
        role="group"
      >
        <div className="reel-track">
          {loop.map((image: PortfolioImage, index: number) => {
            const n = (index % frames.length) + 1;
            return (
              <figure key={`${image.src}-${index}`} className="reel-cell">
                <div className="reel-photo">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    draggable={false}
                    priority={index < 2}
                    sizes="230px"
                    className="object-cover"
                  />
                </div>
                <figcaption className="reel-caption">
                  SOM · {String(n).padStart(2, "0")}
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>

      {/* 35mm film canister — the strip threads out of its front mouth */}
      <div className="film-can" aria-hidden="true">
        <span className="film-can-spool" />
        <span className="film-can-cap film-can-cap-top" />
        <span className="film-can-body" />
        <span className="film-can-cap film-can-cap-bottom" />
        <span className="film-can-mouth" />
      </div>

      <span className="reel-hint" aria-hidden="true">
        Film rolling
      </span>
    </div>
  );
}
