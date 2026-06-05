import type { LifeArea } from "./atlas-core";
import {
  completeOnboardingState,
  defaultOnboardingState,
  lifeAreaOptions,
  onboardingStorageKey,
  type OnboardingState,
} from "./onboarding";
import type { ModuleVisibility } from "./settings";

export const activePersonaStorageKey = "atlas-pilot-active-persona-v1";

export type SyntheticPersona = {
  id: string;
  name: string;
  shortDescription: string;
  displayName: string;
  householdName: string;
  enabledLifeAreas: LifeArea[];
  quietLifeAreas: LifeArea[];
  offLifeAreas: LifeArea[];
  householdNeeds: string[];
  householdAskLater?: boolean;
  shopping: {
    groceryProvider?: string;
    householdSupplier?: string;
    bulkStore?: string;
    hardwareProvider?: string;
    pharmacyProvider?: string;
    weeklyBudgetTarget?: string;
    substitutionRule?: string;
    keepHouseholdExtrasSeparate?: boolean;
  };
  autonomyMode: OnboardingState["autonomyMode"];
  emphasize: string[];
  avoid: string[];
  notes: string[];
};

function lifeAreaModesForPersona(persona: SyntheticPersona) {
  return lifeAreaOptions.reduce(
    (areas, area) => {
      let mode: ModuleVisibility = defaultOnboardingState.lifeAreas[area];

      if (persona.enabledLifeAreas.includes(area)) {
        mode = "Enabled";
      }

      if (persona.quietLifeAreas.includes(area)) {
        mode = "Quiet";
      }

      if (persona.offLifeAreas.includes(area)) {
        mode = "Off";
      }

      return {
        ...areas,
        [area]: mode,
      };
    },
    {} as Record<LifeArea, ModuleVisibility>,
  );
}

export function buildOnboardingStateForPersona(
  persona: SyntheticPersona,
): OnboardingState {
  return completeOnboardingState({
    ...defaultOnboardingState,
    profile: {
      ...defaultOnboardingState.profile,
      displayName: persona.displayName,
      householdName: persona.householdName,
      primaryGoals: persona.emphasize.slice(0, 3),
    },
    lifeAreas: lifeAreaModesForPersona(persona),
    household: {
      ...defaultOnboardingState.household,
      housingStatus: persona.householdName.toLowerCase().includes("apartment")
        ? "Rent"
        : "Other / not sure",
      hasRecurringMaintenance:
        persona.householdNeeds.length > 0 && !persona.householdAskLater
          ? "Yes"
          : "Not sure",
      needs: persona.householdNeeds,
      askLater: persona.householdAskLater ?? false,
    },
    shopping: {
      ...defaultOnboardingState.shopping,
      groceryProvider: persona.shopping.groceryProvider ?? "",
      householdSupplier: persona.shopping.householdSupplier ?? "",
      bulkStore: persona.shopping.bulkStore ?? "",
      hardwareProvider: persona.shopping.hardwareProvider ?? "",
      weeklyBudgetTarget:
        persona.shopping.weeklyBudgetTarget ??
        defaultOnboardingState.shopping.weeklyBudgetTarget,
      substitutionRule:
        persona.shopping.substitutionRule ??
        defaultOnboardingState.shopping.substitutionRule,
      keepHouseholdExtrasSeparate:
        persona.shopping.keepHouseholdExtrasSeparate ??
        defaultOnboardingState.shopping.keepHouseholdExtrasSeparate,
    },
    autonomyMode: persona.autonomyMode,
  });
}

export function loadPersonaToStorage(
  storage: Pick<Storage, "setItem">,
  persona: SyntheticPersona,
) {
  const onboarding = buildOnboardingStateForPersona(persona);
  storage.setItem(onboardingStorageKey, JSON.stringify(onboarding));
  storage.setItem(
    activePersonaStorageKey,
    JSON.stringify({
      id: persona.id,
      name: persona.name,
      loadedAt: onboarding.updatedAt,
    }),
  );

  return onboarding;
}

export const syntheticPersonas: SyntheticPersona[] = [
  {
    id: "busy-parent-homeowner",
    name: "Busy Parent Homeowner",
    shortDescription:
      "A family household balancing home routines, groceries, documents, money organization, and reminders.",
    displayName: "Morgan",
    householdName: "Family household",
    enabledLifeAreas: ["Household", "Family", "Shopping", "Money", "Documents", "Vehicles"],
    quietLifeAreas: ["Work", "Projects"],
    offLifeAreas: ["Legal / Risk"],
    householdNeeds: [
      "Air filters",
      "Yard/plants",
      "HVAC service reminders",
      "Smoke detector / safety checks",
      "Appliance filters",
    ],
    shopping: {
      groceryProvider: "Demo grocery provider",
      householdSupplier: "Demo household supplier",
      weeklyBudgetTarget: "$275/week",
    },
    autonomyMode: "Approval required",
    emphasize: ["Family reminders", "Household tasks", "Groceries", "Approvals"],
    avoid: ["Overemphasizing work", "Overemphasizing projects"],
    notes: ["Legal / Risk should stay off unless urgent."],
  },
  {
    id: "single-professional-renter",
    name: "Single Professional Renter",
    shortDescription:
      "An apartment renter who wants help with work, documents, subscriptions, and lightweight shopping.",
    displayName: "Taylor",
    householdName: "Apartment",
    enabledLifeAreas: ["Work", "Money", "Shopping", "Documents", "Health"],
    quietLifeAreas: ["Household", "Family"],
    offLifeAreas: ["Vehicles", "Legal / Risk"],
    householdNeeds: [],
    householdAskLater: true,
    shopping: {
      groceryProvider: "Optional grocery delivery provider",
      weeklyBudgetTarget: "$125/week",
    },
    autonomyMode: "Prepare only",
    emphasize: ["Work follow-ups", "Documents", "Bills and subscriptions", "Simple shopping"],
    avoid: ["Pool care", "Yard work", "Homeowner HVAC service as a primary task"],
    notes: ["Household should stay lightweight and apartment-oriented."],
  },
  {
    id: "retired-couple",
    name: "Retired Couple",
    shortDescription:
      "A quieter household focused on routines, appointments, family reminders, documents, and shopping.",
    displayName: "Pat",
    householdName: "Retired household",
    enabledLifeAreas: ["Household", "Health", "Documents", "Shopping", "Family"],
    quietLifeAreas: ["Money"],
    offLifeAreas: ["Work", "Projects"],
    householdNeeds: [
      "Air filters",
      "Appliance filters",
      "Yard/plants",
      "Smoke detector / safety checks",
    ],
    shopping: {
      groceryProvider: "Demo grocery provider",
      hardwareProvider: "Demo hardware provider",
      pharmacyProvider: "Demo pharmacy provider",
      weeklyBudgetTarget: "$200/week",
    },
    autonomyMode: "Approval required",
    emphasize: ["Household routines", "Appointments", "Documents", "Shopping", "Family reminders"],
    avoid: ["Technical language", "Work/project-heavy recommendations"],
    notes: ["Keep copy simple and clear."],
  },
  {
    id: "small-business-owner",
    name: "Small Business Owner",
    shortDescription:
      "An owner/operator balancing project work, admin follow-ups, documents, supplies, and approvals.",
    displayName: "Jordan",
    householdName: "Owner/operator",
    enabledLifeAreas: ["Work", "Projects", "Money", "Documents", "Shopping"],
    quietLifeAreas: ["Household", "Family"],
    offLifeAreas: ["Legal / Risk"],
    householdNeeds: ["Air filters"],
    shopping: {
      householdSupplier: "Demo business supplies provider",
      weeklyBudgetTarget: "Varies by week",
    },
    autonomyMode: "Approval required",
    emphasize: ["Project tasks", "Business/admin follow-ups", "Documents", "Supplies", "Approvals"],
    avoid: ["Too many personal household tasks"],
    notes: ["Legal / Risk should remain quiet/off unless urgent and review-only."],
  },
  {
    id: "caregiver-adult-child",
    name: "Caregiver / Adult Child",
    shortDescription:
      "A care-support profile coordinating family, appointments, documents, shopping, and sensitive review-only items.",
    displayName: "Casey",
    householdName: "Care support",
    enabledLifeAreas: ["Family", "Health", "Documents", "Shopping", "Household", "Legal / Risk"],
    quietLifeAreas: ["Work", "Projects"],
    offLifeAreas: [],
    householdNeeds: ["Air filters", "Appliance filters", "Smoke detector / safety checks"],
    shopping: {
      groceryProvider: "Demo grocery provider",
      householdSupplier: "Demo household supplier",
      pharmacyProvider: "Demo pharmacy provider",
      weeklyBudgetTarget: "$175/week",
    },
    autonomyMode: "Approval required",
    emphasize: ["Family", "Appointments", "Documents", "Shopping", "Sensitive review-only items"],
    avoid: ["Legal or health advice", "Acting without review"],
    notes: ["Legal/health wording must stay draft-only or review-only."],
  },
  {
    id: "budget-focused-household",
    name: "Budget-Focused Household",
    shortDescription:
      "A household that wants Atlas to emphasize spending control, substitutions, refunds, and basic home upkeep.",
    displayName: "Riley",
    householdName: "Budget-focused household",
    enabledLifeAreas: ["Money", "Shopping", "Household"],
    quietLifeAreas: ["Family", "Documents"],
    offLifeAreas: ["Projects"],
    householdNeeds: ["Air filters"],
    shopping: {
      groceryProvider: "Demo grocery provider",
      householdSupplier: "Demo household supplier",
      weeklyBudgetTarget: "$150/week",
      substitutionRule: "Same or cheaper",
      keepHouseholdExtrasSeparate: true,
    },
    autonomyMode: "Approval required",
    emphasize: ["Budget", "Shopping totals", "Subscriptions/refunds", "Basic household"],
    avoid: ["Unnecessary extras", "Unneeded recommendations"],
    notes: ["Recommendations should stay cost-conscious."],
  },
  {
    id: "non-technical-user",
    name: "Non-Technical User",
    shortDescription:
      "A simple setup for someone who wants a gentle daily brief without too much configuration.",
    displayName: "Sam",
    householdName: "Simple setup",
    enabledLifeAreas: ["Household", "Shopping", "Family"],
    quietLifeAreas: ["Money", "Documents"],
    offLifeAreas: ["Projects", "Legal / Risk"],
    householdNeeds: [],
    householdAskLater: true,
    shopping: {
      weeklyBudgetTarget: "",
      substitutionRule: "Ask every time",
    },
    autonomyMode: "Watch only",
    emphasize: ["Light setup", "Gentle setup-needed cards", "Simple language"],
    avoid: ["Technical language", "Too many modules", "Overwhelming detail"],
    notes: ["Provider and budget are intentionally unknown."],
  },
  {
    id: "power-user-life-admin-heavy",
    name: "Power User / Life Admin Heavy",
    shortDescription:
      "A high-responsibility household that wants more modules, more prepared actions, and strong approval/audit safety.",
    displayName: "Avery",
    householdName: "High-responsibility household",
    enabledLifeAreas: [
      "Household",
      "Family",
      "Money",
      "Work",
      "Projects",
      "Documents",
      "Vehicles",
      "Shopping",
      "Goals",
    ],
    quietLifeAreas: ["Legal / Risk"],
    offLifeAreas: [],
    householdNeeds: [
      "Air filters",
      "Pool",
      "Yard/plants",
      "Water softener",
      "Housekeeper",
      "HVAC service reminders",
      "Smoke detector / safety checks",
      "Appliance filters",
    ],
    shopping: {
      groceryProvider: "Demo grocery provider",
      householdSupplier: "Demo household supplier",
      bulkStore: "Demo bulk household provider",
      hardwareProvider: "Demo hardware provider",
      weeklyBudgetTarget: "$325/week",
      substitutionRule: "Ask every time",
    },
    autonomyMode: "Approval required",
    emphasize: ["More modules", "Prepared actions", "Audit safety", "Tuned recommendations"],
    avoid: ["Clutter", "Auto-action", "Weak approval boundaries"],
    notes: ["High coverage should still feel calm and scannable."],
  },
];
