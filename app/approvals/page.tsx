"use client";

import { AlertTriangle, CheckCircle2, ClipboardList, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ApprovalCard } from "@/components/approval-card";
import { SummaryCard } from "@/components/summary-card";
import { useApprovalWorkflow } from "@/hooks/use-approval-workflow";

export default function ApprovalsPage() {
  const { approvalItems, recordDecision } = useApprovalWorkflow();
  const needsReview = approvalItems.filter(
    (item) => item.status === "Needs Review",
  ).length;
  const actedOn = approvalItems.length - needsReview;
  const highRisk = approvalItems.filter((item) =>
    ["High", "Sensitive"].includes(item.risk),
  ).length;

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl">
        <section className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase text-atlas-sage">
              Approval Center
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-normal text-ink-950 sm:text-5xl">
              Review before Atlas acts.
            </h1>
            <p className="mt-3 max-w-3xl text-lg leading-8 text-ink-600">
              These are mock recommendations only. Approval changes local pilot state
              and writes an audit event, but nothing is sent, ordered, paid, or changed.
            </p>
          </div>
          <div className="rounded-lg border border-atlas-line bg-white/76 p-4 shadow-card">
            <p className="text-xs font-semibold uppercase text-ink-500">
              Operating mode
            </p>
            <p className="mt-2 text-sm leading-6 text-ink-600">
              Read-only by default. Explicit approval required for external action.
            </p>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <SummaryCard
            title="Needs review"
            value={needsReview}
            detail="Recommendations waiting on a user decision."
            icon={ClipboardList}
          />
          <SummaryCard
            title="Decisions recorded"
            value={actedOn}
            detail="Local mock decisions written to the audit log."
            icon={CheckCircle2}
          />
          <SummaryCard
            title="High-risk review"
            value={highRisk}
            detail="Items that need slower, documented review."
            icon={AlertTriangle}
            tone="serious"
          />
        </section>

        <section className="mt-6 rounded-lg border border-atlas-line/80 bg-white/70 p-5 shadow-card backdrop-blur-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-atlas-line bg-atlas-cloud text-atlas-sage">
              <ShieldCheck aria-hidden="true" size={19} strokeWidth={1.8} />
            </div>
            <p className="text-sm leading-6 text-ink-600">
              Legal / HOA recommendations are draft-only and require review. Atlas
              does not provide legal advice and does not send messages in this pilot.
            </p>
          </div>
        </section>

        <section className="mt-6 space-y-4">
          {approvalItems.map((item) => (
            <ApprovalCard
              key={item.id}
              item={item}
              onDecision={recordDecision}
            />
          ))}
        </section>
      </div>
    </AppShell>
  );
}
