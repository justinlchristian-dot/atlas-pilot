"use client";

import { CheckCheck, MinusCircle, SlidersHorizontal } from "lucide-react";
import {
  GroceryItemStatusPill,
} from "@/components/shopping-status-pill";
import type { GroceryItem, GroceryItemStatus } from "@/data/shopping";

const categories: GroceryItem["category"][] = [
  "Produce",
  "Protein",
  "Dairy",
  "Pantry",
  "Household",
];

const smallButtonClass =
  "inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border px-2.5 text-xs font-medium transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-ink-950/20";

export function GroceryListCard({
  items,
  total,
  onUpdate,
}: {
  items: GroceryItem[];
  total: number;
  onUpdate: (itemId: string, status: GroceryItemStatus) => void;
}) {
  return (
    <article className="rounded-lg border border-atlas-line/80 bg-white/86 p-5 shadow-card backdrop-blur-sm sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase text-atlas-sage">
            Prepared grocery list
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-normal text-ink-950">
            Review by group
          </h2>
          <p className="mt-2 text-sm leading-6 text-ink-600">
            Edit locally before approval. This is not a cart and no store is connected.
          </p>
        </div>
        <div className="rounded-lg border border-atlas-line bg-atlas-cloud/70 p-4">
          <p className="text-xs font-semibold uppercase text-ink-500">
            Active estimate
          </p>
          <p className="mt-2 text-3xl font-semibold text-ink-950">
            ${total.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        {categories.map((category) => {
          const categoryItems = items.filter((item) => item.category === category);

          return (
            <section
              key={category}
              className="rounded-lg border border-atlas-line bg-atlas-cloud/60 p-4"
            >
              <h3 className="text-base font-semibold text-ink-950">
                {category}
              </h3>
              <div className="mt-3 space-y-3">
                {categoryItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg border border-atlas-line bg-white p-3"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-ink-950">
                          {item.name}
                        </p>
                        <p className="mt-1 text-xs text-ink-500">
                          {item.quantity} · ${item.estimatedPrice.toFixed(2)}
                        </p>
                      </div>
                      <GroceryItemStatusPill status={item.status} />
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => onUpdate(item.id, "Removed")}
                        className={`${smallButtonClass} border-slate-200 bg-slate-50 text-slate-700`}
                      >
                        <MinusCircle aria-hidden="true" size={14} />
                        Remove
                      </button>
                      <button
                        type="button"
                        onClick={() => onUpdate(item.id, "Optional")}
                        className={`${smallButtonClass} border-amber-200 bg-amber-50 text-amber-800`}
                      >
                        <SlidersHorizontal aria-hidden="true" size={14} />
                        Optional
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          onUpdate(item.id, "Substitution Approved")
                        }
                        className={`${smallButtonClass} border-sky-200 bg-sky-50 text-sky-800`}
                      >
                        <CheckCheck aria-hidden="true" size={14} />
                        Substitution approved
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </article>
  );
}
