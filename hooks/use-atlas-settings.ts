"use client";

import { useEffect, useState } from "react";
import {
  applyApprovalRuleToggle,
  defaultAtlasSettings,
  mergeAtlasSettings,
  restoreHiddenRecommendationById,
  type AtlasSettings,
  type AutonomyMode,
  type ModuleVisibility,
  type RecommendationPreference,
} from "@/data/settings";
import {
  onboardingStorageKey,
  safeParseOnboardingState,
} from "@/data/onboarding";
import {
  buildOnboardingShoppingPreferenceSettings,
  getAutonomyModeWithOnboardingFallback,
} from "@/data/personalization";
import { useWorkflowStore } from "@/hooks/use-workflow-store";

const settingsStorageKey = "atlas-pilot-settings-v08";

function readStoredSettings() {
  if (typeof window === "undefined") {
    return defaultAtlasSettings;
  }

  try {
    const stored = window.localStorage.getItem(settingsStorageKey);
    if (stored) {
      return mergeAtlasSettings(JSON.parse(stored) as Partial<AtlasSettings>);
    }

    const onboarding = safeParseOnboardingState(
      window.localStorage.getItem(onboardingStorageKey),
    );
    return {
      ...defaultAtlasSettings,
      autonomyMode: getAutonomyModeWithOnboardingFallback(undefined, onboarding),
      shoppingPreferences: buildOnboardingShoppingPreferenceSettings(
        defaultAtlasSettings.shoppingPreferences,
        onboarding,
      ),
      groceryBudgetTarget:
        onboarding.shopping.weeklyBudgetTarget ||
        defaultAtlasSettings.groceryBudgetTarget,
      substitutionRule:
        onboarding.shopping.substitutionRule ||
        defaultAtlasSettings.substitutionRule,
      separateHouseholdExtras:
        onboarding.shopping.keepHouseholdExtrasSeparate,
    };
  } catch {
    return defaultAtlasSettings;
  }
}

function settingAuditEvent(setting: string, previousValue: string, newValue: string) {
  const now = new Date().toISOString();

  return {
    id: `settings-${setting.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`,
    dateTime: now,
    eventType: "Settings changed",
    relatedItem: setting,
    userDecision: "Edited" as const,
    dataUsed: "Tune Atlas local settings",
    assumptions:
      "Pilot settings are local mock controls only. No real account permissions or external automations changed.",
    riskLevel: "Low" as const,
    result: `Changed from ${previousValue} to ${newValue}.`,
    origin: "Settings" as const,
  };
}

export function useAtlasSettings() {
  const { addAuditEvent } = useWorkflowStore();
  const [settings, setSettings] = useState<AtlasSettings>(defaultAtlasSettings);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSettings(readStoredSettings());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(settingsStorageKey, JSON.stringify(settings));
  }, [hydrated, settings]);

  function recordChange(setting: string, previousValue: string, newValue: string) {
    const entry = {
      id: `history-${Date.now()}`,
      setting,
      previousValue,
      newValue,
      dateTime: new Date().toISOString(),
    };

    setSettings((current) => ({
      ...current,
      settingsHistory: [entry, ...current.settingsHistory].slice(0, 8),
    }));
    addAuditEvent(settingAuditEvent(setting, previousValue, newValue));
  }

  function updateAutonomyMode(value: AutonomyMode) {
    const previous = settings.autonomyMode;
    setSettings((current) => ({ ...current, autonomyMode: value }));
    recordChange("Autonomy mode", previous, value);
  }

  function updateModuleVisibility(id: string, value: ModuleVisibility) {
    const item = settings.modules.find((module) => module.id === id);
    if (!item) return;

    setSettings((current) => ({
      ...current,
      modules: current.modules.map((module) =>
        module.id === id ? { ...module, visibility: value } : module,
      ),
    }));
    recordChange(`${item.name} visibility`, item.visibility, value);
  }

  function updateRecommendation(id: string, value: RecommendationPreference) {
    const item = settings.recommendations.find((recommendation) => recommendation.id === id);
    if (!item) return;

    setSettings((current) => ({
      ...current,
      recommendations: current.recommendations.map((recommendation) =>
        recommendation.id === id ? { ...recommendation, preference: value } : recommendation,
      ),
    }));
    recordChange(`${item.name} recommendations`, item.preference, value);
  }

  function updateApprovalRule(id: string, enabled: boolean) {
    const item = settings.approvalRules.find((rule) => rule.id === id);
    if (!item || item.locked) return;

    setSettings((current) => applyApprovalRuleToggle(current, id, enabled));
    recordChange(item.label, item.enabled ? "On" : "Off", enabled ? "On" : "Off");
  }

  function updateShoppingPreference(id: string, value: string) {
    const item = settings.shoppingPreferences.find((preference) => preference.id === id);
    if (!item) return;

    setSettings((current) => ({
      ...current,
      shoppingPreferences: current.shoppingPreferences.map((preference) =>
        preference.id === id ? { ...preference, value } : preference,
      ),
    }));
    recordChange(item.label, item.value, value);
  }

  function updateShoppingRule(setting: "groceryBudgetTarget" | "substitutionRule", value: string) {
    const previous = settings[setting];
    setSettings((current) => ({ ...current, [setting]: value }));
    recordChange(setting === "groceryBudgetTarget" ? "Grocery budget target" : "Substitution rule", previous, value);
  }

  function updateShoppingToggle(setting: "approveSubstitutionsOverFive" | "separateHouseholdExtras", value: boolean) {
    const previous = settings[setting];
    setSettings((current) => ({ ...current, [setting]: value }));
    recordChange(setting, previous ? "On" : "Off", value ? "On" : "Off");
  }

  function updateSourceToggle(id: string, field: "recommendations" | "dailyBrief", value: boolean) {
    const item = settings.sources.find((source) => source.id === id);
    if (!item) return;

    setSettings((current) => ({
      ...current,
      sources: current.sources.map((source) =>
        source.id === id ? { ...source, [field]: value } : source,
      ),
    }));
    recordChange(`${item.name} ${field}`, item[field] ? "On" : "Off", value ? "On" : "Off");
  }

  function restoreHiddenRecommendation(id: string) {
    const item = settings.hiddenRecommendations.find((hidden) => hidden.id === id);
    if (!item) return;

    setSettings((current) => restoreHiddenRecommendationById(current, id));
    recordChange(`Restore ${item.title}`, "Hidden", "Restored");
  }

  return {
    settings,
    updateApprovalRule,
    updateAutonomyMode,
    updateModuleVisibility,
    updateRecommendation,
    updateShoppingPreference,
    updateShoppingRule,
    updateShoppingToggle,
    updateSourceToggle,
    restoreHiddenRecommendation,
  };
}
