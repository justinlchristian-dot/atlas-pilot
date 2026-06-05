export type AutonomyMode =
  | "Watch only"
  | "Prepare only"
  | "Approval required"
  | "Off";

export type ModuleVisibility = "Enabled" | "Quiet" | "Off";
export type RecommendationPreference = "On" | "Quiet" | "Only if urgent" | "Off";
export type SourceStatus = "Connected" | "Not connected" | "Demo only";

export type ModuleSetting = {
  id: string;
  name: string;
  explanation: string;
  visibility: ModuleVisibility;
};

export type RecommendationSetting = {
  id: string;
  name: string;
  preference: RecommendationPreference;
};

export type ApprovalRule = {
  id: string;
  label: string;
  enabled: boolean;
  locked: boolean;
};

export type ShoppingPreference = {
  id: string;
  label: string;
  value: string;
};

export type SourceControl = {
  id: string;
  name: string;
  status: SourceStatus;
  recommendations: boolean;
  dailyBrief: boolean;
};

export type HiddenRecommendation = {
  id: string;
  title: string;
  reason: string;
  scope: string;
  restored: boolean;
};

export type SettingsHistoryItem = {
  id: string;
  setting: string;
  previousValue: string;
  newValue: string;
  dateTime: string;
};

export type AtlasSettings = {
  autonomyMode: AutonomyMode;
  modules: ModuleSetting[];
  recommendations: RecommendationSetting[];
  approvalRules: ApprovalRule[];
  shoppingPreferences: ShoppingPreference[];
  groceryBudgetTarget: string;
  substitutionRule: string;
  approveSubstitutionsOverFive: boolean;
  separateHouseholdExtras: boolean;
  sources: SourceControl[];
  hiddenRecommendations: HiddenRecommendation[];
  settingsHistory: SettingsHistoryItem[];
};

export const defaultAtlasSettings: AtlasSettings = {
  autonomyMode: "Approval required",
  modules: [
    { id: "today", name: "Today", explanation: "Daily command center and brief.", visibility: "Enabled" },
    { id: "life-map", name: "Life Map", explanation: "What Atlas knows and still needs to learn.", visibility: "Enabled" },
    { id: "approvals", name: "Approvals", explanation: "Prepared actions waiting for review.", visibility: "Enabled" },
    { id: "household", name: "Household", explanation: "Home routines and maintenance.", visibility: "Enabled" },
    { id: "shopping", name: "Shopping", explanation: "Lists, reorders, returns, and provider preferences.", visibility: "Enabled" },
    { id: "money", name: "Money", explanation: "Bills, subscriptions, refunds, and money organization.", visibility: "Quiet" },
    { id: "family", name: "Family", explanation: "Birthdays, appointments, and family reminders.", visibility: "Quiet" },
    { id: "work", name: "Work", explanation: "Follow-ups, deadlines, and work admin.", visibility: "Quiet" },
    { id: "projects", name: "Projects", explanation: "Personal projects, goals, and recurring project tasks.", visibility: "Quiet" },
    { id: "documents", name: "Documents", explanation: "Records, warranties, policies, and important files.", visibility: "Quiet" },
    { id: "legal-risk", name: "Legal / Risk", explanation: "Sensitive review-only items and risk tracking.", visibility: "Quiet" },
    { id: "audit", name: "Audit", explanation: "Record of what Atlas prepared and what you decided.", visibility: "Enabled" },
  ],
  recommendations: [
    { id: "weather-household", name: "Weather-aware household suggestions", preference: "On" },
    { id: "household-maintenance", name: "Household maintenance", preference: "On" },
    { id: "shopping-reorders", name: "Shopping and reorders", preference: "On" },
    { id: "grocery-planning", name: "Grocery planning", preference: "On" },
    { id: "returns-refunds", name: "Returns and refunds", preference: "Quiet" },
    { id: "priority-messages", name: "Priority emails/messages", preference: "Only if urgent" },
    { id: "family-reminders", name: "Birthdays and family reminders", preference: "Quiet" },
    { id: "work-follow-ups", name: "Work follow-ups", preference: "Quiet" },
    { id: "project-reminders", name: "Project reminders", preference: "Quiet" },
    { id: "money-watch", name: "Money watch", preference: "Only if urgent" },
    { id: "sensitive-review", name: "Sensitive/legal review items", preference: "Only if urgent" },
  ],
  approvalRules: [
    { id: "messages", label: "Require approval before sending messages", enabled: true, locked: true },
    { id: "orders", label: "Require approval before ordering anything", enabled: true, locked: true },
    { id: "payments", label: "Require approval before payments or cancellations", enabled: true, locked: true },
    { id: "vendors", label: "Require approval before contacting vendors", enabled: true, locked: true },
    { id: "sensitive", label: "Require approval for high-risk or sensitive items", enabled: true, locked: true },
    { id: "draft-only", label: "Draft-only for legal/financial/medical-sensitive content", enabled: true, locked: true },
    { id: "pilot-no-auto", label: "Never auto-act in pilot mode", enabled: true, locked: true },
  ],
  shoppingPreferences: [
    { id: "grocery", label: "Preferred grocery provider", value: "Demo grocery provider" },
    { id: "household", label: "Preferred household supplier", value: "Demo household supplier" },
    { id: "bulk", label: "Preferred bulk store", value: "Demo bulk store" },
    { id: "hardware", label: "Preferred hardware provider", value: "Demo hardware provider" },
    { id: "pharmacy", label: "Preferred pharmacy", value: "Not set" },
    { id: "auto-parts", label: "Preferred auto parts provider", value: "Not set" },
    { id: "other", label: "Other provider", value: "Not set" },
  ],
  groceryBudgetTarget: "$250/week",
  substitutionRule: "Prefer same brand or cheaper substitutions",
  approveSubstitutionsOverFive: true,
  separateHouseholdExtras: true,
  sources: [
    { id: "calendar", name: "Calendar", status: "Demo only", recommendations: true, dailyBrief: true },
    { id: "email", name: "Email", status: "Not connected", recommendations: false, dailyBrief: false },
    { id: "messages", name: "Messages", status: "Not connected", recommendations: false, dailyBrief: false },
    { id: "receipts", name: "Receipts", status: "Demo only", recommendations: true, dailyBrief: false },
    { id: "shopping-history", name: "Shopping history", status: "Demo only", recommendations: true, dailyBrief: false },
    { id: "documents", name: "Documents", status: "Demo only", recommendations: true, dailyBrief: true },
    { id: "weather", name: "Weather", status: "Demo only", recommendations: true, dailyBrief: true },
    { id: "property-profile", name: "Property/home profile", status: "Demo only", recommendations: true, dailyBrief: true },
    { id: "manual", name: "Manual entries", status: "Demo only", recommendations: true, dailyBrief: true },
  ],
  hiddenRecommendations: [
    { id: "watering", title: "Watering suggestions unless extreme heat", reason: "Too frequent in normal weeks.", scope: "Condition", restored: false },
    { id: "birthdays-low-priority", title: "Birthday reminders for low-priority contacts", reason: "Creates reminder clutter.", scope: "Category", restored: false },
    { id: "store-brand", title: "Store-brand substitutions", reason: "User prefers review first.", scope: "Category", restored: false },
    { id: "vehicle-incomplete", title: "Vehicle suggestions until profile is complete", reason: "Needs more vehicle details.", scope: "Condition", restored: false },
  ],
  settingsHistory: [],
};

export function mergeAtlasSettings(stored: Partial<AtlasSettings> | null | undefined): AtlasSettings {
  return {
    ...defaultAtlasSettings,
    ...(stored ?? {}),
  };
}

export function applyApprovalRuleToggle(
  settings: AtlasSettings,
  ruleId: string,
  enabled: boolean,
): AtlasSettings {
  return {
    ...settings,
    approvalRules: settings.approvalRules.map((rule) =>
      rule.id === ruleId && !rule.locked ? { ...rule, enabled } : rule,
    ),
  };
}

export function restoreHiddenRecommendationById(
  settings: AtlasSettings,
  hiddenId: string,
): AtlasSettings {
  return {
    ...settings,
    hiddenRecommendations: settings.hiddenRecommendations.map((hidden) =>
      hidden.id === hiddenId ? { ...hidden, restored: true } : hidden,
    ),
  };
}
