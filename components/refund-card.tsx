"use client";

import { BellPlus, Check, Clock3, FilePlus2 } from "lucide-react";
import { ShoppingStatusPill } from "@/components/shopping-status-pill";
import type { RefundItem, ShoppingAction } from "@/data/shopping";

const actionButtonClass =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-medium transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-ink-950/20";

export function RefundCard({
  item,
  approvalPrepared,
  onAction,
}: {
  item: RefundItem;
  approvalPrepared: boolean;
  onAction: (itemId: string, action: ShoppingAction) => void;
}) {
  return (
    <article className="rounded-lg border border-atlas-line/80 bg-white/86 p-5 shadow-card backdrop-blur-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap gap-2">
            <ShoppingStatusPill status={item.status} />
            {approvalPrepared ? (
              <ShoppingStatusPill status="Approval Prepared" />
            ) : null}
          </div>
          <h3 className="mt-4 text-lg font-semibold text-ink-950">
            {item.title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-ink-600">{item.detail}</p>
          <p className="mt-2 text-xs font-medium text-ink-500">{item.source}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onAction(item.id, "Mark resolved")}
          className={`${actionButtonClass} border-emerald-200 bg-emerald-50 text-emerald-800`}
        >
          <Check aria-hidden="true" size={16} />
          Mark resolved
        </button>
        <button
          type="button"
          onClick={() => onAction(item.id, "Add reminder")}
          className={`${actionButtonClass} border-amber-200 bg-amber-50 text-amber-800`}
        >
          <BellPlus aria-hidden="true" size={16} />
          Add reminder
        </button>
        <button
          type="button"
          onClick={() => onAction(item.id, "Create approval item")}
          className={`${actionButtonClass} border-atlas-tide/30 bg-atlas-tide/10 text-atlas-tide`}
        >
          <FilePlus2 aria-hidden="true" size={16} />
          Create approval item
        </button>
        <button
          type="button"
          onClick={() => onAction(item.id, "Snooze")}
          className={`${actionButtonClass} border-slate-200 bg-slate-50 text-slate-700`}
        >
          <Clock3 aria-hidden="true" size={16} />
          Snooze
        </button>
      </div>
    </article>
  );
}
