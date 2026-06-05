"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Ban,
  CheckCircle2,
  Clock3,
  EyeOff,
  ListFilter,
  ScrollText,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { AuditEventCard } from "@/components/audit-event-card";
import { SummaryCard } from "@/components/summary-card";
import { useApprovalWorkflow } from "@/hooks/use-approval-workflow";
import type { AuditEvent } from "@/data/approvals";

type AuditFilter = "All" | "Approved" | "Snoozed" | "Rejected" | "Hidden" | "High Risk";

const filters: AuditFilter[] = [
  "All",
  "Approved",
  "Snoozed",
  "Rejected",
  "Hidden",
  "High Risk",
];

function filterEvents(events: AuditEvent[], filter: AuditFilter) {
  if (filter === "All") {
    return events;
  }

  if (filter === "High Risk") {
    return events.filter((event) =>
      ["High", "Sensitive"].includes(event.riskLevel),
    );
  }

  return events.filter((event) => event.userDecision === filter);
}

export default function AuditPage() {
  const { auditEvents, summary } = useApprovalWorkflow();
  const [activeFilter, setActiveFilter] = useState<AuditFilter>("All");

  const visibleEvents = useMemo(
    () => filterEvents(auditEvents, activeFilter),
    [activeFilter, auditEvents],
  );

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl">
        <section className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase text-atlas-sage">
              Audit Log
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-normal text-ink-950 sm:text-5xl">
              Every decision, visible.
            </h1>
            <p className="mt-3 max-w-3xl text-lg leading-8 text-ink-600">
              A mock record of recommendations, user decisions, data used,
              assumptions, risk, and result. No external systems are connected.
            </p>
          </div>
          <div className="flex min-h-12 items-center gap-3 rounded-lg border border-atlas-line bg-white/76 px-4 shadow-card">
            <ScrollText aria-hidden="true" className="text-atlas-tide" size={18} />
            <span className="text-sm font-medium text-ink-600">
              Local mock audit trail
            </span>
          </div>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <SummaryCard
            title="Total events"
            value={summary.total}
            detail="Prepared recommendations and user decisions."
            icon={ScrollText}
          />
          <SummaryCard
            title="Approved"
            value={summary.approved}
            detail="Marked approved in local pilot state."
            icon={CheckCircle2}
          />
          <SummaryCard
            title="Snoozed"
            value={summary.snoozed}
            detail="Deferred for later review."
            icon={Clock3}
          />
          <SummaryCard
            title="Rejected / hidden"
            value={summary.rejectedHidden}
            detail="Declined or removed from future display."
            icon={Ban}
          />
          <SummaryCard
            title="Sensitive / high-risk"
            value={summary.highRisk}
            detail="Items requiring more careful review."
            icon={AlertTriangle}
            tone="serious"
          />
        </section>

        <section className="mt-6 rounded-lg border border-atlas-line/80 bg-white/70 p-4 shadow-card backdrop-blur-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-atlas-line bg-atlas-cloud text-atlas-tide">
                <ListFilter aria-hidden="true" size={18} />
              </div>
              <div>
                <h2 className="text-base font-semibold text-ink-950">
                  Filter audit events
                </h2>
                <p className="text-sm leading-6 text-ink-600">
                  Review decisions by status or risk without using dense tables.
                </p>
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {filters.map((filter) => {
                const active = activeFilter === filter;

                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                    className={`min-h-10 shrink-0 rounded-full border px-3 text-sm font-medium transition ${
                      active
                        ? "border-ink-950 bg-ink-950 text-white"
                        : "border-atlas-line bg-white/80 text-ink-600 hover:bg-white"
                    }`}
                  >
                    {filter}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mt-6 space-y-4">
          {visibleEvents.length > 0 ? (
            visibleEvents.map((event) => (
              <AuditEventCard key={event.id} event={event} />
            ))
          ) : (
            <div className="rounded-lg border border-atlas-line/80 bg-white/82 p-8 text-center shadow-card">
              <EyeOff
                aria-hidden="true"
                className="mx-auto text-ink-500"
                size={24}
              />
              <h2 className="mt-4 text-lg font-semibold text-ink-950">
                No audit events in this view
              </h2>
              <p className="mt-2 text-sm leading-6 text-ink-600">
                Decisions made in the Approval Center will appear here in mock
                mode. If you reset approvals and audit events, this local trail
                starts fresh.
              </p>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
