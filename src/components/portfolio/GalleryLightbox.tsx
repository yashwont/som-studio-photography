"use client";

import Image from "next/image";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { PortfolioImage } from "@/src/types/portfolio";

interface LightboxContextValue {
  images: PortfolioImage[];
  openAt: (id: string, trigger: HTMLElement | null) => void;
}

const LightboxContext = createContext<LightboxContextValue | null>(null);

export function LightboxProvider({
  images,
  children,
}: {
  images: PortfolioImage[];
  children: ReactNode;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastTriggerRef = useRef<HTMLElement | null>(null);

  const openAt = useCallback(
    (id: string, trigger: HTMLElement | null) => {
      const index = images.findIndex((image) => image.id === id);
      if (index === -1) {
        return;
      }
      lastTriggerRef.current = trigger;
      setActiveIndex(index);
    },
    [images]
  );

  const close = useCallback(() => {
    setActiveIndex(null);
    lastTriggerRef.current?.focus();
  }, []);

  const showPrev = useCallback(() => {
    setActiveIndex((current) =>
      current === null ? current : (current - 1 + images.length) % images.length
    );
  }, [images.length]);

  const showNext = useCallback(() => {
    setActiveIndex((current) =>
      current === null ? current : (current + 1) % images.length
    );
  }, [images.length]);

  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        close();
      } else if (event.key === "ArrowLeft") {
        showPrev();
      } else if (event.key === "ArrowRight") {
        showNext();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, close, showPrev, showNext]);

  const active = activeIndex !== null ? images[activeIndex] : null;

  return (
    <LightboxContext.Provider value={{ images, openAt }}>
      {children}
      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.caption ?? active.alt}
          className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/95 p-4 sm:p-8"
          onClick={close}
        >
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Close image viewer"
            onClick={close}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-lg text-white transition-colors hover:border-gold hover:text-gold sm:right-6 sm:top-6"
          >
            &times;
          </button>

          {images.length > 1 && (
            <button
              type="button"
              aria-label="Previous image"
              onClick={(event) => {
                event.stopPropagation();
                showPrev();
              }}
              className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:border-gold hover:text-gold sm:left-6"
            >
              &larr;
            </button>
          )}

          <div
            className="relative flex max-h-full w-full max-w-5xl flex-col items-center gap-3"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative h-[70vh] w-full">
              <Image
                src={active.src}
                alt={active.alt}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
            {active.caption && (
              <p className="max-w-2xl text-center text-sm text-white/80">
                {active.caption}
              </p>
            )}
          </div>

          {images.length > 1 && (
            <button
              type="button"
              aria-label="Next image"
              onClick={(event) => {
                event.stopPropagation();
                showNext();
              }}
              className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:border-gold hover:text-gold sm:right-6"
            >
              &rarr;
            </button>
          )}
        </div>
      )}
    </LightboxContext.Provider>
  );
}

export function LightboxTrigger({
  image,
  className,
  children,
}: {
  image: PortfolioImage;
  className?: string;
  children: ReactNode;
}) {
  const context = useContext(LightboxContext);

  return (
    <button
      type="button"
      onClick={(event) => context?.openAt(image.id, event.currentTarget)}
      aria-label={`View larger image: ${image.alt}`}
      className={className}
    >
      {children}
    </button>
  );
}
