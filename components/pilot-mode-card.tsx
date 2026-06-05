import { ShieldCheck } from "lucide-react";

export function PilotModeCard({
  compact = false,
}: {
  compact?: boolean;
}) {
  const items = [
    "Mock data only",
    "No real accounts connected",
    "Prepared, not ordered",
    "Nothing external happens without approval",
    "Do not enter sensitive real data",
  ];

  return (
    <article className="rounded-lg border border-atlas-line/80 bg-white/86 p-5 shadow-card backdrop-blur-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-atlas-line bg-atlas-cloud text-atlas-sage">
          <ShieldCheck aria-hidden="true" size={19} strokeWidth={1.8} />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase text-atlas-sage">
            Pilot mode
          </p>
          <h2 className="mt-1 text-lg font-semibold text-ink-950">
            Safe local test environment
          </h2>
          <p className="mt-2 text-sm leading-6 text-ink-600">
            Atlas is ready for guided pilot review, not real account usage.
          </p>
        </div>
      </div>
      <div className={`mt-4 grid gap-2 ${compact ? "" : "sm:grid-cols-2"}`}>
        {items.map((item) => (
          <div
            key={item}
            className="rounded-lg border border-atlas-line bg-atlas-cloud/70 px-3 py-2 text-sm font-medium leading-6 text-ink-700"
          >
            {item}
          </div>
        ))}
      </div>
    </article>
  );
}
