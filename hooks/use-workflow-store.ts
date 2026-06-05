"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createAuditEvent,
  initialAuditEvents,
  mockApprovalItems,
  slugFromTitle,
  type ApprovalInput,
  type ApprovalItem,
  type ApprovalStatus,
  type AuditEvent,
  type WorkflowOrigin,
} from "../data/approvals";

export const approvalsStorageKey = "atlas-pilot-approvals-v02";
export const auditStorageKey = "atlas-pilot-audit-v02";

type LegacyApproval = Partial<ApprovalItem> & {
  draftOnly?: boolean;
  reviewRecommended?: boolean;
};

type LegacyAudit = Partial<AuditEvent> & {
  timestamp?: string;
  risk?: AuditEvent["riskLevel"];
  approvalId?: string;
};

export function normalizeOrigin(origin: unknown): ApprovalItem["origin"] {
  if (origin === "Home Operations") {
    return "Household";
  }

  if (
    origin === "Today" ||
    origin === "Life Map" ||
    origin === "Household" ||
    origin === "Shopping" ||
    origin === "Work" ||
    origin === "Projects" ||
    origin === "Settings" ||
    origin === "Manual" ||
    origin === "Mock"
  ) {
    return origin;
  }

  return "Mock";
}

function readStored<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  return safeJsonParse(window.localStorage.getItem(key), fallback);
}

export function safeJsonParse<T>(value: string | null, fallback: T): T {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function writeStored<T>(key: string, value: T) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event("atlas-workflow-store-updated"));
}

export function normalizeApproval(item: LegacyApproval, index: number): ApprovalItem {
  const now = new Date().toISOString();
  const title = item.title ?? `Approval item ${index + 1}`;

  return {
    id: item.id ?? `${slugFromTitle(title)}-${index}`,
    title,
    category: item.category ?? "Mock",
    summary: item.summary ?? "Mock approval prepared for review.",
    whyItMatters:
      item.whyItMatters ?? "Atlas prepared this item for review only.",
    source: item.source ?? "Mock workflow store",
    confidence: item.confidence ?? "Medium",
    risk: item.risk ?? "Low",
    preview: item.preview ?? "Prepared for approval. No external action taken.",
    status: item.status ?? "Needs Review",
    createdAt: item.createdAt ?? now,
    updatedAt: item.updatedAt ?? item.createdAt ?? now,
    origin: normalizeOrigin(item.origin),
    draftOnly: item.draftOnly ?? false,
    reviewRecommended:
      item.reviewRecommended ?? item.draftOnly ?? item.risk === "High",
  };
}

export function normalizeAudit(event: LegacyAudit, index: number): AuditEvent {
  return {
    id: event.id ?? `audit-event-${index}`,
    dateTime: event.dateTime ?? event.timestamp ?? new Date().toISOString(),
    eventType: event.eventType ?? "Workflow event",
    relatedItem: event.relatedItem ?? "Mock item",
    userDecision: event.userDecision ?? "Needs Review",
    dataUsed: event.dataUsed ?? "Mock workflow store",
    assumptions:
      event.assumptions ??
      "Mock local workflow data only. No external action occurred.",
    riskLevel: event.riskLevel ?? event.risk ?? "Low",
    result:
      event.result ??
      "Stored locally in the Atlas pilot workflow. No external action occurred.",
    origin: normalizeOrigin(event.origin),
  };
}

function readApprovals() {
  return readStored<LegacyApproval[]>(
    approvalsStorageKey,
    mockApprovalItems,
  ).map(normalizeApproval);
}

function readAuditEvents() {
  return readStored<LegacyAudit[]>(
    auditStorageKey,
    initialAuditEvents,
  ).map(normalizeAudit);
}

export function useWorkflowStore() {
  const [approvalItems, setApprovalItems] =
    useState<ApprovalItem[]>(mockApprovalItems);
  const [auditEvents, setAuditEvents] =
    useState<AuditEvent[]>(initialAuditEvents);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const storedApprovals = readApprovals();
    const storedAuditEvents = readAuditEvents();
    setApprovalItems(storedApprovals);
    setAuditEvents(storedAuditEvents);
    writeStored(approvalsStorageKey, storedApprovals);
    writeStored(auditStorageKey, storedAuditEvents);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    writeStored(approvalsStorageKey, approvalItems);
  }, [approvalItems, hydrated]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    writeStored(auditStorageKey, auditEvents);
  }, [auditEvents, hydrated]);

  function addAuditEvent(event: AuditEvent) {
    setAuditEvents((current) => [event, ...current]);
  }

  function addApproval(input: ApprovalInput) {
    const now = new Date().toISOString();
    const id = input.id ?? `${slugFromTitle(input.title)}-${Date.now()}`;
    const approval: ApprovalItem = {
      ...input,
      id,
      status: input.status ?? "Needs Review",
      createdAt: now,
      updatedAt: now,
      draftOnly: input.draftOnly ?? false,
      reviewRecommended:
        input.reviewRecommended ?? input.draftOnly ?? input.risk === "High",
    };

    setApprovalItems((current) => {
      const existingIndex = current.findIndex((item) => item.id === id);
      if (existingIndex === -1) {
        return [approval, ...current];
      }

      return current.map((item) =>
        item.id === id
          ? { ...item, ...approval, createdAt: item.createdAt, updatedAt: now }
          : item,
      );
    });

    setAuditEvents((current) => [
      {
        id: `${id}-prepared-${Date.now()}`,
        dateTime: now,
        eventType: "Approval prepared",
        relatedItem: approval.title,
        userDecision: "Needs Review",
        dataUsed: approval.source,
        assumptions:
          "Mock workflow store only. Atlas prepared an approval item but did not trigger external action.",
        riskLevel: approval.risk,
        result: "Added to the shared approval queue for review.",
        origin: approval.origin,
      },
      ...current,
    ]);
  }

  function updateApprovalStatus(
    itemId: string,
    status: Exclude<ApprovalStatus, "Needs Review">,
    note?: string,
  ) {
    const item = approvalItems.find((approval) => approval.id === itemId);

    if (!item) {
      return;
    }

    const updatedItem = {
      ...item,
      status,
      updatedAt: new Date().toISOString(),
    };

    setApprovalItems((current) =>
      current.map((approval) =>
        approval.id === itemId ? updatedItem : approval,
      ),
    );
    setAuditEvents((current) => [
      createAuditEvent(updatedItem, status, note),
      ...current,
    ]);
  }

  function clearHiddenRejected() {
    setApprovalItems((current) => cleanupHiddenRejected(current));
  }

  const summary = useMemo(() => {
    return {
      total: auditEvents.length,
      approved: auditEvents.filter((event) => event.userDecision === "Approved")
        .length,
      snoozed: auditEvents.filter((event) => event.userDecision === "Snoozed")
        .length,
      rejectedHidden: auditEvents.filter((event) =>
        ["Rejected", "Hidden"].includes(event.userDecision),
      ).length,
      highRisk: auditEvents.filter((event) =>
        ["High", "Sensitive"].includes(event.riskLevel),
      ).length,
      needsReview: approvalItems.filter(
        (approval) => approval.status === "Needs Review",
      ).length,
    };
  }, [approvalItems, auditEvents]);

  return {
    addApproval,
    addAuditEvent,
    approvalItems,
    auditEvents,
    clearHiddenRejected,
    hydrated,
    summary,
    updateApprovalStatus,
  };
}

export function cleanupHiddenRejected(items: ApprovalItem[]) {
  return items.filter(
    (approval) => approval.status !== "Hidden" && approval.status !== "Rejected",
  );
}

export function buildMockApproval(input: {
  title: string;
  category: string;
  summary: string;
  whyItMatters: string;
  source: string;
  confidence?: ApprovalItem["confidence"];
  risk?: ApprovalItem["risk"];
  preview: string;
  origin: WorkflowOrigin;
  draftOnly?: boolean;
  reviewRecommended?: boolean;
  id?: string;
}): ApprovalInput {
  return {
    id: input.id,
    title: input.title,
    category: input.category,
    summary: input.summary,
    whyItMatters: input.whyItMatters,
    source: input.source,
    confidence: input.confidence ?? "Medium",
    risk: input.risk ?? "Low",
    preview: input.preview,
    origin: input.origin,
    draftOnly: input.draftOnly ?? false,
    reviewRecommended:
      input.reviewRecommended ?? input.draftOnly ?? input.risk === "High",
  };
}
