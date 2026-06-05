"use client";

import {
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  Home,
  ShieldAlert,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { HomeOperationCard } from "@/components/home-operation-card";
import { LifeMapCategoryCard } from "@/components/life-map-category-card";
import { SummaryCard } from "@/components/summary-card";
import { lifeMapCategories } from "@/data/life-map";
import {
  filterPrimaryHouseholdOperations,
  getLifeAreaMode,
  personalizeLifeMapCategories,
  shouldShowHouseholdSetupNeeded,
} from "@/data/personalization";
import { useHomeOperations } from "@/hooks/use-home-operations";
import { useOnboardingProfile } from "@/hooks/use-onboarding-profile";

export default function CommandPage() {
  const { items, preparedApprovals, updateItem } = useHomeOperations();
  const { onboarding } = useOnboardingProfile();
  const personalizedCategories = personalizeLifeMapCategories(
    lifeMapCategories,
    onboarding,
  );
  const visibleHomeItems = filterPrimaryHouseholdOperations(items, onboarding);
  const householdMode = getLifeAreaMode(onboarding, "Household");
  const householdSetupNeeded = shouldShowHouseholdSetupNeeded(onboarding);
  const totalEntities = personalizedCategories.reduce(
    (sum, category) => sum + category.entities.length,
    0,
  );
  const reviewEntities = personalizedCategories.reduce(
    (sum, category) =>
      sum +
      category.entities.filter((entity) =>
        ["Unknown", "Needs Review", "Sensitive"].includes(
          entity.state,
        ),
      ).length,
    0,
  );
  const activeHomeTasks = visibleHomeItems.filter((item) => item.status !== "Hidden").length;
  const urgentHomeTasks = visibleHomeItems.filter((item) =>
    ["Needs Attention", "Watch"].includes(item.status),
  ).length;

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl">
        <section className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase text-atlas-sage">
              Life Map
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-normal text-ink-950 sm:text-5xl">
              What Atlas understands.
            </h1>
            <p className="mt-3 max-w-3xl text-lg leading-8 text-ink-600">
              A private mock profile of the people, routines, obligations, and
              operating details Atlas can use to prepare better recommendations.
            </p>
          </div>
          <div className="rounded-lg border border-atlas-line bg-white/76 p-4 shadow-card">
            <p className="text-xs font-semibold uppercase text-ink-500">
              Universal pilot guardrail
            </p>
            <p className="mt-2 text-sm leading-6 text-ink-600">
              Organization only. Atlas does not connect integrations or take
              external action from this page.
            </p>
          </div>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            title="Life areas"
            value={personalizedCategories.length}
            detail="Enabled, quiet, and off areas reflect onboarding preferences."
            icon={ClipboardList}
          />
          <SummaryCard
            title="Mapped entities"
            value={totalEntities}
            detail="Known, detected, estimated, and unknown items."
            icon={CheckCircle2}
          />
          <SummaryCard
            title="Needs review"
            value={reviewEntities}
            detail="Unknown or review-needed items to confirm over time."
            icon={AlertTriangle}
            tone="serious"
          />
          <SummaryCard
            title="Household"
            value={activeHomeTasks}
            detail={
              householdMode === "Off"
                ? "Household is off in your Life Areas."
                : `${urgentHomeTasks} selected home tasks are worth watching now.`
            }
            icon={Home}
          />
        </section>

        <section className="mt-6 rounded-lg border border-rose-200 bg-rose-50/70 p-5 shadow-card">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-rose-200 bg-white/70 text-atlas-rose">
              <ShieldAlert aria-hidden="true" size={19} strokeWidth={1.8} />
            </div>
            <p className="text-sm leading-6 text-rose-900">
              Sensitive/legal items are separated for organization and review only.
              Atlas does not provide legal, financial, or medical advice in this pilot.
            </p>
          </div>
        </section>

        <section className="mt-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-normal text-ink-950">
                Life Map categories
              </h2>
              <p className="mt-2 text-sm leading-6 text-ink-600">
                Knowledge states make it clear what Atlas knows, estimates, and
                still needs you to review.
              </p>
            </div>
          </div>
          <div className="mt-4 grid gap-4 xl:grid-cols-2">
            {personalizedCategories.map((category) => (
              <LifeMapCategoryCard
                key={category.id}
                category={category}
                personalizationMode={category.personalizationMode}
              />
            ))}
          </div>
        </section>

        <section className="mt-10">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase text-atlas-sage">
                Household
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-normal text-ink-950">
                Practical household rhythm.
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-ink-600">
                Household turns the Life Map into mock tasks for everyday
                maintenance. Actions update local state and write mock audit events only.
              </p>
            </div>
            <span className="inline-flex min-h-9 items-center rounded-full border border-atlas-line bg-white/80 px-3 text-sm font-medium text-ink-600">
              {householdMode === "Off" ? "Off" : `${visibleHomeItems.length} selected routines`}
            </span>
          </div>

          {householdSetupNeeded ? (
            <div className="mt-4 rounded-lg border border-atlas-line bg-white/82 p-5 shadow-card">
              <p className="text-sm font-semibold text-ink-950">
                No household routines selected yet.
              </p>
              <p className="mt-2 text-sm leading-6 text-ink-600">
                Atlas can ask later. Add items like air filters, pool, plants,
                or safety checks in onboarding when you want household support.
              </p>
            </div>
          ) : null}

          {householdMode === "Off" ? (
            <div className="mt-4 rounded-lg border border-atlas-line bg-white/82 p-5 shadow-card">
              <p className="text-sm font-semibold text-ink-950">
                Household is off in your Life Areas.
              </p>
              <p className="mt-2 text-sm leading-6 text-ink-600">
                Household routines are hidden from primary action cards until
                you re-enable the area.
              </p>
            </div>
          ) : (
            <div className="mt-4 grid gap-4 xl:grid-cols-2">
              {visibleHomeItems.map((item) => (
                <HomeOperationCard
                  key={item.id}
                  item={item}
                  approvalPrepared={preparedApprovals[item.id] ?? false}
                  onAction={updateItem}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
