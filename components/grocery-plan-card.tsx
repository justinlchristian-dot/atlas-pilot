"use client";

import { Check, Clock3, EyeOff, RefreshCw, Scissors } from "lucide-react";
import { ConfidencePill } from "@/components/approval-pills";
import { ShoppingStatusPill } from "@/components/shopping-status-pill";
import type { GroceryPlan, ShoppingAction } from "@/data/shopping";

const actionButtonClass =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-medium transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-ink-950/20";

export function GroceryPlanCard({
  plan,
  onAction,
}: {
  plan: GroceryPlan;
  onAction: (action: ShoppingAction) => void;
}) {
  return (
    <article className="rounded-lg border border-atlas-line/80 bg-white/86 p-5 shadow-card backdrop-blur-sm sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <ShoppingStatusPill status={plan.status} />
            <ConfidencePill confidence={plan.confidence} />
            <span className="inline-flex min-h-7 items-center rounded-full border border-atlas-line bg-atlas-cloud px-2.5 text-xs font-medium text-ink-600">
              Prepared, not ordered
            </span>
          </div>
          <h2 className="mt-4 text-2xl font-semibold tracking-normal text-ink-950">
            Weekly grocery plan
          </h2>
          <p className="mt-2 text-sm leading-6 text-ink-600">
            {plan.whyItMatters}
          </p>
        </div>
        <div className="rounded-lg border border-atlas-line bg-atlas-cloud/70 p-4 lg:min-w-56">
          <p className="text-xs font-semibold uppercase text-ink-500">Goal</p>
          <p className="mt-2 text-sm font-medium text-ink-800">{plan.goal}</p>
          <p className="mt-4 text-xs font-semibold uppercase text-ink-500">
            Estimated total
          </p>
          <p className="mt-2 text-3xl font-semibold text-ink-950">
            ${plan.estimatedTotal}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {plan.meals.map((meal) => (
          <div
            key={meal}
            className="rounded-lg border border-atlas-line bg-atlas-cloud/70 p-3 text-sm font-medium text-ink-700"
          >
            {meal}
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
        <button
          type="button"
          onClick={() => onAction("Approve list")}
          className={`${actionButtonClass} border-emerald-200 bg-emerald-50 text-emerald-800`}
        >
          <Check aria-hidden="true" size={16} />
          Approve list
        </button>
        <button
          type="button"
          onClick={() => onAction("Lower total")}
          className={`${actionButtonClass} border-atlas-tide/30 bg-atlas-tide/10 text-atlas-tide`}
        >
          <Scissors aria-hidden="true" size={16} />
          Lower total
        </button>
        <button
          type="button"
          onClick={() => onAction("Swap meals")}
          className={`${actionButtonClass} border-sky-200 bg-sky-50 text-sky-800`}
        >
          <RefreshCw aria-hidden="true" size={16} />
          Swap meals
        </button>
        <button
          type="button"
          onClick={() => onAction("Save for later")}
          className={`${actionButtonClass} border-amber-200 bg-amber-50 text-amber-800`}
        >
          <Clock3 aria-hidden="true" size={16} />
          Save for later
        </button>
        <button
          type="button"
          onClick={() => onAction("Never show this again")}
          className={`${actionButtonClass} border-slate-200 bg-slate-50 text-slate-700`}
        >
          <EyeOff aria-hidden="true" size={16} />
          Never show this again
        </button>
      </div>
    </article>
  );
}
