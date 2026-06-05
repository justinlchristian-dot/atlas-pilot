"use client";

import { Ban, Check, Clock3, MapPinned, Store } from "lucide-react";
import { RiskPill } from "@/components/approval-pills";
import { ShoppingStatusPill } from "@/components/shopping-status-pill";
import type { ReorderItem, ShoppingAction } from "@/data/shopping";

const actionButtonClass =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-medium transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-ink-950/20";

export function ReorderCard({
  item,
  approvalPrepared,
  onAction,
}: {
  item: ReorderItem;
  approvalPrepared: boolean;
  onAction: (itemId: string, action: ShoppingAction) => void;
}) {
  if (item.status === "Hidden") {
    return null;
  }

  return (
    <article className="rounded-lg border border-atlas-line/80 bg-white/86 p-5 shadow-card backdrop-blur-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex min-h-7 items-center rounded-full border border-atlas-line bg-atlas-cloud px-2.5 text-xs font-medium text-ink-600">
              {item.status}
            </span>
            <RiskPill risk={item.risk} />
            {approvalPrepared ? (
              <ShoppingStatusPill status="Approval Prepared" />
            ) : null}
          </div>
          <h3 className="mt-4 text-lg font-semibold text-ink-950">
            {item.title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-ink-600">
            {item.description}
          </p>
        </div>
        <div className="rounded-lg border border-atlas-line bg-atlas-cloud/70 p-3 text-right">
          <p className="text-xs font-semibold uppercase text-ink-500">
            Estimate
          </p>
          <p className="mt-1 text-xl font-semibold text-ink-950">
            ${item.estimatedTotal.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-atlas-line bg-atlas-cloud/70 p-4">
          <p className="text-xs font-semibold uppercase text-ink-500">Store</p>
          <p className="mt-2 text-sm font-medium text-ink-800">{item.store}</p>
        </div>
        <div className="rounded-lg border border-atlas-line bg-atlas-cloud/70 p-4">
          <p className="text-xs font-semibold uppercase text-ink-500">Why</p>
          <p className="mt-2 text-sm font-medium text-ink-800">{item.why}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onAction(item.id, "Approve prep")}
          className={`${actionButtonClass} border-emerald-200 bg-emerald-50 text-emerald-800`}
        >
          <Check aria-hidden="true" size={16} />
          Approve prep
        </button>
        <button
          type="button"
          onClick={() => onAction(item.id, "Add to errand list")}
          className={`${actionButtonClass} border-atlas-tide/30 bg-atlas-tide/10 text-atlas-tide`}
        >
          <MapPinned aria-hidden="true" size={16} />
          Add to errand list
        </button>
        <button
          type="button"
          onClick={() => onAction(item.id, "Change store")}
          className={`${actionButtonClass} border-sky-200 bg-sky-50 text-sky-800`}
        >
          <Store aria-hidden="true" size={16} />
          Change store
        </button>
        <button
          type="button"
          onClick={() => onAction(item.id, "Snooze")}
          className={`${actionButtonClass} border-amber-200 bg-amber-50 text-amber-800`}
        >
          <Clock3 aria-hidden="true" size={16} />
          Snooze
        </button>
        <button
          type="button"
          onClick={() => onAction(item.id, "Never show this again")}
          className={`${actionButtonClass} border-slate-200 bg-slate-50 text-slate-700 sm:col-span-2`}
        >
          <Ban aria-hidden="true" size={16} />
          Never show again
        </button>
      </div>
    </article>
  );
}
