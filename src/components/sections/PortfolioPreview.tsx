"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Container from "@/src/components/layout/Container";
import SectionHeader from "@/src/components/ui/SectionHeader";
import type { PortfolioCategory } from "@/src/types/site";

const rotationMs = 3000;

function SpotlightThumb({
  category,
  active,
  positionClass,
  index,
}: {
  category: PortfolioCategory;
  active: boolean;
  positionClass: string;
  index: number;
}) {
  return (
    <Link
      href={`/portfolio#${category.slug}`}
      className={`portfolio-thumb-float group absolute block overflow-hidden rounded border border-white bg-white shadow-sm transition-all duration-500 ${positionClass} ${
        active
          ? "z-20 w-40 opacity-100 shadow-xl sm:w-52"
          : "z-10 w-32 opacity-45 hover:opacity-75 sm:w-40"
      }`}
      style={{ animationDelay: `${index * 0.4}s` }}
    >
      <span className="relative block aspect-[4/5] overflow-hidden">
        <Image
          src={category.image.src}
          alt={category.image.alt}
          fill
          sizes="(max-width: 640px) 128px, 208px"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </span>
      <span className="absolute inset-x-0 bottom-0 bg-white/90 px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-700 backdrop-blur-sm">
        {category.title}
      </span>
    </Link>
  );
}

function SpotlightFrame({ category }: { category: PortfolioCategory }) {
  return (
    <Link
      href={`/portfolio#${category.slug}`}
      className="group relative block overflow-hidden rounded-[2rem] border border-white bg-white shadow-2xl"
    >
      <div className="relative aspect-[4/5] sm:aspect-[5/4] lg:aspect-[16/10]">
        <Image
          key={category.image.src}
          src={category.image.src}
          alt={category.image.alt}
          fill
          priority
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 64vw"
          className="image-cycle object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/30 to-transparent" />

        <div className="absolute left-0 top-0 h-full w-full p-4 sm:p-6 lg:p-8">
          <div className="flex h-full flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="rounded-full border border-white/70 bg-white/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-700 backdrop-blur-sm">
                Session type
              </span>
              <span className="rounded-full border border-white/70 bg-white/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-500 backdrop-blur-sm">
                Every 3 sec
              </span>
            </div>

            <div className="max-w-xl">
              <div className="mb-3 h-px w-12 bg-gold" />
              <h3 className="text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
                {category.title}
              </h3>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-neutral-600 sm:text-base">
                {category.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function PortfolioPreview({
  categories,
}: {
  categories: PortfolioCategory[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeCategory = categories[activeIndex];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % categories.length);
    }, rotationMs);

    return () => window.clearInterval(timer);
  }, [categories.length]);

  return (
    <section id="portfolio" className="border-t border-neutral-200 bg-neutral-50">
      <Container>
        <div className="py-20 sm:py-28">
          <SectionHeader
            eyebrow="Portfolio"
            title="Explore our photography work"
            subtitle="Browse the session styles we cover, from studio portraits and family milestones to weddings, events, and product shoots."
            centered={true}
            className="mb-12 sm:mb-16"
          />

          <div className="relative mx-auto max-w-6xl">
            <div className="relative mx-auto max-w-4xl px-2 sm:px-6 lg:px-10">
              <SpotlightFrame category={activeCategory} />
            </div>

            <div className="pointer-events-none absolute inset-0">
              <div className="pointer-events-auto">
                <SpotlightThumb
                  category={categories[(activeIndex + 1) % categories.length]}
                  active={false}
                  positionClass="left-2 top-10 sm:left-8 sm:top-14"
                  index={1}
                />
                <SpotlightThumb
                  category={categories[(activeIndex + 2) % categories.length]}
                  active={false}
                  positionClass="right-3 top-20 sm:right-10 sm:top-24"
                  index={2}
                />
                <SpotlightThumb
                  category={categories[(activeIndex + 3) % categories.length]}
                  active={false}
                  positionClass="left-6 bottom-10 sm:left-14 sm:bottom-14"
                  index={3}
                />
                <SpotlightThumb
                  category={categories[(activeIndex + 4) % categories.length]}
                  active={false}
                  positionClass="right-4 bottom-20 sm:right-16 sm:bottom-20"
                  index={4}
                />
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {categories.map((category: PortfolioCategory, index: number) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`h-1.5 w-10 rounded-full transition-colors ${
                  index === activeIndex ? "bg-gold" : "bg-neutral-300"
                }`}
                aria-label={`Show ${category.title}`}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
