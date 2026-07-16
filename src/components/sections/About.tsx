import Container from "@/src/components/layout/Container";
import SectionHeader from "@/src/components/ui/SectionHeader";
import type { HomeContentData } from "@/src/lib/db/home";

export default function About({ content }: { content: HomeContentData }) {
  return (
    <section id="about" className="bg-neutral-50 border-t border-neutral-200">
      <Container>
        <div className="grid grid-cols-1 items-start gap-14 py-20 sm:py-28 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeader
              eyebrow={content.aboutEyebrow}
              title={content.aboutTitle}
              centered={false}
            />

            <p className="mt-6 max-w-lg text-base leading-relaxed text-neutral-900">
              {content.aboutParagraph}
            </p>

            <div className="mt-8 flex items-center gap-3">
              <div aria-hidden="true" className="h-px w-8 shrink-0 bg-gold" />
              <span className="text-xs uppercase tracking-[0.2em] text-neutral-900">
                {content.aboutLocationTag}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {content.aboutHighlights.map((item: { title: string; description: string }) => (
              <div
                key={item.title}
                className="group rounded border border-neutral-200 bg-neutral-50 p-6 transition-colors hover:border-neutral-300"
              >
                <div aria-hidden="true" className="mb-5 h-px w-6 bg-gold" />

                <h3 className="mb-2 text-sm font-semibold text-neutral-950">
                  {item.title}
                </h3>

                <p className="text-sm leading-relaxed text-neutral-900">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
