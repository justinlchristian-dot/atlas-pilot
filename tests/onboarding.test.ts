import { describe, expect, it } from "vitest";
import {
  buildOnboardingPreview,
  completeOnboardingState,
  defaultOnboardingState,
  getEnabledLifeAreas,
  mergeOnboardingState,
  safeParseOnboardingState,
  setLifeAreaMode,
} from "../data/onboarding";

describe("onboarding helpers", () => {
  it("defaults to approval required and local-only setup", () => {
    expect(defaultOnboardingState.autonomyMode).toBe("Approval required");
    expect(defaultOnboardingState.shopping.requireApprovalBeforeOrder).toBe(true);
    expect(defaultOnboardingState.completed).toBe(false);
  });

  it("merges partial stored setup with complete defaults", () => {
    const merged = mergeOnboardingState({
      profile: {
        displayName: "Taylor",
        householdName: "",
        timezone: "",
        preferredBriefTime: "08:00",
        primaryGoals: ["Organize documents"],
      },
      lifeAreas: {
        Money: "Enabled",
      },
    });

    expect(merged.profile.displayName).toBe("Taylor");
    expect(merged.profile.preferredBriefTime).toBe("08:00");
    expect(merged.lifeAreas.Money).toBe("Enabled");
    expect(merged.lifeAreas.Household).toBe(defaultOnboardingState.lifeAreas.Household);
  });

  it("does not crash on malformed localStorage-shaped JSON", () => {
    expect(safeParseOnboardingState("{bad-json").autonomyMode).toBe("Approval required");
  });

  it("updates life area modes safely", () => {
    const updated = setLifeAreaMode(defaultOnboardingState, "Health", "Enabled");
    const ignored = setLifeAreaMode(updated, "Unknown", "Off");

    expect(updated.lifeAreas.Health).toBe("Enabled");
    expect(ignored).toEqual(updated);
  });

  it("marks setup complete without external actions", () => {
    const completed = completeOnboardingState(defaultOnboardingState);

    expect(completed.completed).toBe(true);
    expect(completed.skippedToDemo).toBe(false);
    expect(completed.updatedAt).toBeTruthy();
  });

  it("builds a brief preview from selected setup", () => {
    const state = mergeOnboardingState({
      profile: {
        displayName: "Taylor",
        householdName: "",
        timezone: "",
        preferredBriefTime: "08:00",
        primaryGoals: [],
      },
      lifeAreas: {
        Household: "Enabled",
        Shopping: "Enabled",
      },
      household: {
        housingStatus: "Own",
        hasRecurringMaintenance: "Yes",
        needs: ["Air filters", "Pool"],
        askLater: false,
      },
    });
    const preview = buildOnboardingPreview(state);

    expect(preview.greeting).toBe("Good morning, Taylor.");
    expect(getEnabledLifeAreas(state)).toContain("Household");
    expect(preview.recommendations.some((item) => item.includes("Air filters"))).toBe(true);
    expect(preview.safetyNote).toContain("No real accounts");
  });
});
