import type { LucideIcon } from "lucide-react";

type SummaryCardProps = {
  title: string;
  value: number | string;
  detail: string;
  icon: LucideIcon;
  tone?: "default" | "serious";
};

export function SummaryCard({
  title,
  value,
  detail,
  icon: Icon,
  tone = "default",
}: SummaryCardProps) {
  const toneClasses =
    tone === "serious"
      ? "border-rose-200 bg-rose-50/70 text-atlas-rose"
      : "border-atlas-line bg-atlas-cloud text-atlas-tide";

  return (
    <article className="rounded-lg border border-atlas-line/80 bg-white/82 p-5 shadow-card backdrop-blur-sm">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-lg border ${toneClasses}`}
      >
        <Icon aria-hidden="true" size={19} strokeWidth={1.8} />
      </div>
      <p className="mt-5 text-sm font-medium text-ink-500">{title}</p>
      <p className="mt-2 text-3xl font-semibold tracking-normal text-ink-950">
        {value}
      </p>
      <p className="mt-2 text-sm leading-6 text-ink-600">{detail}</p>
    </article>
  );
}
