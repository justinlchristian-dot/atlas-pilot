import { describe, expect, it } from "vitest";
import { homeOperations, lifeMapCategories } from "../data/life-map";
import { defaultOnboardingState, mergeOnboardingState } from "../data/onboarding";
import {
  buildPersonalizedShoppingRules,
  filterPrimaryHouseholdOperations,
  getAutonomyModeWithOnboardingFallback,
  getLifeAreaMode,
  personalizeGroceryPlan,
  personalizeLifeMapCategories,
  personalizeStorePreferences,
  shouldShowHouseholdSetupNeeded,
} from "../data/personalization";
import { storePreferences, weeklyGroceryPlan } from "../data/shopping";

describe("personalization helpers", () => {
  it("labels life areas by enabled, quiet, and off onboarding modes", () => {
    const onboarding = mergeOnboardingState({
      lifeAreas: {
        Household: "Enabled",
        Shopping: "Off",
        Money: "Quiet",
      },
    });
    const categories = personalizeLifeMapCategories(lifeMapCategories, onboarding);

    expect(getLifeAreaMode(onboarding, "Household")).toBe("Enabled");
    expect(categories.find((category) => category.name === "Shopping")?.personalizationMode).toBe("Off");
    expect(categories.find((category) => category.name === "Money")?.personalizationMode).toBe("Quiet");
  });

  it("filters household operations to selected onboarding items", () => {
    const onboarding = mergeOnboardingState({
      household: {
        housingStatus: "Own",
        hasRecurringMaintenance: "Yes",
        needs: ["Air filters"],
        askLater: false,
      },
    });
    const filtered = filterPrimaryHouseholdOperations(homeOperations, onboarding);

    expect(filtered.map((item) => item.id)).toContain("air-filters");
    expect(filtered.map((item) => item.id)).not.toContain("pool-check");
    expect(filtered.map((item) => item.id)).not.toContain("watering-plants");
  });

  it("shows household setup needed when the user asks Atlas to ask later", () => {
    const onboarding = mergeOnboardingState({
      household: {
        askLater: true,
        needs: [],
      },
    });

    expect(shouldShowHouseholdSetupNeeded(onboarding)).toBe(true);
    expect(filterPrimaryHouseholdOperations(homeOperations, onboarding)).toHaveLength(0);
  });

  it("uses shopping preference fallbacks when provider fields are blank", () => {
    const personalized = personalizeStorePreferences(storePreferences, defaultOnboardingState);

    expect(personalized[0].store).toBe("Preferred grocery provider");
    expect(personalized[0].preference).toBeTruthy();
  });

  it("uses onboarding shopping budget and rules when present", () => {
    const onboarding = mergeOnboardingState({
      shopping: {
        weeklyBudgetTarget: "$175/week",
        substitutionRule: "Ask every time",
        groceryProvider: "Local Market",
      },
    });
    const plan = personalizeGroceryPlan(weeklyGroceryPlan, onboarding);
    const rules = buildPersonalizedShoppingRules([], onboarding);
    const preferences = personalizeStorePreferences(storePreferences, onboarding);

    expect(plan.goal).toContain("$175/week");
    expect(rules).toContain("Substitution rule: Ask every time");
    expect(preferences[0].preference).toBe("Local Market");
  });

  it("keeps stored autonomy mode over onboarding fallback", () => {
    const onboarding = mergeOnboardingState({ autonomyMode: "Watch only" });

    expect(getAutonomyModeWithOnboardingFallback(undefined, onboarding)).toBe("Watch only");
    expect(getAutonomyModeWithOnboardingFallback("Prepare only", onboarding)).toBe("Prepare only");
  });
});
