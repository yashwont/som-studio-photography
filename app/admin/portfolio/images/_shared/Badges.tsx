import type { storyStateFrom } from "@/src/lib/db/admin-portfolio-story";

export function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        active
          ? "bg-emerald-500/10 text-emerald-400"
          : "bg-neutral-700/50 text-neutral-400"
      }`}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}

export function FeaturedBadge({ featured }: { featured: boolean }) {
  return featured ? (
    <span className="inline-flex rounded-full border border-gold/30 px-2.5 py-1 text-xs font-semibold text-gold">
      Featured
    </span>
  ) : null;
}

export function StoryStatusBadge({ state }: { state: ReturnType<typeof storyStateFrom> }) {
  const labels: Record<ReturnType<typeof storyStateFrom>, string> = {
    "not-created": "Story not created",
    basic: "Story: basic",
    complete: "Story: complete",
  };
  const classNames: Record<ReturnType<typeof storyStateFrom>, string> = {
    "not-created": "bg-neutral-700/50 text-neutral-400",
    basic: "border border-gold/30 text-gold",
    complete: "bg-emerald-500/10 text-emerald-400",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${classNames[state]}`}
    >
      {labels[state]}
    </span>
  );
}
