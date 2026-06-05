import type {
  ApprovalStatus,
  Confidence,
  RiskLevel,
} from "@/data/approvals";

const confidenceClasses: Record<Confidence, string> = {
  High: "border-emerald-200 bg-emerald-50 text-emerald-800",
  Medium: "border-amber-200 bg-amber-50 text-amber-800",
  Low: "border-slate-200 bg-slate-50 text-slate-600",
};

const riskClasses: Record<RiskLevel, string> = {
  Low: "border-emerald-200 bg-emerald-50 text-emerald-800",
  Medium: "border-amber-200 bg-amber-50 text-amber-800",
  High: "border-rose-200 bg-rose-50 text-rose-800",
  Sensitive: "border-rose-300 bg-rose-50 text-rose-900",
};

const statusClasses: Record<ApprovalStatus, string> = {
  "Needs Review": "border-atlas-tide/30 bg-atlas-tide/10 text-atlas-tide",
  Approved: "border-emerald-200 bg-emerald-50 text-emerald-800",
  Edited: "border-sky-200 bg-sky-50 text-sky-800",
  Snoozed: "border-amber-200 bg-amber-50 text-amber-800",
  Rejected: "border-rose-200 bg-rose-50 text-rose-800",
  Hidden: "border-slate-200 bg-slate-50 text-slate-600",
};

type PillProps = {
  label: string;
  className: string;
};

function Pill({ label, className }: PillProps) {
  return (
    <span
      className={`inline-flex min-h-7 items-center rounded-full border px-2.5 text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
}

export function ConfidencePill({ confidence }: { confidence: Confidence }) {
  return (
    <Pill
      label={`${confidence} confidence`}
      className={confidenceClasses[confidence]}
    />
  );
}

export function RiskPill({ risk }: { risk: RiskLevel }) {
  return <Pill label={`${risk} risk`} className={riskClasses[risk]} />;
}

export function ApprovalStatusPill({ status }: { status: ApprovalStatus }) {
  return <Pill label={status} className={statusClasses[status]} />;
}
