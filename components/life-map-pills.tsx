import type { KnowledgeState } from "@/data/life-map";
import type { Status } from "@/data/today";

const knowledgeClasses: Record<KnowledgeState, string> = {
  Known: "border-emerald-200 bg-emerald-50 text-emerald-800",
  Detected: "border-sky-200 bg-sky-50 text-sky-800",
  Estimated: "border-amber-200 bg-amber-50 text-amber-800",
  Unknown: "border-slate-200 bg-slate-50 text-slate-600",
  "Needs Review": "border-rose-200 bg-rose-50 text-rose-800",
  Sensitive: "border-rose-300 bg-rose-50 text-rose-900",
};

const statusClasses: Record<Status, string> = {
  Good: "border-emerald-200 bg-emerald-50 text-emerald-800",
  Watch: "border-amber-200 bg-amber-50 text-amber-800",
  "Needs Attention": "border-rose-200 bg-rose-50 text-rose-800",
  Quiet: "border-slate-200 bg-slate-50 text-slate-600",
};

export function KnowledgePill({ state }: { state: KnowledgeState }) {
  return (
    <span
      className={`inline-flex min-h-7 items-center rounded-full border px-2.5 text-xs font-medium ${knowledgeClasses[state]}`}
    >
      {state}
    </span>
  );
}

export function MapStatusPill({ status }: { status: Status }) {
  return (
    <span
      className={`inline-flex min-h-7 items-center rounded-full border px-2.5 text-xs font-medium ${statusClasses[status]}`}
    >
      {status}
    </span>
  );
}
