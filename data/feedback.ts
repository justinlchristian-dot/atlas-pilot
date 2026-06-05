import type { LifeArea } from "./atlas-core";
import { syntheticPersonas } from "./personas";
import type { ModuleVisibility } from "./settings";

export const feedbackEntriesStorageKey = "atlas-pilot-feedback-entries-v01";
export const personaFindingsStorageKey = "atlas-pilot-persona-findings-v01";

export type FeedbackSentiment = "Useful" | "Noisy" | "Missing" | "Risky" | "Confusing";
export type FeedbackStatus = "Open" | "Reviewed" | "Planned" | "Closed";
export type PersonaFindingStatus = "Open" | "Reviewing" | "Resolved";

export type FeedbackEntry = {
  id: string;
  createdAt: string;
  route: string;
  personaId: string;
  sentiment: FeedbackSentiment;
  summary: string;
  detail: string;
  status: FeedbackStatus;
};

export type PersonaFinding = {
  id: string;
  createdAt: string;
  personaId: string;
  featureArea: LifeArea | "Today" | "Approvals" | "Audit" | "Settings" | "Feedback";
  helps: "Yes" | "Somewhat" | "No";
  noise: "Low" | "Medium" | "High";
  confusion: "Low" | "Medium" | "High";
  trustConcern: "Low" | "Medium" | "High";
  defaultMode: ModuleVisibility;
  finding: string;
  recommendedFix: string;
  status: PersonaFindingStatus;
};

export const feedbackRoutes = [
  "/today",
  "/onboarding",
  "/personas",
  "/pilot-guide",
  "/command",
  "/shopping",
  "/approvals",
  "/audit",
  "/settings",
  "/calendar",
  "/vault",
  "/feedback",
];

export function createFeedbackEntry(input: {
  route: string;
  personaId: string;
  sentiment: FeedbackSentiment;
  summary: string;
  detail: string;
}): FeedbackEntry {
  const now = new Date().toISOString();

  return {
    id: `feedback-${now}-${input.route}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    createdAt: now,
    route: input.route,
    personaId: input.personaId,
    sentiment: input.sentiment,
    summary: input.summary.trim(),
    detail: input.detail.trim(),
    status: "Open",
  };
}

export function createPersonaFinding(input: {
  personaId: string;
  featureArea: PersonaFinding["featureArea"];
  helps: PersonaFinding["helps"];
  noise: PersonaFinding["noise"];
  confusion: PersonaFinding["confusion"];
  trustConcern: PersonaFinding["trustConcern"];
  defaultMode: ModuleVisibility;
  finding: string;
  recommendedFix: string;
}): PersonaFinding {
  const now = new Date().toISOString();

  return {
    id: `persona-finding-${now}-${input.personaId}-${input.featureArea}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-"),
    createdAt: now,
    personaId: input.personaId,
    featureArea: input.featureArea,
    helps: input.helps,
    noise: input.noise,
    confusion: input.confusion,
    trustConcern: input.trustConcern,
    defaultMode: input.defaultMode,
    finding: input.finding.trim(),
    recommendedFix: input.recommendedFix.trim(),
    status: "Open",
  };
}

export function safeParseFeedbackEntries(value: string | null): FeedbackEntry[] {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as FeedbackEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function safeParsePersonaFindings(value: string | null): PersonaFinding[] {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as PersonaFinding[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getPersonaName(personaId: string) {
  return (
    syntheticPersonas.find((persona) => persona.id === personaId)?.name ??
    "No persona selected"
  );
}

export function getFeedbackSummary(
  entries: FeedbackEntry[],
  findings: PersonaFinding[],
) {
  return {
    feedbackCount: entries.length,
    findingCount: findings.length,
    openCount:
      entries.filter((entry) => entry.status === "Open").length +
      findings.filter((finding) => finding.status === "Open").length,
    highTrustConcerns: findings.filter(
      (finding) => finding.trustConcern === "High",
    ).length,
  };
}

