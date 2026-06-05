import { describe, expect, it } from "vitest";
import {
  createFeedbackEntry,
  createPersonaFinding,
  getFeedbackSummary,
  getPersonaName,
  safeParseFeedbackEntries,
  safeParsePersonaFindings,
} from "../data/feedback";

describe("feedback and persona finding helpers", () => {
  it("creates local-only feedback entries", () => {
    const entry = createFeedbackEntry({
      route: "/today",
      personaId: "busy-parent-homeowner",
      sentiment: "Useful",
      summary: "Daily brief felt focused",
      detail: "The household and shopping cards were relevant.",
    });

    expect(entry.id).toContain("feedback");
    expect(entry.route).toBe("/today");
    expect(entry.status).toBe("Open");
    expect(entry.summary).toBe("Daily brief felt focused");
  });

  it("creates persona findings with default mode guidance", () => {
    const finding = createPersonaFinding({
      personaId: "single-professional-renter",
      featureArea: "Household",
      helps: "Somewhat",
      noise: "Medium",
      confusion: "Low",
      trustConcern: "Low",
      defaultMode: "Quiet",
      finding: "Apartment reminders should stay light.",
      recommendedFix: "Keep homeowner tasks quiet for renter personas.",
    });

    expect(finding.status).toBe("Open");
    expect(finding.defaultMode).toBe("Quiet");
    expect(finding.personaId).toBe("single-professional-renter");
  });

  it("safely parses malformed storage", () => {
    expect(safeParseFeedbackEntries("{bad-json")).toEqual([]);
    expect(safeParsePersonaFindings("{bad-json")).toEqual([]);
  });

  it("summarizes open items and high trust concerns", () => {
    const entry = createFeedbackEntry({
      route: "/shopping",
      personaId: "budget-focused-household",
      sentiment: "Noisy",
      summary: "Too many extras",
      detail: "Budget persona needs fewer extras.",
    });
    const finding = createPersonaFinding({
      personaId: "caregiver-adult-child",
      featureArea: "Health",
      helps: "Yes",
      noise: "Low",
      confusion: "Medium",
      trustConcern: "High",
      defaultMode: "Quiet",
      finding: "Health wording needs extra care.",
      recommendedFix: "Keep health items review-only.",
    });

    expect(getFeedbackSummary([entry], [finding])).toEqual({
      feedbackCount: 1,
      findingCount: 1,
      openCount: 2,
      highTrustConcerns: 1,
    });
  });

  it("uses generic persona names and avoids narrow provider assumptions", () => {
    expect(getPersonaName("busy-parent-homeowner")).toBe("Busy Parent Homeowner");
    expect(getPersonaName("unknown")).toBe("No persona selected");

    const serialized = JSON.stringify([
      createFeedbackEntry({
        route: "/personas",
        personaId: "power-user-life-admin-heavy",
        sentiment: "Useful",
        summary: "Useful",
        detail: "Useful",
      }),
    ]);

    expect(serialized).not.toMatch(/walmart|amazon|costco|home depot/i);
  });
});

