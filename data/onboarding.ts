import type { LifeArea } from "./atlas-core";
import type { AutonomyMode, ModuleVisibility } from "./settings";

export const onboardingStorageKey = "atlas-pilot-onboarding-v1";

export const primaryGoalOptions = [
  "Stay organized",
  "Reduce mental load",
  "Keep up with household tasks",
  "Manage shopping/groceries",
  "Track bills and subscriptions",
  "Keep up with work/projects",
  "Organize documents",
  "Reduce missed follow-ups",
];

export const lifeAreaOptions: LifeArea[] = [
  "Household",
  "Family",
  "Money",
  "Work",
  "Projects",
  "Health",
  "Vehicles",
  "Documents",
  "Shopping",
  "Legal / Risk",
  "Goals",
];

export const householdNeedOptions = [
  "Air filters",
  "Pool",
  "Yard/plants",
  "Water softener",
  "Housekeeper",
  "HVAC service reminders",
  "Smoke detector / safety checks",
  "Appliance filters",
];

export const substitutionRules = [
  "Same brand only",
  "Same or cheaper",
  "Ask every time",
  "No substitutions",
];

export const lockedPilotApprovalRules = [
  "Approval required before sending messages",
  "Approval required before ordering anything",
  "Approval required before payments or cancellations",
  "Approval required before contacting vendors",
  "Sensitive/legal/financial/medical items are draft-only or review-only",
  "No external actions in pilot mode",
];

export type HousingStatus = "Own" | "Rent" | "Other / not sure" | "";
export type HouseholdMaintenance = "Yes" | "No" | "Not sure" | "";

export type OnboardingProfile = {
  displayName: string;
  householdName: string;
  timezone: string;
  preferredBriefTime: string;
  primaryGoals: string[];
};

export type OnboardingShopping = {
  groceryProvider: string;
  householdSupplier: string;
  bulkStore: string;
  hardwareProvider: string;
  weeklyBudgetTarget: string;
  substitutionRule: string;
  requireApprovalBeforeOrder: boolean;
  keepHouseholdExtrasSeparate: boolean;
};

export type OnboardingHousehold = {
  housingStatus: HousingStatus;
  hasRecurringMaintenance: HouseholdMaintenance;
  needs: string[];
  askLater: boolean;
};

export type OnboardingState = {
  completed: boolean;
  skippedToDemo: boolean;
  profile: OnboardingProfile;
  lifeAreas: Record<LifeArea, ModuleVisibility>;
  household: OnboardingHousehold;
  shopping: OnboardingShopping;
  autonomyMode: Exclude<AutonomyMode, "Off">;
  updatedAt: string | null;
};

export type StoredOnboardingState = Partial<
  Omit<OnboardingState, "profile" | "lifeAreas" | "household" | "shopping">
> & {
  profile?: Partial<OnboardingProfile>;
  lifeAreas?: Partial<Record<LifeArea, ModuleVisibility>>;
  household?: Partial<OnboardingHousehold>;
  shopping?: Partial<OnboardingShopping>;
};

export const defaultOnboardingState: OnboardingState = {
  completed: false,
  skippedToDemo: false,
  profile: {
    displayName: "",
    householdName: "",
    timezone: "",
    preferredBriefTime: "07:30",
    primaryGoals: ["Stay organized", "Reduce mental load"],
  },
  lifeAreas: lifeAreaOptions.reduce(
    (areas, area) => ({
      ...areas,
      [area]: ["Household", "Shopping", "Documents"].includes(area)
        ? "Enabled"
        : "Quiet",
    }),
    {} as Record<LifeArea, ModuleVisibility>,
  ),
  household: {
    housingStatus: "",
    hasRecurringMaintenance: "",
    needs: [],
    askLater: false,
  },
  shopping: {
    groceryProvider: "",
    householdSupplier: "",
    bulkStore: "",
    hardwareProvider: "",
    weeklyBudgetTarget: "$250/week",
    substitutionRule: "Same or cheaper",
    requireApprovalBeforeOrder: true,
    keepHouseholdExtrasSeparate: true,
  },
  autonomyMode: "Approval required",
  updatedAt: null,
};

function isLifeArea(value: string): value is LifeArea {
  return lifeAreaOptions.includes(value as LifeArea);
}

function normalizeLifeAreas(
  stored: Partial<Record<LifeArea, ModuleVisibility>> | undefined,
) {
  return lifeAreaOptions.reduce(
    (areas, area) => ({
      ...areas,
      [area]: stored?.[area] ?? defaultOnboardingState.lifeAreas[area],
    }),
    {} as Record<LifeArea, ModuleVisibility>,
  );
}

export function mergeOnboardingState(
  stored: StoredOnboardingState | null | undefined,
): OnboardingState {
  const substitutionRule = stored?.shopping?.substitutionRule;

  return {
    ...defaultOnboardingState,
    ...(stored ?? {}),
    profile: {
      ...defaultOnboardingState.profile,
      ...(stored?.profile ?? {}),
      primaryGoals: stored?.profile?.primaryGoals ?? defaultOnboardingState.profile.primaryGoals,
    },
    lifeAreas: normalizeLifeAreas(stored?.lifeAreas),
    household: {
      ...defaultOnboardingState.household,
      ...(stored?.household ?? {}),
      needs: stored?.household?.needs?.filter((need) =>
        householdNeedOptions.includes(need),
      ) ?? defaultOnboardingState.household.needs,
    },
    shopping: {
      ...defaultOnboardingState.shopping,
      ...(stored?.shopping ?? {}),
      substitutionRule:
        substitutionRule && substitutionRules.includes(substitutionRule)
          ? substitutionRule
          : defaultOnboardingState.shopping.substitutionRule,
      requireApprovalBeforeOrder:
        stored?.shopping?.requireApprovalBeforeOrder ?? true,
    },
    autonomyMode:
      stored?.autonomyMode === "Watch only" ||
      stored?.autonomyMode === "Prepare only" ||
      stored?.autonomyMode === "Approval required"
        ? stored.autonomyMode
        : "Approval required",
  };
}

export function safeParseOnboardingState(value: string | null): OnboardingState {
  if (!value) {
    return defaultOnboardingState;
  }

  try {
    return mergeOnboardingState(JSON.parse(value) as StoredOnboardingState);
  } catch {
    return defaultOnboardingState;
  }
}

export function completeOnboardingState(
  state: OnboardingState,
  skippedToDemo = false,
): OnboardingState {
  return {
    ...state,
    completed: true,
    skippedToDemo,
    updatedAt: new Date().toISOString(),
  };
}

export function getOnboardingDisplayName(state: OnboardingState) {
  return state.profile.displayName.trim();
}

export function getEnabledLifeAreas(state: OnboardingState) {
  return lifeAreaOptions.filter((area) => state.lifeAreas[area] === "Enabled");
}

export function buildOnboardingPreview(state: OnboardingState) {
  const enabled = getEnabledLifeAreas(state);
  const recommendations: string[] = [];

  if (enabled.includes("Household")) {
    const needs = state.household.needs.slice(0, 2);
    recommendations.push(
      needs.length > 0
        ? `Prepare gentle reminders for ${needs.join(" and ")}.`
        : "Prepare a light household maintenance check-in.",
    );
  }

  if (enabled.includes("Shopping")) {
    recommendations.push(
      `Keep shopping prep under ${state.shopping.weeklyBudgetTarget || "your budget target"}.`,
    );
  }

  if (enabled.includes("Money")) {
    recommendations.push("Watch bills, subscriptions, refunds, and unusual spending patterns.");
  }

  if (enabled.includes("Work") || enabled.includes("Projects")) {
    recommendations.push("Surface follow-ups and project reminders without sending anything.");
  }

  if (enabled.includes("Documents")) {
    recommendations.push("Help organize records, warranties, and important documents.");
  }

  if (recommendations.length === 0) {
    recommendations.push("Start with a quiet daily brief and learn what matters later.");
  }

  return {
    greeting: state.profile.displayName.trim()
      ? `Good morning, ${state.profile.displayName.trim()}.`
      : "Good morning.",
    enabledLifeAreas: enabled,
    recommendations: recommendations.slice(0, 4),
    safetyNote:
      "No real accounts are connected. Nothing external happens without approval.",
  };
}

export function setLifeAreaMode(
  state: OnboardingState,
  area: string,
  mode: ModuleVisibility,
): OnboardingState {
  if (!isLifeArea(area)) {
    return state;
  }

  return {
    ...state,
    lifeAreas: {
      ...state.lifeAreas,
      [area]: mode,
    },
  };
}
