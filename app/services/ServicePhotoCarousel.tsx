"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const ROTATE_INTERVAL_MS = 3500;

export function ServicePhotoPlaceholder({ title }: { title: string }) {
  return (
    <div
      role="img"
      aria-label={`${title} photo placeholder`}
      className="flex aspect-[16/9] w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-neutral-300 bg-gradient-to-br from-neutral-100 to-neutral-50 text-neutral-300"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-7 w-7"
        aria-hidden="true"
      >
        <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
        <circle cx="12" cy="13.5" r="3.5" />
      </svg>
      <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">
        Photo coming soon
      </span>
    </div>
  );
}

export default function ServicePhotoCarousel({
  title,
  imageUrls,
}: {
  title: string;
  imageUrls: string[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (imageUrls.length < 2) {
      return;
    }

    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % imageUrls.length);
    }, ROTATE_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [imageUrls.length]);

  if (imageUrls.length === 0) {
    return <ServicePhotoPlaceholder title={title} />;
  }

  return (
    <div className="group relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-neutral-100">
      {imageUrls.map((url, index) => (
        <Image
          key={url}
          src={url}
          alt={`${title} photo ${index + 1}`}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority={index === 0}
          className={`object-cover transition-all duration-1000 ease-in-out group-hover:scale-105 ${
            index === activeIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {imageUrls.length > 1 && (
        <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-1.5">
          {imageUrls.map((url, index) => (
            <span
              key={url}
              aria-hidden="true"
              className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
                index === activeIndex ? "bg-white" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
