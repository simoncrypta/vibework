"use client";

export type InfoCardProps = {
  tags: string[];
  description: string;
  ctaLabel: string;
  onCtaClick?: () => void;
};

/** Presentational card — Tailwind only, no design-system dependency. */
export function InfoCard({ tags, description, ctaLabel, onCtaClick }: InfoCardProps) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-3 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700"
          >
            {tag}
          </span>
        ))}
      </div>
      <p className="mb-4 text-sm text-slate-600">{description}</p>
      <button
        type="button"
        onClick={onCtaClick}
        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
      >
        {ctaLabel}
      </button>
    </article>
  );
}
