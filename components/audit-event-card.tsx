import { ClipboardCheck, Clock } from "lucide-react";
import type { AuditEvent } from "@/data/approvals";
import { ApprovalStatusPill, RiskPill } from "@/components/approval-pills";

function formatEventTime(timestamp: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

export function AuditEventCard({ event }: { event: AuditEvent }) {
  return (
    <article className="rounded-lg border border-atlas-line/80 bg-white/86 p-5 shadow-card backdrop-blur-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex min-h-7 items-center gap-2 rounded-full border border-atlas-line bg-atlas-cloud px-2.5 text-xs font-medium text-ink-600">
              <Clock aria-hidden="true" size={13} />
              {formatEventTime(event.dateTime)}
            </span>
            <ApprovalStatusPill status={event.userDecision} />
            <RiskPill risk={event.riskLevel} />
            <span className="inline-flex min-h-7 items-center rounded-full border border-atlas-line bg-white px-2.5 text-xs font-medium text-ink-600">
              {event.origin}
            </span>
          </div>
          <h2 className="mt-4 text-lg font-semibold text-ink-950">
            {event.relatedItem}
          </h2>
          <p className="mt-1 text-sm font-medium text-atlas-tide">
            {event.eventType}
          </p>
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-atlas-line bg-atlas-cloud text-atlas-sage">
          <ClipboardCheck aria-hidden="true" size={20} strokeWidth={1.8} />
        </div>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        <div className="rounded-lg border border-atlas-line bg-atlas-cloud/70 p-4">
          <p className="text-xs font-semibold uppercase text-ink-500">
            Data used
          </p>
          <p className="mt-2 text-sm leading-6 text-ink-700">
            {event.dataUsed}
          </p>
        </div>
        <div className="rounded-lg border border-atlas-line bg-atlas-cloud/70 p-4">
          <p className="text-xs font-semibold uppercase text-ink-500">
            Assumptions
          </p>
          <p className="mt-2 text-sm leading-6 text-ink-700">
            {event.assumptions}
          </p>
        </div>
        <div className="rounded-lg border border-atlas-line bg-atlas-cloud/70 p-4">
          <p className="text-xs font-semibold uppercase text-ink-500">Result</p>
          <p className="mt-2 text-sm leading-6 text-ink-700">{event.result}</p>
        </div>
      </div>
    </article>
  );
}
