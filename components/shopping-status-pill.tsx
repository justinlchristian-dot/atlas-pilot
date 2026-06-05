import type { GroceryItemStatus, ShoppingStatus } from "@/data/shopping";

const shoppingStatusClasses: Record<ShoppingStatus, string> = {
  "Needs Review": "border-atlas-tide/30 bg-atlas-tide/10 text-atlas-tide",
  Prepared: "border-sky-200 bg-sky-50 text-sky-800",
  Approved: "border-emerald-200 bg-emerald-50 text-emerald-800",
  Lowered: "border-emerald-200 bg-emerald-50 text-emerald-800",
  Saved: "border-slate-200 bg-slate-50 text-slate-600",
  Hidden: "border-slate-200 bg-slate-50 text-slate-600",
  Snoozed: "border-amber-200 bg-amber-50 text-amber-800",
  "Reminder Added": "border-amber-200 bg-amber-50 text-amber-800",
  Resolved: "border-emerald-200 bg-emerald-50 text-emerald-800",
  "Approval Prepared": "border-atlas-tide/30 bg-atlas-tide/10 text-atlas-tide",
};

const groceryStatusClasses: Record<GroceryItemStatus, string> = {
  Included: "border-emerald-200 bg-emerald-50 text-emerald-800",
  Optional: "border-amber-200 bg-amber-50 text-amber-800",
  "Needs Substitution": "border-rose-200 bg-rose-50 text-rose-800",
  Removed: "border-slate-200 bg-slate-50 text-slate-600",
  "Substitution Approved": "border-sky-200 bg-sky-50 text-sky-800",
};

export function ShoppingStatusPill({ status }: { status: ShoppingStatus }) {
  return (
    <span
      className={`inline-flex min-h-7 items-center rounded-full border px-2.5 text-xs font-medium ${shoppingStatusClasses[status]}`}
    >
      {status}
    </span>
  );
}

export function GroceryItemStatusPill({
  status,
}: {
  status: GroceryItemStatus;
}) {
  return (
    <span
      className={`inline-flex min-h-7 items-center rounded-full border px-2.5 text-xs font-medium ${groceryStatusClasses[status]}`}
    >
      {status}
    </span>
  );
}
