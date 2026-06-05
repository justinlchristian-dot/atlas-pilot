"use client";

import {
  CircleDollarSign,
  PackageCheck,
  ReceiptText,
  ShoppingCart,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { GroceryListCard } from "@/components/grocery-list-card";
import { GroceryPlanCard } from "@/components/grocery-plan-card";
import { RefundCard } from "@/components/refund-card";
import { ReorderCard } from "@/components/reorder-card";
import { ShoppingRulesCard } from "@/components/shopping-rules-card";
import { StorePreferenceCard } from "@/components/store-preference-card";
import { SummaryCard } from "@/components/summary-card";
import { shoppingRules, storePreferences } from "@/data/shopping";
import {
  buildPersonalizedShoppingRules,
  getLifeAreaMode,
  personalizeGroceryPlan,
  personalizeReorders,
  personalizeStorePreferences,
} from "@/data/personalization";
import { useOnboardingProfile } from "@/hooks/use-onboarding-profile";
import { useShoppingWorkflow } from "@/hooks/use-shopping-workflow";

export default function ShoppingPage() {
  const {
    activeItems,
    activeTotal,
    plan,
    preparedApprovals,
    refunds,
    reorders,
    updateGroceryItem,
    updatePlan,
    updateRefund,
    updateReorder,
  } = useShoppingWorkflow();
  const { onboarding } = useOnboardingProfile();
  const shoppingMode = getLifeAreaMode(onboarding, "Shopping");
  const personalizedPlan = personalizeGroceryPlan(plan, onboarding);
  const personalizedReorders = personalizeReorders(reorders, onboarding);
  const personalizedStorePreferences = personalizeStorePreferences(
    storePreferences,
    onboarding,
  );
  const personalizedRules = buildPersonalizedShoppingRules(
    shoppingRules,
    onboarding,
  );

  const reorderTotal = personalizedReorders
    .filter((item) => item.status !== "Hidden")
    .reduce((sum, item) => sum + item.estimatedTotal, 0);
  const reviewCount =
    personalizedReorders.filter((item) => item.status !== "Hidden").length +
    refunds.filter((item) => item.status === "Needs Review").length;

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl">
        <section className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase text-atlas-sage">
              Shopping Prep
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-normal text-ink-950 sm:text-5xl">
              Prepared, not ordered.
            </h1>
            <p className="mt-3 max-w-3xl text-lg leading-8 text-ink-600">
              Atlas can organize groceries, reorders, returns, and store rules
              with mock data only. Nothing is sent to grocery providers,
              household suppliers, hardware providers, bulk stores, or any payment system.
            </p>
          </div>
          <div className="rounded-lg border border-atlas-line bg-white/76 p-4 shadow-card">
            <p className="text-xs font-semibold uppercase text-ink-500">
              Guardrail
            </p>
            <p className="mt-2 text-sm leading-6 text-ink-600">
              Approval is a local pilot decision. No carts, checkout, payments,
              subscriptions, or external links are triggered.
            </p>
          </div>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            title="Grocery estimate"
            value={shoppingMode === "Off" ? "Off" : `$${personalizedPlan.estimatedTotal}`}
            detail={
              shoppingMode === "Off"
                ? "Shopping is off in your Life Areas."
                : personalizedPlan.goal
            }
            icon={CircleDollarSign}
          />
          <SummaryCard
            title="Active list items"
            value={activeItems.length}
            detail={`Current item estimate is $${activeTotal.toFixed(2)}.`}
            icon={ShoppingCart}
          />
          <SummaryCard
            title="Supply reorder estimate"
            value={`$${reorderTotal.toFixed(2)}`}
            detail="Prepared for review only."
            icon={PackageCheck}
          />
          <SummaryCard
            title="Review queue"
            value={reviewCount}
            detail="Reorders and refund items needing attention."
            icon={ReceiptText}
            tone="serious"
          />
        </section>

        <section className="mt-6">
          {shoppingMode === "Off" ? (
            <article className="rounded-lg border border-atlas-line/80 bg-white/82 p-5 shadow-card">
              <p className="text-sm font-semibold text-ink-950">
                Shopping is off in your Life Areas.
              </p>
              <p className="mt-2 text-sm leading-6 text-ink-600">
                Shopping prep is disabled in the main pilot view. Prepared, not
                ordered remains the rule if you re-enable it.
              </p>
            </article>
          ) : (
            <GroceryPlanCard plan={personalizedPlan} onAction={updatePlan} />
          )}
        </section>

        {shoppingMode === "Off" ? null : (
          <section className="mt-6">
            <GroceryListCard
              items={activeItems}
              total={activeTotal}
              onUpdate={updateGroceryItem}
            />
          </section>
        )}

        <section className="mt-8">
          <div>
            <p className="text-sm font-medium uppercase text-atlas-sage">
              Household supply reorders
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-normal text-ink-950">
              Cart-style prep, no checkout.
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-ink-600">
              These cards explain what Atlas would prepare for approval. No real
              grocery, household supplier, hardware, or bulk store integration exists.
            </p>
          </div>
          <div className="mt-4 grid gap-4 xl:grid-cols-2">
            {shoppingMode === "Off" ? (
              <div className="rounded-lg border border-atlas-line bg-white/82 p-5 text-sm leading-6 text-ink-600">
                Shopping is off in your Life Areas.
              </div>
            ) : personalizedReorders.map((item) => (
              <ReorderCard
                key={item.id}
                item={item}
                approvalPrepared={preparedApprovals[item.id] ?? false}
                onAction={updateReorder}
              />
            ))}
          </div>
        </section>

        <section className="mt-8">
          <div>
            <p className="text-sm font-medium uppercase text-atlas-sage">
              Return / refund tracker
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-normal text-ink-950">
              Follow-ups worth watching.
            </h2>
          </div>
          <div className="mt-4 grid gap-4 xl:grid-cols-3">
            {refunds.map((item) => (
              <RefundCard
                key={item.id}
                item={item}
                approvalPrepared={preparedApprovals[item.id] ?? false}
                onAction={updateRefund}
              />
            ))}
          </div>
        </section>

        <section className="mt-8">
          <div>
            <p className="text-sm font-medium uppercase text-atlas-sage">
              Store preferences
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-normal text-ink-950">
              Where Atlas should stage ideas.
            </h2>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {personalizedStorePreferences.map((preference) => (
              <StorePreferenceCard
                key={preference.store}
                preference={preference}
              />
            ))}
          </div>
        </section>

        <section className="mt-8">
          <ShoppingRulesCard rules={personalizedRules} />
        </section>
      </div>
    </AppShell>
  );
}
