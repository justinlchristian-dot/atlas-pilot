export type Confidence = "High" | "Medium" | "Low";
export type RiskLevel = "Low" | "Medium" | "High" | "Sensitive";
export type ApprovalStatus =
  | "Needs Review"
  | "Approved"
  | "Edited"
  | "Snoozed"
  | "Rejected"
  | "Hidden";
export type AuditDecision =
  | "Needs Review"
  | "Approved"
  | "Edited"
  | "Snoozed"
  | "Rejected"
  | "Hidden";
export type WorkflowOrigin =
  | "Today"
  | "Life Map"
  | "Household"
  | "Shopping"
  | "Work"
  | "Projects"
  | "Settings"
  | "Manual"
  | "Mock";

export type ApprovalItem = {
  id: string;
  title: string;
  category: string;
  summary: string;
  whyItMatters: string;
  source: string;
  confidence: Confidence;
  risk: RiskLevel;
  preview: string;
  status: ApprovalStatus;
  createdAt: string;
  updatedAt: string;
  origin: WorkflowOrigin;
  draftOnly: boolean;
  reviewRecommended: boolean;
};

export type ApprovalInput = Omit<
  ApprovalItem,
  "createdAt" | "updatedAt" | "status" | "id"
> & {
  id?: string;
  status?: ApprovalStatus;
};

export type AuditEvent = {
  id: string;
  dateTime: string;
  eventType: string;
  relatedItem: string;
  userDecision: AuditDecision;
  dataUsed: string;
  assumptions: string;
  riskLevel: RiskLevel;
  result: string;
  origin: WorkflowOrigin;
};

export {
  demoApprovalItems as mockApprovalItems,
  demoAuditEvents as initialAuditEvents,
} from "./demo-profile";

export function slugFromTitle(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function createAuditEvent(
  item: ApprovalItem,
  decision: AuditDecision,
  note?: string,
): AuditEvent {
  const resultByDecision: Record<AuditDecision, string> = {
    "Needs Review": "Queued for review. No external action occurred.",
    Approved:
      "Marked approved in the pilot. No external action occurred in mock mode.",
    Edited: `Edited in the pilot.${note ? ` Note: ${note}` : ""} No external action occurred.`,
    Snoozed: "Snoozed in the pilot. No external action occurred.",
    Rejected: "Rejected in the pilot. No external action occurred.",
    Hidden:
      "Hidden from future mock recommendations. No external action occurred.",
  };

  return {
    id: `${item.id}-${decision.toLowerCase().replaceAll(" ", "-")}-${Date.now()}`,
    dateTime: new Date().toISOString(),
    eventType: decision === "Edited" ? "Approval edited" : "User decision",
    relatedItem: item.title,
    userDecision: decision,
    dataUsed: item.source,
    assumptions: item.draftOnly
      ? "Draft-only. Review recommended before any legal or risk-related message is sent."
      : "Based on saved mock context in the Atlas pilot.",
    riskLevel: item.risk,
    result: resultByDecision[decision],
    origin: item.origin,
  };
}
