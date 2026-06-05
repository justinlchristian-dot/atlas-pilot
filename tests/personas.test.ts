import { describe, expect, it } from "vitest";
import { onboardingStorageKey } from "../data/onboarding";
import {
  activePersonaStorageKey,
  buildOnboardingStateForPersona,
  loadPersonaToStorage,
  syntheticPersonas,
} from "../data/personas";

function createStorageMock(initial: Record<string, string> = {}) {
  const values = { ...initial };

  return {
    values,
    setItem(key: string, value: string) {
      values[key] = value;
    },
  };
}

describe("synthetic personas", () => {
  it("defines the required pilot persona set", () => {
    expect(syntheticPersonas).toHaveLength(8);

    syntheticPersonas.forEach((persona) => {
      expect(persona.id).toBeTruthy();
      expect(persona.name).toBeTruthy();
      expect(persona.displayName).toBeTruthy();
      expect(persona.householdName).toBeTruthy();
      expect(persona.enabledLifeAreas.length).toBeGreaterThan(0);
      expect(persona.emphasize.length).toBeGreaterThan(0);
      expect(persona.avoid.length).toBeGreaterThan(0);
    });
  });

  it("maps persona data to onboarding storage shape", () => {
    const persona = syntheticPersonas.find(
      (item) => item.id === "budget-focused-household",
    );
    expect(persona).toBeTruthy();

    const onboarding = buildOnboardingStateForPersona(persona!);

    expect(onboarding.completed).toBe(true);
    expect(onboarding.profile.displayName).toBe("Riley");
    expect(onboarding.lifeAreas.Money).toBe("Enabled");
    expect(onboarding.lifeAreas.Projects).toBe("Off");
    expect(onboarding.shopping.weeklyBudgetTarget).toBe("$150/week");
    expect(onboarding.shopping.substitutionRule).toBe("Same or cheaper");
  });

  it("loads a persona without clearing unrelated localStorage keys", () => {
    const storage = createStorageMock({
      "atlas-pilot-audit-v02": "keep-audit",
      "unrelated-app-key": "keep-unrelated",
    });

    const onboarding = loadPersonaToStorage(storage, syntheticPersonas[0]);

    expect(storage.values[onboardingStorageKey]).toContain(onboarding.profile.displayName);
    expect(storage.values[activePersonaStorageKey]).toContain(syntheticPersonas[0].id);
    expect(storage.values["atlas-pilot-audit-v02"]).toBe("keep-audit");
    expect(storage.values["unrelated-app-key"]).toBe("keep-unrelated");
  });

  it("keeps provider fields generic and provider-agnostic", () => {
    const serialized = JSON.stringify(syntheticPersonas);

    expect(serialized).not.toMatch(/walmart|amazon|costco|home depot/i);
    const founderSpecificTerms = [
      "zillow",
      "mort" + "gage",
      "real" + "tor",
      "culture " + "motor" + "sports",
    ];

    founderSpecificTerms.forEach((term) => {
      expect(serialized.toLowerCase()).not.toContain(term);
    });
  });
});
