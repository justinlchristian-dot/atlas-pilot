"use client";

import { useEffect, useState } from "react";
import type { AuditDecision, AuditEvent } from "@/data/approvals";
import {
  homeOperations,
  type HomeOperation,
  type HomeOperationAction,
  type HomeOperationStatus,
} from "@/data/life-map";
import { buildMockApproval, useWorkflowStore } from "@/hooks/use-workflow-store";

const homeOperationsStorageKey = "atlas-pilot-home-operations-v03";

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

function decisionForAction(action: HomeOperationAction): AuditDecision {
  if (action === "Marked Done") {
    return "Approved";
  }

  if (action === "Approval Prepared") {
    return "Needs Review";
  }

  if (action === "Hidden") {
    return "Hidden";
  }

  return "Snoozed";
}

function statusForAction(action: HomeOperationAction): HomeOperationStatus {
  if (action === "Marked Done") {
    return "Good";
  }

  if (action === "Approval Prepared") {
    return "Needs Attention";
  }

  if (action === "Hidden") {
    return "Hidden";
  }

  return "Quiet";
}

function createHomeAuditEvent(
  item: HomeOperation,
  action: HomeOperationAction,
): AuditEvent {
  const resultByAction: Record<HomeOperationAction, string> = {
    "Marked Done":
      "Marked done in local Household state. No reminder or external update occurred.",
    Snoozed:
      "Snoozed in local Household state. No reminder was scheduled.",
    "Approval Prepared":
      "Mock approval item prepared locally. No purchase, message, or task was created outside Atlas.",
    Hidden:
      "Suppressed locally from Household. No external settings were changed.",
  };

  return {
    id: `home-${item.id}-${action.toLowerCase().replaceAll(" ", "-")}-${Date.now()}`,
    dateTime: new Date().toISOString(),
    eventType: `Home operation ${action.toLowerCase()}`,
    relatedItem: item.name,
    userDecision: decisionForAction(action),
    dataUsed: `Household mock profile: ${item.frequency}, next due ${item.nextDue}, supplies ${item.supplies}`,
    assumptions:
      "Based on mock Life Map context only. Atlas did not trigger a real reminder, order, or integration.",
    riskLevel: item.name.toLowerCase().includes("safety") ? "Medium" : "Low",
    result: resultByAction[action],
    origin: "Household",
  };
}

function homeApprovalForItem(item: HomeOperation) {
  return buildMockApproval({
    id: `household-${item.id}-approval-prep`,
    title: `${item.name} approval prep`,
    category: "Household",
    summary: `${item.name} is prepared for review.`,
    whyItMatters: item.whyItMatters,
    source: "Household",
    confidence: item.confidence,
    risk: item.status === "Needs Attention" ? "Medium" : "Low",
    preview: `Prepare review item for ${item.name}. Supplies: ${item.supplies}.`,
    origin: "Household",
    reviewRecommended: item.status === "Needs Attention",
  });
}

export function useHomeOperations() {
  const { addApproval, addAuditEvent } = useWorkflowStore();
  const [items, setItems] = useState<HomeOperation[]>(homeOperations);
  const [preparedApprovals, setPreparedApprovals] = useState<
    Record<string, boolean>
  >({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(readStored(homeOperationsStorageKey, homeOperations));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(homeOperationsStorageKey, JSON.stringify(items));
  }, [hydrated, items]);

  function updateItem(itemId: string, action: HomeOperationAction) {
    const item = items.find((operation) => operation.id === itemId);

    if (!item) {
      return;
    }

    const updatedItem: HomeOperation = {
      ...item,
      status: statusForAction(action),
      lastCompleted:
        action === "Marked Done" ? "Marked done today" : item.lastCompleted,
      nextDue: action === "Snoozed" ? "Snoozed" : item.nextDue,
    };

    setItems((current) =>
      current.map((operation) =>
        operation.id === itemId ? updatedItem : operation,
      ),
    );

    if (action === "Approval Prepared") {
      setPreparedApprovals((current) => ({ ...current, [itemId]: true }));
      addApproval(homeApprovalForItem(updatedItem));
    }

    addAuditEvent(createHomeAuditEvent(updatedItem, action));
  }

  return {
    items,
    preparedApprovals,
    updateItem,
  };
}
