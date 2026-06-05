"use client";

import { useEffect, useMemo, useState } from "react";
import type { AuditDecision, AuditEvent, RiskLevel } from "@/data/approvals";
import {
  groceryItems,
  refundItems,
  reorderItems,
  weeklyGroceryPlan,
  type GroceryItem,
  type GroceryItemStatus,
  type GroceryPlan,
  type RefundItem,
  type ReorderItem,
  type ShoppingAction,
  type ShoppingStatus,
} from "@/data/shopping";
import { buildMockApproval, useWorkflowStore } from "@/hooks/use-workflow-store";

const groceryStorageKey = "atlas-pilot-grocery-items-v04";
const planStorageKey = "atlas-pilot-grocery-plan-v04";
const reorderStorageKey = "atlas-pilot-reorders-v04";
const refundsStorageKey = "atlas-pilot-refunds-v04";

function readStored<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const stored = window.localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

function decisionForAction(action: ShoppingAction): AuditDecision {
  if (["Approve list", "Approve prep", "Mark resolved"].includes(action)) {
    return "Approved";
  }

  if (["Save for later", "Snooze", "Add reminder"].includes(action)) {
    return "Snoozed";
  }

  if (action === "Never show this again") {
    return "Hidden";
  }

  return "Needs Review";
}

function statusForAction(action: ShoppingAction): ShoppingStatus {
  const statuses: Record<ShoppingAction, ShoppingStatus> = {
    "Approve list": "Approved",
    "Lower total": "Lowered",
    "Swap meals": "Needs Review",
    "Save for later": "Saved",
    "Never show this again": "Hidden",
    "Approve prep": "Approval Prepared",
    "Add to errand list": "Prepared",
    "Change store": "Needs Review",
    Snooze: "Snoozed",
    "Mark resolved": "Resolved",
    "Add reminder": "Reminder Added",
    "Create approval item": "Approval Prepared",
  };

  return statuses[action];
}

function createShoppingAuditEvent(
  title: string,
  action: ShoppingAction | "Grocery item updated",
  dataUsed: string,
  risk: RiskLevel = "Low",
): AuditEvent {
  const decision =
    action === "Grocery item updated" ? "Edited" : decisionForAction(action);

  return {
    id: `shopping-${title.toLowerCase().replaceAll(" ", "-")}-${Date.now()}`,
    dateTime: new Date().toISOString(),
    eventType: `Shopping ${action.toLowerCase()}`,
    relatedItem: title,
    userDecision: decision,
    dataUsed,
    assumptions:
      "Mock Shopping Prep context only. Atlas did not connect to a store, place an order, reserve a cart, or send payment.",
    riskLevel: risk,
    result:
      "Updated local pilot state and audit log only. Items are prepared, not ordered.",
    origin: "Shopping",
  };
}

export function useShoppingWorkflow() {
  const { addApproval, addAuditEvent } = useWorkflowStore();
  const [plan, setPlan] = useState<GroceryPlan>(weeklyGroceryPlan);
  const [items, setItems] = useState<GroceryItem[]>(groceryItems);
  const [reorders, setReorders] = useState<ReorderItem[]>(reorderItems);
  const [refunds, setRefunds] = useState<RefundItem[]>(refundItems);
  const [preparedApprovals, setPreparedApprovals] = useState<
    Record<string, boolean>
  >({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setPlan(readStored(planStorageKey, weeklyGroceryPlan));
    setItems(readStored(groceryStorageKey, groceryItems));
    setReorders(readStored(reorderStorageKey, reorderItems));
    setRefunds(readStored(refundsStorageKey, refundItems));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(planStorageKey, JSON.stringify(plan));
    window.localStorage.setItem(groceryStorageKey, JSON.stringify(items));
    window.localStorage.setItem(reorderStorageKey, JSON.stringify(reorders));
    window.localStorage.setItem(refundsStorageKey, JSON.stringify(refunds));
  }, [hydrated, items, plan, refunds, reorders]);

  const activeItems = useMemo(
    () => items.filter((item) => item.status !== "Removed"),
    [items],
  );

  const activeTotal = useMemo(
    () =>
      activeItems.reduce((sum, item) => sum + item.estimatedPrice, 0),
    [activeItems],
  );

  function updateGroceryItem(itemId: string, status: GroceryItemStatus) {
    const item = items.find((groceryItem) => groceryItem.id === itemId);

    if (!item) {
      return;
    }

    setItems((current) =>
      current.map((groceryItem) =>
        groceryItem.id === itemId ? { ...groceryItem, status } : groceryItem,
      ),
    );
    addAuditEvent(
      createShoppingAuditEvent(
        item.name,
        "Grocery item updated",
        `${item.category}, ${item.quantity}, estimated $${item.estimatedPrice.toFixed(2)}, status ${status}`,
      ),
    );
  }

  function updatePlan(action: ShoppingAction) {
    setPlan((current) => ({
      ...current,
      status: statusForAction(action),
      estimatedTotal:
        action === "Lower total"
          ? Math.max(199, current.estimatedTotal - 18)
          : current.estimatedTotal,
    }));

    if (action === "Approve list") {
      addApproval(
        buildMockApproval({
          id: "shopping-grocery-list-approval",
          title: "Grocery list approval",
          category: "Shopping",
          summary: "Prepared grocery list for 5 dinners under $250.",
          whyItMatters:
            "Helps avoid last-minute eating out and keeps the week organized.",
          source: "Shopping Prep weekly meal plan + grocery list",
          confidence: "Medium",
          risk: "Low",
          preview:
            "Prepared grocery list for 5 dinners under $250 using preferred grocery provider.",
          origin: "Shopping",
        }),
      );
    }

    addAuditEvent(
      createShoppingAuditEvent(
        "Weekly grocery plan",
        action,
        `Goal ${plan.goal}, estimated total $${plan.estimatedTotal}`,
      ),
    );
  }

  function updateReorder(itemId: string, action: ShoppingAction) {
    const item = reorders.find((reorder) => reorder.id === itemId);

    if (!item) {
      return;
    }

    setReorders((current) =>
      current.map((reorder) =>
        reorder.id === itemId
          ? { ...reorder, status: statusForAction(action) }
          : reorder,
      ),
    );

    if (["Approve prep", "Create approval item"].includes(action)) {
      setPreparedApprovals((current) => ({ ...current, [itemId]: true }));
      addApproval(
        buildMockApproval({
          id: `shopping-${item.id}-reorder-prep`,
          title: "Household supply reorder prep",
          category: "Shopping",
          summary: `${item.title} is prepared for approval-style review.`,
          whyItMatters: item.why,
          source: `Shopping Prep + ${item.store}`,
          confidence: "Medium",
          risk: item.risk,
          preview:
            "Prepared reorder/errand option for selected household supply.",
          origin: "Shopping",
        }),
      );
    }

    addAuditEvent(
      createShoppingAuditEvent(
        item.title,
        action,
        `${item.description}, ${item.store}, estimated $${item.estimatedTotal.toFixed(2)}`,
        item.risk,
      ),
    );
  }

  function updateRefund(itemId: string, action: ShoppingAction) {
    const item = refunds.find((refund) => refund.id === itemId);

    if (!item) {
      return;
    }

    setRefunds((current) =>
      current.map((refund) =>
        refund.id === itemId
          ? { ...refund, status: statusForAction(action) }
          : refund,
      ),
    );

    if (action === "Create approval item") {
      setPreparedApprovals((current) => ({ ...current, [itemId]: true }));
      addApproval(
        buildMockApproval({
          id: `shopping-${item.id}-refund-follow-up`,
          title: "Refund follow-up reminder",
          category: "Shopping",
          summary: item.detail,
          whyItMatters:
            "Unresolved refunds and return windows are easier to handle before they age out.",
          source: item.source,
          confidence: "Medium",
          risk: "Low",
          preview:
            "Prepare reminder to check unresolved refund or return window.",
          origin: "Shopping",
        }),
      );
    }

    addAuditEvent(
      createShoppingAuditEvent(item.title, action, `${item.detail}. ${item.source}`),
    );
  }

  return {
    activeItems,
    activeTotal,
    items,
    plan,
    preparedApprovals,
    refunds,
    reorders,
    updateGroceryItem,
    updatePlan,
    updateRefund,
    updateReorder,
  };
}
