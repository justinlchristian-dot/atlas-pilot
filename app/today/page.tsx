"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  CloudSun,
  Home,
  LockKeyhole,
  ScrollText,
  ShieldCheck,
  ShoppingCart,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import {
  ConfidencePill,
  RiskPill,
} from "@/components/approval-pills";
import { ApprovalStatusPill } from "@/components/approval-pills";
import { PilotModeCard } from "@/components/pilot-mode-card";
import { StatusPill } from "@/components/status-pill";
import { homeOperations } from "@/data/life-map";
import { refundItems, reorderItems, weeklyGroceryPlan } from "@/data/shopping";
import {
  getEnabledLifeAreaNames,
  getLifeAreaMode,
  isLifeAreaEnabled,
} from "@/data/personalization";
import {
  getOnboardingDisplayName,
} from "@/data/onboarding";
import type { ApprovalItem, AuditEvent } from "@/data/approvals";
import { useOnboardingProfile } from "@/hooks/use-onboarding-profile";
import { useWorkflowStore } from "@/hooks/use-workflow-store";

function formatEventTime(dateTime: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(dateTime));
}

function buildDailyBrief(
  approvals: ApprovalItem[],
  onboarding: ReturnType<typeof useOnboardingProfile>["onboarding"],
) {
  const needsReview = approvals.filter(
    (approval) => approval.status === "Needs Review",
  );
  const highRisk = needsReview.filter((approval) =>
    ["High", "Sensitive"].includes(approval.risk),
  );
  const shopping = needsReview.filter((approval) => approval.origin === "Shopping");
  const home = needsReview.filter((approval) => approval.origin === "Household");
  const enabledLifeAreas = getEnabledLifeAreaNames(onboarding);
  const parts: string[] = [];

  if (enabledLifeAreas.length > 0) {
    parts.push(`Enabled life areas today: ${enabledLifeAreas.slice(0, 5).join(", ")}`);
  }

  if (needsReview.length > 0) {
    parts.push(`${needsReview.length} approval item${needsReview.length === 1 ? "" : "s"} need review`);
  } else {
    parts.push("No approval items are waiting");
  }

  if (highRisk.length > 0) {
    const legalMode = getLifeAreaMode(onboarding, "Legal / Risk");
    parts.push(
      legalMode === "Off" || legalMode === "Quiet"
        ? `${highRisk.length} sensitive item${highRisk.length === 1 ? "" : "s"} are available for calm review only`
        : `${highRisk.length} high-risk or sensitive item${highRisk.length === 1 ? "" : "s"} need careful review`,
    );
  }

  if (shopping.length > 0 && isLifeAreaEnabled(onboarding, "Shopping")) {
    parts.push(`${shopping.length} shopping item${shopping.length === 1 ? "" : "s"} are prepared`);
  }

  if (home.length > 0 && isLifeAreaEnabled(onboarding, "Household")) {
    parts.push(`${home.length} home operation recommendation${home.length === 1 ? "" : "s"} are prepared`);
  }

  return `${parts.join(". ")}. Nothing happens without your approval.`;
}

function buildTopFive(
  approvals: ApprovalItem[],
  events: AuditEvent[],
  onboarding: ReturnType<typeof useOnboardingProfile>["onboarding"],
) {
  const needsReview = approvals.filter(
    (approval) => approval.status === "Needs Review",
  );
  const highRisk = needsReview.some((approval) =>
    ["High", "Sensitive"].includes(approval.risk),
  );
  const shopping = needsReview.some((approval) => approval.origin === "Shopping");
  const home = needsReview.some((approval) => approval.origin === "Household");
  const items: string[] = [];

  if (needsReview.length > 0) {
    items.push("Review approval queue");
  }

  if (highRisk) {
    items.push("Review high-risk draft-only item");
  }

  if (shopping && isLifeAreaEnabled(onboarding, "Shopping")) {
    items.push("Review prepared shopping list or reorder");
  }

  if (home && isLifeAreaEnabled(onboarding, "Household")) {
    items.push("Review household recommendation");
  }

  if (
    events.length > 0 &&
    (isLifeAreaEnabled(onboarding, "Work") ||
      isLifeAreaEnabled(onboarding, "Projects"))
  ) {
    items.push("Check recent Atlas activity");
  }

  return [...items.slice(0, 4), "Check Today brief for anything new"];
}

function StatusMetric({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-lg border border-atlas-line bg-white/76 px-4 py-3 shadow-card">
      <p className="text-xs font-semibold uppercase text-ink-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-ink-950">{value}</p>
    </div>
  );
}

function NeedsApprovalCard({ approvals }: { approvals: ApprovalItem[] }) {
  const visible = approvals.slice(0, 4);

  return (
    <article className="rounded-lg border border-atlas-line/80 bg-white/86 p-5 shadow-card backdrop-blur-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-atlas-line bg-atlas-cloud text-atlas-tide">
            <ClipboardList aria-hidden="true" size={19} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-ink-950">
              Needs Approval
            </h2>
            <p className="mt-1 text-sm text-ink-500">
              Shared queue from all modules
            </p>
          </div>
        </div>
        <StatusPill status={approvals.length > 0 ? "Needs Attention" : "Good"} />
      </div>

      <div className="mt-5 space-y-3">
        {visible.length > 0 ? (
          visible.map((approval) => (
            <div
              key={approval.id}
              className="rounded-lg border border-atlas-line bg-atlas-cloud/70 p-3"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-ink-950">
                    {approval.title}
                  </p>
                  <p className="mt-1 text-xs text-ink-500">
                    {approval.category} · {approval.origin}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <RiskPill risk={approval.risk} />
                  <ConfidencePill confidence={approval.confidence} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-lg border border-atlas-line bg-atlas-cloud/70 p-4 text-sm leading-6 text-ink-600">
            No approval items waiting.
          </div>
        )}
      </div>

      <Link
        href="/approvals"
        className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-lg border border-ink-950 bg-ink-950 px-3 text-sm font-medium text-white"
      >
        Open approvals
        <ArrowRight aria-hidden="true" size={16} />
      </Link>
    </article>
  );
}

function RecentActivityCard({ events }: { events: AuditEvent[] }) {
  const visible = events.slice(0, 4);

  return (
    <article className="rounded-lg border border-atlas-line/80 bg-white/86 p-5 shadow-card backdrop-blur-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-atlas-line bg-atlas-cloud text-atlas-sage">
            <ScrollText aria-hidden="true" size={19} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-ink-950">
              Recent Activity
            </h2>
            <p className="mt-1 text-sm text-ink-500">
              Latest local audit events
            </p>
          </div>
        </div>
        <StatusPill status={events.length > 0 ? "Watch" : "Quiet"} />
      </div>

      <div className="mt-5 space-y-3">
        {visible.length > 0 ? (
          visible.map((event) => (
            <div
              key={event.id}
              className="rounded-lg border border-atlas-line bg-atlas-cloud/70 p-3"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-ink-950">
                    {event.relatedItem}
                  </p>
                  <p className="mt-1 text-xs text-ink-500">
                    {event.origin} · {formatEventTime(event.dateTime)}
                  </p>
                </div>
                <ApprovalStatusPill status={event.userDecision} />
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-lg border border-atlas-line bg-atlas-cloud/70 p-4 text-sm leading-6 text-ink-600">
            No recent activity yet.
          </div>
        )}
      </div>

      <Link
        href="/audit"
        className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-lg border border-atlas-line bg-white px-3 text-sm font-medium text-ink-700"
      >
        Open audit log
        <ArrowRight aria-hidden="true" size={16} />
      </Link>
    </article>
  );
}

function SimpleStatusCard({
  title,
  icon: Icon,
  status,
  items,
  href,
  linkLabel,
}: {
  title: string;
  icon: typeof Home;
  status: "Good" | "Watch" | "Needs Attention" | "Quiet";
  items: string[];
  href: string;
  linkLabel: string;
}) {
  return (
    <article className="rounded-lg border border-atlas-line/80 bg-white/86 p-5 shadow-card backdrop-blur-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-atlas-line bg-atlas-cloud text-atlas-tide">
            <Icon aria-hidden="true" size={19} />
          </div>
          <h2 className="text-base font-semibold text-ink-950">{title}</h2>
        </div>
        <StatusPill status={status} />
      </div>
      <div className="mt-5 space-y-2">
        {items.map((item) => (
          <div
            key={item}
            className="rounded-lg border border-atlas-line bg-atlas-cloud/70 px-3 py-2 text-sm leading-6 text-ink-700"
          >
            {item}
          </div>
        ))}
      </div>
      <Link
        href={href}
        className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-lg border border-atlas-line bg-white px-3 text-sm font-medium text-ink-700"
      >
        {linkLabel}
        <ArrowRight aria-hidden="true" size={16} />
      </Link>
    </article>
  );
}

export default function TodayPage() {
  const { approvalItems, auditEvents, summary } = useWorkflowStore();
  const { onboarding } = useOnboardingProfile();
  const displayName = getOnboardingDisplayName(onboarding);

  const needsReview = approvalItems.filter(
    (approval) => approval.status === "Needs Review",
  );
  const highRiskApprovals = needsReview.filter((approval) =>
    ["High", "Sensitive"].includes(approval.risk),
  );
  const recentActions = auditEvents.length;
  const topFive = buildTopFive(approvalItems, auditEvents, onboarding);
  const dailyBrief = buildDailyBrief(approvalItems, onboarding);
  const greeting = displayName
    ? `Good morning, ${displayName}.`
    : "Good morning.";

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl">
        <section className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase text-atlas-sage">
              Atlas Pilot v1.4
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-normal text-ink-950 sm:text-5xl">
              {greeting}
            </h1>
            <p className="mt-3 text-lg leading-8 text-ink-600">
              Here&apos;s what matters today.
            </p>
          </div>
          <div className="flex min-h-12 items-center gap-3 rounded-lg border border-atlas-line bg-white/76 px-4 shadow-card">
            <LockKeyhole
              aria-hidden="true"
              className="text-atlas-sage"
              size={18}
            />
            <span className="text-sm font-medium text-ink-600">
              Prepared, not ordered. Mock data only.
            </span>
          </div>
        </section>

        <section className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatusMetric
            label="Approvals needing review"
            value={summary.needsReview}
          />
          <StatusMetric label="High-risk items" value={highRiskApprovals.length} />
          <StatusMetric label="Recent actions" value={recentActions} />
          <StatusMetric label="Operating mode" value="Prepared" />
        </section>

        <section className="mt-6 grid gap-4 xl:grid-cols-[1fr_0.65fr]">
          <PilotModeCard />
          <article className="rounded-lg border border-atlas-line/80 bg-white/86 p-5 shadow-card">
            <h2 className="text-lg font-semibold text-ink-950">
              {displayName ? "Testing Atlas?" : "No onboarding profile yet"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-ink-600">
              {displayName
                ? "Use the Pilot Guide for what to test, what not to enter, and what feedback helps most."
                : "You can use the demo profile or complete setup. Onboarding stores only local pilot data in this browser."}
            </p>
            <Link
              href={displayName ? "/pilot-guide" : "/onboarding"}
              className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg border border-atlas-line bg-white px-3 text-sm font-semibold text-ink-700"
            >
              {displayName ? "Open Pilot Guide" : "Open setup"}
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </article>
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-[1.35fr_0.9fr]">
          <article className="rounded-lg border border-atlas-line/80 bg-white/86 p-6 shadow-soft backdrop-blur-sm sm:p-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-ink-950 text-white">
                    <ShieldCheck aria-hidden="true" size={21} strokeWidth={1.8} />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-ink-950">
                      Daily Brief
                    </h2>
                    <p className="text-sm text-ink-500">
                      Live from the local pilot workflow store
                    </p>
                  </div>
                </div>
                <p className="mt-6 max-w-3xl text-lg leading-8 text-ink-600">
                  {dailyBrief}
                </p>
              </div>
              <StatusPill
                status={needsReview.length > 0 ? "Needs Attention" : "Good"}
              />
            </div>
          </article>

          <article className="rounded-lg border border-atlas-line/80 bg-ink-950 p-6 text-white shadow-soft sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-white/64">
                  Today&apos;s Top 5
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-normal">
                  Deterministic priorities
                </h2>
              </div>
              <CheckCircle2
                aria-hidden="true"
                size={24}
                className="text-white/72"
              />
            </div>
            <ol className="mt-6 space-y-3">
              {topFive.map((item, index) => (
                <li key={item} className="flex gap-3 text-sm leading-6 text-white/82">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white">
                    {index + 1}
                  </span>
                  <span className="pt-0.5">{item}</span>
                </li>
              ))}
            </ol>
          </article>
        </section>

        <section className="mt-4 grid gap-4 xl:grid-cols-2">
          <NeedsApprovalCard approvals={needsReview} />
          <RecentActivityCard events={auditEvents} />
        </section>

        <section className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <SimpleStatusCard
            title="Household Status"
            icon={Home}
            status="Watch"
            items={
              getLifeAreaMode(onboarding, "Household") === "Off"
                ? ["Household is off in your Life Areas.", "Atlas can ask later if you want to add routines."]
                : [
                    "Household check due",
                    "Air filters due in 9 days",
                    "Watering review in watch mode",
                    "HVAC seasonal prep watch",
                  ]
            }
            href="/command"
            linkLabel={`Open Household (${homeOperations.length})`}
          />
          <SimpleStatusCard
            title="Shopping Status"
            icon={ShoppingCart}
            status="Watch"
            items={
              getLifeAreaMode(onboarding, "Shopping") === "Off"
                ? ["Shopping is off in your Life Areas.", "Prepared shopping actions are deemphasized."]
                : [
                    `${weeklyGroceryPlan.goal} prepared`,
                    `${reorderItems.length} household reorders available`,
                    `${refundItems.length} refund/return items being tracked`,
                    "Store preferences are flexible",
                  ]
            }
            href="/shopping"
            linkLabel="Open Shopping Prep"
          />
          <SimpleStatusCard
            title="Trust / Safety Summary"
            icon={ShieldCheck}
            status="Good"
            items={[
              "Read-only pilot",
              "Mock data only",
              "Prepared, not ordered",
              "Approval required for all external actions",
              "Audit log active",
              "You can hide recommendations that do not apply",
            ]}
            href="/audit"
            linkLabel="Review audit trail"
          />
          <SimpleStatusCard
            title="Weather Impact"
            icon={CloudSun}
            status="Watch"
            items={[
              "Mock pilot weather",
              "Hotter than normal this week",
              "Household routines like pool care, watering, or HVAC may need extra attention",
            ]}
            href="/command"
            linkLabel="Open home context"
          />
          <SimpleStatusCard
            title="Calendar Summary"
            icon={CalendarDays}
            status="Good"
            items={[
              "Mock pilot calendar",
              "One meeting this afternoon",
              "Open morning block available",
            ]}
            href="/calendar"
            linkLabel="Open calendar"
          />
        </section>
      </div>
    </AppShell>
  );
}
