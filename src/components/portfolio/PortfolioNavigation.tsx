import Image from "next/image";
import Link from "next/link";
import Container from "@/src/components/layout/Container";

interface PortfolioNavigationLink {
  slug: string;
  title: string;
  imageSrc: string;
  imageAlt: string;
}

export default function PortfolioNavigation({
  prev,
  next,
}: {
  prev?: PortfolioNavigationLink;
  next?: PortfolioNavigationLink;
}) {
  if (!prev && !next) {
    return null;
  }

  return (
    <section className="border-t border-neutral-200 bg-white">
      <Container>
        <div className="grid grid-cols-1 divide-y divide-neutral-200 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
          <div>
            {prev && (
              <Link
                href={`/portfolio/${prev.slug}`}
                className="group flex items-center gap-4 py-10 sm:pr-8"
              >
                <span
                  aria-hidden="true"
                  className="text-lg text-neutral-400 transition-transform duration-300 group-hover:-translate-x-1"
                >
                  &larr;
                </span>
                <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded bg-neutral-100">
                  <Image
                    src={prev.imageSrc}
                    alt=""
                    fill
                    loading="lazy"
                    sizes="5rem"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-neutral-900">
                    Previous Story
                  </p>
                  <p className="mt-1 text-base font-semibold text-neutral-950 transition-colors group-hover:text-gold">
                    {prev.title}
                  </p>
                </div>
              </Link>
            )}
          </div>
          <div>
            {next && (
              <Link
                href={`/portfolio/${next.slug}`}
                className="group flex items-center justify-end gap-4 py-10 text-right sm:pl-8"
              >
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-neutral-900">
                    Next Story
                  </p>
                  <p className="mt-1 text-base font-semibold text-neutral-950 transition-colors group-hover:text-gold">
                    {next.title}
                  </p>
                </div>
                <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded bg-neutral-100">
                  <Image
                    src={next.imageSrc}
                    alt=""
                    fill
                    loading="lazy"
                    sizes="5rem"
                    className="object-cover"
                  />
                </div>
                <span
                  aria-hidden="true"
                  className="text-lg text-neutral-400 transition-transform duration-300 group-hover:translate-x-1"
                >
                  &rarr;
                </span>
              </Link>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
