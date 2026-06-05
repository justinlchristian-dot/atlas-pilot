"use client";

import { Ban, BellPlus, Check, Clock3, Home } from "lucide-react";
import { ConfidencePill } from "@/components/approval-pills";
import type { HomeOperation, HomeOperationAction } from "@/data/life-map";
import { MapStatusPill } from "@/components/life-map-pills";

type HomeOperationCardProps = {
  item: HomeOperation;
  approvalPrepared: boolean;
  onAction: (itemId: string, action: HomeOperationAction) => void;
};

const actionButtonClass =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-medium transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-ink-950/20";

export function HomeOperationCard({
  item,
  approvalPrepared,
  onAction,
}: HomeOperationCardProps) {
  if (item.status === "Hidden") {
    return null;
  }

  return (
    <article className="rounded-lg border border-atlas-line/80 bg-white/86 p-5 shadow-card backdrop-blur-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <MapStatusPill status={item.status} />
            <ConfidencePill confidence={item.confidence} />
            {approvalPrepared ? (
              <span className="inline-flex min-h-7 items-center rounded-full border border-atlas-tide/30 bg-atlas-tide/10 px-2.5 text-xs font-medium text-atlas-tide">
                Approval prepared
              </span>
            ) : null}
          </div>
          <h3 className="mt-4 text-lg font-semibold text-ink-950">
            {item.name}
          </h3>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-atlas-line bg-atlas-cloud text-atlas-sage">
          <Home aria-hidden="true" size={19} strokeWidth={1.8} />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-atlas-line bg-atlas-cloud/70 p-3">
          <p className="text-xs font-semibold uppercase text-ink-500">
            Frequency
          </p>
          <p className="mt-1 text-sm font-medium text-ink-800">
            {item.frequency}
          </p>
        </div>
        <div className="rounded-lg border border-atlas-line bg-atlas-cloud/70 p-3">
          <p className="text-xs font-semibold uppercase text-ink-500">
            Last completed
          </p>
          <p className="mt-1 text-sm font-medium text-ink-800">
            {item.lastCompleted}
          </p>
        </div>
        <div className="rounded-lg border border-atlas-line bg-atlas-cloud/70 p-3">
          <p className="text-xs font-semibold uppercase text-ink-500">
            Next due
          </p>
          <p className="mt-1 text-sm font-medium text-ink-800">
            {item.nextDue}
          </p>
        </div>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-atlas-line bg-white p-4">
          <p className="text-xs font-semibold uppercase text-ink-500">
            Why it matters
          </p>
          <p className="mt-2 text-sm leading-6 text-ink-700">
            {item.whyItMatters}
          </p>
        </div>
        <div className="rounded-lg border border-atlas-line bg-white p-4">
          <p className="text-xs font-semibold uppercase text-ink-500">
            Supplies needed
          </p>
          <p className="mt-2 text-sm leading-6 text-ink-700">
            {item.supplies}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        <button
          type="button"
          onClick={() => onAction(item.id, "Marked Done")}
          className={`${actionButtonClass} border-emerald-200 bg-emerald-50 text-emerald-800`}
        >
          <Check aria-hidden="true" size={16} />
          Mark done
        </button>
        <button
          type="button"
          onClick={() => onAction(item.id, "Snoozed")}
          className={`${actionButtonClass} border-amber-200 bg-amber-50 text-amber-800`}
        >
          <Clock3 aria-hidden="true" size={16} />
          Snooze
        </button>
        <button
          type="button"
          onClick={() => onAction(item.id, "Approval Prepared")}
          className={`${actionButtonClass} border-atlas-tide/30 bg-atlas-tide/10 text-atlas-tide`}
        >
          <BellPlus aria-hidden="true" size={16} />
          Create approval item
        </button>
        <button
          type="button"
          onClick={() => onAction(item.id, "Hidden")}
          className={`${actionButtonClass} border-slate-200 bg-slate-50 text-slate-700`}
        >
          <Ban aria-hidden="true" size={16} />
          Never show again
        </button>
      </div>
    </article>
  );
}
