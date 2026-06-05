import type { BriefCard as BriefCardType } from "@/data/today";
import { StatusPill } from "@/components/status-pill";

export function BriefCard({ card }: { card: BriefCardType }) {
  const Icon = card.icon;

  return (
    <article className="flex min-h-52 flex-col rounded-lg border border-atlas-line/80 bg-white/82 p-5 shadow-card backdrop-blur-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-atlas-line bg-atlas-cloud text-atlas-tide">
            <Icon aria-hidden="true" size={20} strokeWidth={1.8} />
          </div>
          <h2 className="text-base font-semibold leading-6 text-ink-950">
            {card.title}
          </h2>
        </div>
        <StatusPill status={card.status} />
      </div>
      <p className="mt-5 text-[15px] leading-7 text-ink-600">{card.description}</p>
      {card.detail ? (
        <p className="mt-auto pt-5 text-sm leading-6 text-ink-500">{card.detail}</p>
      ) : null}
    </article>
  );
}
