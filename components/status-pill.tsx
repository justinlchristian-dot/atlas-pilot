import type { Status } from "@/data/today";

const statusClasses: Record<Status, string> = {
  Good: "border-emerald-200 bg-emerald-50 text-emerald-800",
  Watch: "border-amber-200 bg-amber-50 text-amber-800",
  "Needs Attention": "border-rose-200 bg-rose-50 text-rose-800",
  Quiet: "border-slate-200 bg-slate-50 text-slate-600",
};

export function StatusPill({ status }: { status: Status }) {
  return (
    <span
      className={`inline-flex min-h-7 items-center rounded-full border px-2.5 text-xs font-medium ${statusClasses[status]}`}
    >
      {status}
    </span>
  );
}
