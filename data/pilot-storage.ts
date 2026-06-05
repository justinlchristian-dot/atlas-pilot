export type PilotResetScope =
  | "onboarding"
  | "workflow"
  | "settings"
  | "shopping-household"
  | "all";

export const atlasPilotStorageKeys = {
  onboarding: ["atlas-pilot-onboarding-v1", "atlas-pilot-active-persona-v1"],
  workflow: ["atlas-pilot-approvals-v02", "atlas-pilot-audit-v02"],
  settings: ["atlas-pilot-settings-v08"],
  shoppingHousehold: [
    "atlas-pilot-home-operations-v03",
    "atlas-pilot-grocery-items-v04",
    "atlas-pilot-grocery-plan-v04",
    "atlas-pilot-reorders-v04",
    "atlas-pilot-refunds-v04",
  ],
} as const;

export const pilotResetOptions: Array<{
  id: PilotResetScope;
  title: string;
  description: string;
}> = [
  {
    id: "onboarding",
    title: "Reset onboarding profile",
    description:
      "Clears local setup answers, profile name, active persona, life areas, and pilot preferences.",
  },
  {
    id: "workflow",
    title: "Reset approvals and audit events",
    description:
      "Restores the mock approval queue and audit log on the next page load.",
  },
  {
    id: "settings",
    title: "Reset settings",
    description:
      "Clears Tune Atlas preferences, hidden recommendation settings, and local settings history.",
  },
  {
    id: "shopping-household",
    title: "Reset shopping and household state",
    description:
      "Clears local grocery, reorder, refund, and household routine edits.",
  },
  {
    id: "all",
    title: "Reset all Atlas pilot data",
    description:
      "Clears every Atlas localStorage key. A full reset cannot keep an audit event because the audit log is reset too.",
  },
];

export function getPilotStorageKeysForScope(scope: PilotResetScope) {
  if (scope === "all") {
    return getAllAtlasPilotStorageKeys();
  }

  if (scope === "shopping-household") {
    return [...atlasPilotStorageKeys.shoppingHousehold];
  }

  return [...atlasPilotStorageKeys[scope]];
}

export function getAllAtlasPilotStorageKeys() {
  return [
    ...atlasPilotStorageKeys.onboarding,
    ...atlasPilotStorageKeys.workflow,
    ...atlasPilotStorageKeys.settings,
    ...atlasPilotStorageKeys.shoppingHousehold,
  ];
}

export function resetAtlasPilotStorage(
  storage: Pick<Storage, "removeItem">,
  scope: PilotResetScope,
) {
  const keys = getPilotStorageKeysForScope(scope);
  keys.forEach((key) => storage.removeItem(key));
  return keys;
}
