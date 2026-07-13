"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { studioGallery } from "@/src/data/visuals";
import type { SiteImage } from "@/src/types/site";

const rotationMs = 3000;

export default function AboutShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % studioGallery.length);
    }, rotationMs);

    return () => window.clearInterval(timer);
  }, []);

  const leftImage = studioGallery[(activeIndex + 1) % studioGallery.length];
  const rightImage = studioGallery[(activeIndex + 2) % studioGallery.length];
  const activeImage = studioGallery[activeIndex];

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="absolute -top-px left-0 h-px w-3/4 bg-gradient-to-r from-gold to-transparent"
      />

      <div className="relative overflow-hidden rounded-[2rem] border border-neutral-200 bg-neutral-50 p-4 shadow-[0_20px_60px_rgb(15_15_15_/0.06)] sm:h-[360px] sm:p-6">
        <div className="absolute inset-x-4 top-4 h-14 rounded-full border border-neutral-200 bg-white/75 shadow-sm sm:inset-x-6 sm:top-6" />
        <div className="absolute inset-x-4 bottom-4 h-14 rounded-full border border-neutral-200 bg-white/75 shadow-sm sm:inset-x-6 sm:bottom-6" />
        <div className="absolute left-4 top-4 h-[calc(100%-2rem)] w-14 rounded-full border border-neutral-200 bg-white/60 shadow-sm sm:left-6 sm:top-6" />
        <div className="absolute right-4 top-4 h-[calc(100%-2rem)] w-14 rounded-full border border-neutral-200 bg-white/60 shadow-sm sm:right-6 sm:top-6" />

        <div className="absolute left-1/2 top-1/2 h-[76%] w-[66%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[1.75rem] border border-white bg-white shadow-2xl transition-all duration-700 sm:w-[58%]">
          <Image
            key={activeImage.src}
            src={activeImage.src}
            alt={activeImage.alt}
            fill
            sizes="(max-width: 1024px) 66vw, 28vw"
            className="image-cycle object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/35 via-transparent to-transparent" />
          <div className="about-scanline pointer-events-none absolute left-0 top-0 h-14 w-full border-b border-gold/40 bg-gradient-to-b from-gold/10 to-transparent" />

          <div className="absolute left-4 top-4 rounded-full border border-white/80 bg-white/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-900 backdrop-blur-sm">
            About the studio
          </div>
          <div className="absolute bottom-4 left-4 rounded-full border border-white/80 bg-white/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-900 backdrop-blur-sm">
            Slide {activeIndex + 1} of {studioGallery.length}
          </div>
        </div>

        <div className="about-frame-float absolute left-6 top-10 h-24 w-20 overflow-hidden rounded-[1.25rem] border border-white bg-white shadow-lg sm:h-28 sm:w-24">
          <Image
            src={leftImage.src}
            alt={leftImage.alt}
            fill
            sizes="(max-width: 640px) 80px, 96px"
            className="object-cover"
          />
        </div>

        <div className="about-frame-float-delay absolute bottom-12 right-6 h-28 w-24 overflow-hidden rounded-[1.25rem] border border-white bg-white shadow-lg sm:h-32 sm:w-28">
          <Image
            src={rightImage.src}
            alt={rightImage.alt}
            fill
            sizes="(max-width: 640px) 96px, 112px"
            className="object-cover"
          />
        </div>

        <div className="absolute left-1/2 bottom-16 flex -translate-x-1/2 gap-2 sm:bottom-20">
          {studioGallery.map((image: SiteImage, index: number) => (
            <span
              key={image.src}
              aria-hidden="true"
              className={`h-1.5 w-8 rounded-full transition-colors ${
                index === activeIndex ? "bg-gold" : "bg-neutral-300"
              }`}
            />
          ))}
        </div>

        <p className="absolute bottom-7 left-1/2 max-w-[18rem] -translate-x-1/2 text-center text-[10px] uppercase tracking-[0.22em] text-neutral-900">
          Studio, lighting, and guided sessions
        </p>
      </div>

      <div
        aria-hidden="true"
        className="absolute -bottom-px right-0 h-px w-3/4 bg-gradient-to-l from-gold/50 to-transparent"
      />
    </div>
  );
}
