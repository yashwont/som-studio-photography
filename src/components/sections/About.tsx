import Container from "@/src/components/layout/Container";
import SectionHeader from "@/src/components/ui/SectionHeader";
import type { HomeContentData } from "@/src/lib/db/home";

export default function About({ content }: { content: HomeContentData }) {
  return (
    <section id="about" className="bg-neutral-50 border-t border-neutral-200">
      <Container>
        <div className="grid grid-cols-1 items-start gap-10 py-12 sm:py-16 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeader
              eyebrow={content.aboutEyebrow}
              title={content.aboutTitle}
              centered={false}
            />

            <p className="mt-6 max-w-lg text-lg leading-relaxed text-neutral-900">
              {content.aboutParagraph}
            </p>

            <div className="mt-8 flex items-center gap-3">
              <div aria-hidden="true" className="accent-rule h-px w-8 shrink-0" />
              <span className="text-xs uppercase tracking-[0.2em] text-neutral-900">
                {content.aboutLocationTag}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {content.aboutHighlights.map((item: { title: string; description: string }) => (
              <div
                key={item.title}
                className="glass group rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-30px_rgba(10,10,10,0.4)]"
              >
                <div
                  aria-hidden="true"
                  className="accent-rule mb-5 h-px w-6 transition-all duration-300 group-hover:w-12"
                />

                <h3 className="mb-2 font-serif text-base font-semibold text-neutral-950">
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
