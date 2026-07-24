"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Container from "@/src/components/layout/Container";
import Button from "@/src/components/ui/Button";
import { heroGallery } from "@/src/data/visuals";
import type { HomeContentData } from "@/src/lib/db/home";
import type { ContactInfo, SiteImage } from "@/src/types/site";

const rotationMs = 3000;

export default function Hero({
  contact: contactInfo,
  content,
}: {
  contact: ContactInfo;
  content: HomeContentData;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const { heroTrustPoints, heroServiceTags, aboutEyebrow, aboutTitle } = content;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroGallery.length);
    }, rotationMs);

    return () => window.clearInterval(timer);
  }, []);

  const leftImage = heroGallery[(activeIndex + 1) % heroGallery.length];
  const centerImage = heroGallery[activeIndex];
  const rightImage = heroGallery[(activeIndex + 2) % heroGallery.length];

  return (
    <section id="home" className="relative overflow-hidden bg-white text-neutral-950">
      <div className="relative flex min-h-screen items-center pt-16 sm:pt-20">
        <Container>
          <div className="grid grid-cols-1 items-center gap-8 py-6 sm:py-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12 xl:gap-16">
            <div>
              <div className="hero-enter hero-enter-1 mb-4 flex items-center gap-3">
                <div aria-hidden="true" className="accent-rule h-px w-10 shrink-0" />
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-900 sm:tracking-[0.2em]">
                  Photography studio in {contactInfo.city}
                </span>
              </div>

              <h1 className="hero-enter hero-enter-2 break-words font-serif text-3xl font-semibold leading-[1.06] tracking-tight sm:text-4xl xl:text-5xl">
                SomStudio
                <span className="block italic text-gold">Photography</span>
              </h1>

              <p className="hero-enter hero-enter-3 mt-4 max-w-xl text-base leading-relaxed text-neutral-900 sm:text-lg">
                {content.heroWelcomeText}
              </p>

              <div className="hero-enter hero-enter-4 mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button href="/contact" variant="primary" size="lg" className="w-full sm:w-auto">
                  Book a Session
                </Button>
                <Button href="/services" variant="secondary" size="lg" className="w-full sm:w-auto">
                  View Services
                </Button>
              </div>

              <div className="hero-enter hero-enter-5 mt-6 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3">
                {heroTrustPoints.map((point: string) => (
                  <div
                    key={point}
                    className="border-l-2 border-gold/40 pl-4 text-sm leading-relaxed text-neutral-900"
                  >
                    {point}
                  </div>
                ))}
              </div>

              <div className="hero-enter hero-enter-5 mt-6 flex flex-wrap gap-2">
                {heroServiceTags.map((tag: string) => (
                  <span
                    key={tag}
                    className="rounded-full border border-neutral-200 bg-white/50 px-3 py-1 text-xs text-neutral-900 backdrop-blur-sm transition-colors hover:border-gold/50 hover:text-neutral-950"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="hero-enter hero-enter-3 relative min-h-[360px] sm:min-h-[460px] lg:min-h-[540px]">
              <div className="absolute inset-x-6 top-8 h-[72%] rounded-[2rem] border border-gold/15 bg-gradient-to-br from-neutral-50/90 to-neutral-100/40 shadow-[0_20px_60px_rgb(15_15_15_/0.06)] sm:inset-x-10 sm:top-10 lg:inset-x-16" />

              <div className="hero-float-slow absolute left-0 top-12 h-[58%] w-[44%] overflow-hidden rounded-[1.75rem] border border-white bg-neutral-100 shadow-lg transition-all duration-700 sm:top-16">
                <Image
                  src={leftImage.src}
                  alt={leftImage.alt}
                  fill
                  priority={false}
                  sizes="(max-width: 1024px) 44vw, 20vw"
                  className="image-cycle object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent" />
              </div>

              <div className="absolute left-1/2 top-0 z-20 h-[84%] w-[56%] -translate-x-1/2 overflow-hidden rounded-[2rem] border border-white bg-white shadow-2xl">
                <Image
                  src={centerImage.src}
                  alt={centerImage.alt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 56vw, 28vw"
                  className="image-cycle object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/55 via-transparent to-transparent" />
                <div className="absolute left-0 top-0 h-full w-full p-4 sm:p-5 lg:p-6">
                  <div className="flex h-full flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="glass-chip rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-900">
                        Cover image
                      </span>
                      <span className="glass-chip rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-900">
                        Changes every 3 sec
                      </span>
                    </div>
                    <div className="max-w-sm">
                      <div className="accent-rule mb-3 h-px w-12" />
                      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-900">
                        {aboutEyebrow}
                      </span>
                      <h2 className="mt-2 font-serif text-xl font-semibold text-neutral-950 sm:text-2xl">
                        {aboutTitle}
                      </h2>
                    </div>
                  </div>
                </div>
              </div>

              <div className="hero-float absolute bottom-10 right-0 h-[42%] w-[40%] overflow-hidden rounded-[1.5rem] border border-white bg-neutral-100 shadow-lg transition-all duration-700 sm:bottom-14">
                <Image
                  src={rightImage.src}
                  alt={rightImage.alt}
                  fill
                  priority={false}
                  sizes="(max-width: 1024px) 40vw, 18vw"
                  className="image-cycle object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/35 via-transparent to-transparent" />
              </div>

              <div className="absolute left-6 bottom-4 flex gap-2 sm:left-10 sm:bottom-8">
                {heroGallery.map((image: SiteImage, index: number) => (
                  <span
                    key={image.src}
                    aria-hidden="true"
                    className={`image-progress image-progress-${index} h-1 w-10 overflow-hidden rounded-full bg-neutral-200`}
                  />
                ))}
              </div>

              <p className="absolute right-4 top-4 max-w-[10rem] text-[10px] uppercase tracking-[0.18em] text-neutral-900 sm:right-8 sm:top-8">
                Wedding, portrait, and studio stories
              </p>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
