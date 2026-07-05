"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Container from "@/src/components/layout/Container";
import Button from "@/src/components/ui/Button";
import { contactInfo } from "@/src/data/contact";
import { heroGallery } from "@/src/data/visuals";

const serviceHighlights = [
  "New Born",
  "Kids",
  "Maternity",
  "Family",
  "Weddings",
  "Pre-Wedding",
];

const trustPoints = [
  "Studio & outdoor sessions",
  "Guided posing and planning",
  "Edited online gallery delivery",
];

const rotationMs = 3000;
const heroLabels = [
  {
    title: "Wedding cover story",
    subtitle: "A rotating front image keeps the hero feeling alive.",
  },
  {
    title: "Ceremony moments",
    subtitle: "The front frame changes while the side prints stay present.",
  },
  {
    title: "Pre-wedding session",
    subtitle: "A cleaner opening view with changing cover imagery.",
  },
];

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);

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
          <div className="grid grid-cols-1 items-center gap-10 py-12 sm:py-16 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12 xl:gap-16">
            <div>
              <div className="mb-5 flex items-center gap-3">
                <div aria-hidden="true" className="h-px w-8 shrink-0 bg-gold" />
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand sm:tracking-[0.2em]">
                  Photography studio in {contactInfo.city}
                </span>
              </div>

              <h1 className="break-words text-5xl font-bold leading-[1.02] tracking-tight sm:text-6xl xl:text-7xl">
                SomStudio
                <span className="block text-brand">Photography</span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-neutral-600">
                Established in 1995 A.D. with 30 years of experience, our
                Professional Digital Studio Photography specializes in
                capturing timeless moments. Using cutting-edge technology, we
                create stunning images tailored to your vision. Our studio
                offers a comfortable environment, exceptional customer
                service, and quick turnaround times. Choose from customizable
                packages for newborn, kids, maternity, family, graduation,
                portrait, wedding, pre-wedding, event, and product photography.
                Contact us today to schedule your session and turn your vision
                into cherished memories.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                <Button href="/contact" variant="primary" size="lg" className="w-full sm:w-auto">
                  Book a Session
                </Button>
                <Button href="/portfolio" variant="secondary" size="lg" className="w-full sm:w-auto">
                  View Portfolio
                </Button>
              </div>

              <div className="mt-8 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3">
                {trustPoints.map((point) => (
                  <div
                    key={point}
                    className="border-l border-neutral-200 pl-4 text-sm leading-relaxed text-neutral-600"
                  >
                    {point}
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                {serviceHighlights.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-500"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative min-h-[520px] sm:min-h-[640px] lg:min-h-[760px]">
              <div className="absolute inset-x-6 top-8 h-[72%] rounded-[2rem] border border-neutral-200 bg-neutral-50/80 shadow-[0_20px_60px_rgb(15_15_15_/0.06)] sm:inset-x-10 sm:top-10 lg:inset-x-16" />

              <div className="absolute left-0 top-12 h-[58%] w-[44%] overflow-hidden rounded-[1.75rem] border border-white bg-neutral-100 shadow-lg transition-all duration-700 sm:top-16">
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
                      <span className="rounded-full border border-white/80 bg-white/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-700 backdrop-blur-sm">
                        Cover image
                      </span>
                      <span className="rounded-full border border-white/80 bg-white/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-500 backdrop-blur-sm">
                        Changes every 3 sec
                      </span>
                    </div>
                    <div className="max-w-sm">
                      <div className="mb-3 h-px w-12 bg-gold" />
                      <h2 className="text-xl font-semibold text-neutral-950 sm:text-2xl">
                        {heroLabels[activeIndex].title}
                      </h2>
                      <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                        {heroLabels[activeIndex].subtitle}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-10 right-0 h-[42%] w-[40%] overflow-hidden rounded-[1.5rem] border border-white bg-neutral-100 shadow-lg transition-all duration-700 sm:bottom-14">
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
                {heroGallery.map((image, index) => (
                  <span
                    key={image.src}
                    aria-hidden="true"
                    className={`image-progress image-progress-${index} h-1 w-10 overflow-hidden rounded-full bg-neutral-200`}
                  />
                ))}
              </div>

              <p className="absolute right-4 top-4 max-w-[10rem] text-[10px] uppercase tracking-[0.18em] text-neutral-400 sm:right-8 sm:top-8">
                Wedding, portrait, and studio stories
              </p>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
