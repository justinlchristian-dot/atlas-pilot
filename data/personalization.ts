import type { LifeArea } from "./atlas-core";
import type { HomeOperation, LifeMapCategory } from "./life-map";
import type { OnboardingState, OnboardingShopping } from "./onboarding";
import type { AutonomyMode, ModuleVisibility, ShoppingPreference } from "./settings";
import type { GroceryPlan, ReorderItem, StorePreference } from "./shopping";

const categoryAreaById: Record<string, LifeArea> = {
  household: "Household",
  family: "Family",
  money: "Money",
  work: "Work",
  projects: "Projects",
  health: "Health",
  vehicles: "Vehicles",
  documents: "Documents",
  shopping: "Shopping",
  "legal-risk": "Legal / Risk",
  goals: "Goals",
};

const operationNeedById: Record<string, string> = {
  "pool-check": "Pool",
  "air-filters": "Air filters",
  "watering-plants": "Yard/plants",
  "water-softener": "Water softener",
  "housekeeper-prep": "Housekeeper",
  "hvac-seasonal-prep": "HVAC service reminders",
  "dryer-smoke-safety": "Smoke detector / safety checks",
  "supplies-inventory": "Appliance filters",
};

const shoppingPreferenceLabels: Record<keyof Pick<
  OnboardingShopping,
  "groceryProvider" | "householdSupplier" | "bulkStore" | "hardwareProvider"
>, string> = {
  groceryProvider: "Preferred grocery provider",
  householdSupplier: "Preferred household supplier",
  bulkStore: "Preferred bulk store",
  hardwareProvider: "Preferred hardware provider",
};

export type PersonalizedLifeMapCategory = LifeMapCategory & {
  personalizationMode: ModuleVisibility;
};

export function getLifeAreaMode(
  onboarding: OnboardingState,
  area: LifeArea,
): ModuleVisibility {
  return onboarding.lifeAreas[area] ?? "Quiet";
}

export function isLifeAreaEnabled(onboarding: OnboardingState, area: LifeArea) {
  return getLifeAreaMode(onboarding, area) === "Enabled";
}

export function getEnabledLifeAreaNames(onboarding: OnboardingState) {
  return Object.entries(onboarding.lifeAreas)
    .filter(([, mode]) => mode === "Enabled")
    .map(([area]) => area as LifeArea);
}

export function personalizeLifeMapCategories(
  categories: LifeMapCategory[],
  onboarding: OnboardingState,
): PersonalizedLifeMapCategory[] {
  return categories.map((category) => {
    const area = categoryAreaById[category.id] ?? category.name;
    return {
      ...category,
      personalizationMode: getLifeAreaMode(onboarding, area),
    };
  });
}

export function filterPrimaryHouseholdOperations(
  operations: HomeOperation[],
  onboarding: OnboardingState,
) {
  const householdMode = getLifeAreaMode(onboarding, "Household");

  if (householdMode === "Off") {
    return [];
  }

  if (onboarding.household.needs.length === 0) {
    return [];
  }

  const selected = new Set(onboarding.household.needs);
  return operations.filter((operation) => {
    const need = operationNeedById[operation.id];
    return need ? selected.has(need) : false;
  });
}

export function shouldShowHouseholdSetupNeeded(onboarding: OnboardingState) {
  return (
    getLifeAreaMode(onboarding, "Household") !== "Off" &&
    (onboarding.household.askLater || onboarding.household.needs.length === 0)
  );
}

export function personalizeStorePreferences(
  defaults: StorePreference[],
  onboarding: OnboardingState,
): StorePreference[] {
  const overrides = [
    ["groceryProvider", onboarding.shopping.groceryProvider],
    ["householdSupplier", onboarding.shopping.householdSupplier],
    ["bulkStore", onboarding.shopping.bulkStore],
    ["hardwareProvider", onboarding.shopping.hardwareProvider],
  ] as const;
  const usedDefaultStores = new Set<string>();

  const personalized = overrides.map(([key, value]) => {
    const label = shoppingPreferenceLabels[key];
    const existing = defaults.find((preference) =>
      preference.store.toLowerCase().includes(label.toLowerCase().replace("preferred ", "")),
    );
    if (existing) {
      usedDefaultStores.add(existing.store);
    }

    return {
      store: label,
      preference: value.trim()
        ? value.trim()
        : existing?.preference ?? "Not set yet. Atlas can ask later.",
    };
  });

  return [
    ...personalized,
    ...defaults.filter((preference) => !usedDefaultStores.has(preference.store)),
  ];
}

export function personalizeGroceryPlan(
  plan: GroceryPlan,
  onboarding: OnboardingState,
): GroceryPlan {
  const budget = onboarding.shopping.weeklyBudgetTarget.trim();

  if (!budget) {
    return plan;
  }

  return {
    ...plan,
    goal: `Dinner plan around ${budget}`,
  };
}

export function personalizeReorders(
  reorders: ReorderItem[],
  onboarding: OnboardingState,
): ReorderItem[] {
  const supplier = onboarding.shopping.householdSupplier.trim();
  const hardware = onboarding.shopping.hardwareProvider.trim();

  return reorders.map((item) => ({
    ...item,
    store:
      item.id === "water-softener-salt" || item.id === "pool-test-strips"
        ? hardware || item.store
        : supplier || item.store,
  }));
}

export function buildPersonalizedShoppingRules(
  defaults: string[],
  onboarding: OnboardingState,
) {
  return [
    `Grocery target: ${onboarding.shopping.weeklyBudgetTarget || "not set yet"}`,
    `Substitution rule: ${onboarding.shopping.substitutionRule}`,
    onboarding.shopping.requireApprovalBeforeOrder
      ? "Require approval before any order"
      : "Pilot still prevents real orders even if this preference is off",
    onboarding.shopping.keepHouseholdExtrasSeparate
      ? "Keep household extras separate from groceries"
      : "Household extras may appear with groceries for review only",
    ...defaults.filter(
      (rule) =>
        !rule.startsWith("Grocery target:") &&
        !rule.includes("Require approval before any order"),
    ),
  ];
}

export function getAutonomyModeWithOnboardingFallback(
  storedMode: AutonomyMode | undefined,
  onboarding: OnboardingState,
): AutonomyMode {
  if (storedMode) {
    return storedMode;
  }

  return onboarding.autonomyMode ?? "Approval required";
}

export function buildOnboardingShoppingPreferenceSettings(
  preferences: ShoppingPreference[],
  onboarding: OnboardingState,
) {
  const valueById: Record<string, string> = {
    grocery: onboarding.shopping.groceryProvider,
    household: onboarding.shopping.householdSupplier,
    bulk: onboarding.shopping.bulkStore,
    hardware: onboarding.shopping.hardwareProvider,
  };

  return preferences.map((preference) => {
    const value = valueById[preference.id]?.trim();
    return value ? { ...preference, value } : preference;
  });
}
