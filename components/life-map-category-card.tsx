import { Brain, CircleHelp, Database, ShieldAlert } from "lucide-react";
import { ConfidencePill } from "@/components/approval-pills";
import { KnowledgePill, MapStatusPill } from "@/components/life-map-pills";
import type { LifeMapCategory } from "@/data/life-map";
import type { ModuleVisibility } from "@/data/settings";

function needsReviewCount(category: LifeMapCategory) {
  return category.entities.filter((entity) =>
    ["Unknown", "Needs Review", "Sensitive"].includes(
      entity.state,
    ),
  ).length;
}

export function LifeMapCategoryCard({
  category,
  personalizationMode,
}: {
  category: LifeMapCategory;
  personalizationMode?: ModuleVisibility;
}) {
  const reviewCount = needsReviewCount(category);
  const sensitive = category.entities.some(
    (entity) => entity.state === "Sensitive",
  );

  return (
    <article
      className={`rounded-lg border border-atlas-line/80 p-5 shadow-card backdrop-blur-sm ${
        personalizationMode === "Off"
          ? "bg-white/54 opacity-72"
          : personalizationMode === "Quiet"
            ? "bg-white/72"
            : "bg-white/86"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <MapStatusPill status={category.status} />
            <ConfidencePill confidence={category.confidence} />
            {personalizationMode ? (
              <span className="rounded-full border border-atlas-line bg-white px-2 py-1 text-xs font-semibold text-ink-500">
                {personalizationMode}
              </span>
            ) : null}
          </div>
          <h2 className="mt-4 text-xl font-semibold tracking-normal text-ink-950">
            {category.name}
          </h2>
          <p className="mt-2 text-sm leading-6 text-ink-600">
            {category.summary}
          </p>
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-atlas-line bg-atlas-cloud text-atlas-tide">
          {sensitive ? (
            <ShieldAlert aria-hidden="true" size={20} strokeWidth={1.8} />
          ) : (
            <Brain aria-hidden="true" size={20} strokeWidth={1.8} />
          )}
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-atlas-line bg-atlas-cloud/70 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase text-ink-500">
            <Database aria-hidden="true" size={14} />
            Known entities
          </div>
          <p className="mt-2 text-2xl font-semibold text-ink-950">
            {category.entities.length}
          </p>
        </div>
        <div className="rounded-lg border border-atlas-line bg-atlas-cloud/70 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase text-ink-500">
            <CircleHelp aria-hidden="true" size={14} />
            Needs review
          </div>
          <p className="mt-2 text-2xl font-semibold text-ink-950">
            {reviewCount}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {category.entities.map((entity) => (
          <div
            key={`${category.id}-${entity.name}`}
            className="flex items-center gap-2 rounded-full border border-atlas-line bg-white px-2 py-1"
          >
            <span className="text-xs font-medium text-ink-700">
              {entity.name}
            </span>
            <KnowledgePill state={entity.state} />
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-lg border border-atlas-line bg-atlas-cloud/70 p-4">
        <p className="text-xs font-semibold uppercase text-ink-500">
          {personalizationMode === "Off" ? "Re-enable option" : "Recommended next step"}
        </p>
        <p className="mt-2 text-sm leading-6 text-ink-700">
          {personalizationMode === "Off"
            ? "This area is off from onboarding. Re-enable it in setup or Settings when it becomes useful."
            : category.recommendedNextStep}
        </p>
      </div>
    </article>
  );
}
