export type LifeArea =
  | "Household"
  | "Family"
  | "Money"
  | "Work"
  | "Projects"
  | "Health"
  | "Vehicles"
  | "Documents"
  | "Shopping"
  | "Legal / Risk"
  | "Goals";

export type EntityKnowledgeState =
  | "Known"
  | "Detected"
  | "Estimated"
  | "Unknown"
  | "Needs Review"
  | "Sensitive";

export type ApprovalMode = "approval-first" | "review-only";

export type UserProfile = {
  id: string;
  displayName?: string;
  householdName: string;
  locale: string;
  timezone: string;
  primaryGoals: string[];
  approvalMode: ApprovalMode;
  preferredBriefTime: string;
};
