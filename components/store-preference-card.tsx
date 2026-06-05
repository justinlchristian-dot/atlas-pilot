import { Store } from "lucide-react";
import type { StorePreference } from "@/data/shopping";

export function StorePreferenceCard({
  preference,
}: {
  preference: StorePreference;
}) {
  return (
    <article className="rounded-lg border border-atlas-line/80 bg-white/82 p-5 shadow-card backdrop-blur-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-atlas-line bg-atlas-cloud text-atlas-tide">
        <Store aria-hidden="true" size={19} strokeWidth={1.8} />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-ink-950">
        {preference.store}
      </h3>
      <p className="mt-2 text-sm leading-6 text-ink-600">
        {preference.preference}
      </p>
    </article>
  );
}
