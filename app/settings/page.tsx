"use client";

import { useState } from "react";
import {
  Bell,
  Brain,
  CheckCircle2,
  Database,
  EyeOff,
  LockKeyhole,
  RotateCcw,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Store,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PilotModeCard } from "@/components/pilot-mode-card";
import { SummaryCard } from "@/components/summary-card";
import {
  pilotResetOptions,
  resetAtlasPilotStorage,
  type PilotResetScope,
} from "@/data/pilot-storage";
import {
  type AutonomyMode,
  type ModuleVisibility,
  type RecommendationPreference,
} from "@/data/settings";
import { useAtlasSettings } from "@/hooks/use-atlas-settings";

const autonomyModes: AutonomyMode[] = [
  "Watch only",
  "Prepare only",
  "Approval required",
  "Off",
];
const moduleModes: ModuleVisibility[] = ["Enabled", "Quiet", "Off"];
const recommendationModes: RecommendationPreference[] = [
  "On",
  "Quiet",
  "Only if urgent",
  "Off",
];

function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
  disabled = false,
}: {
  value: T;
  options: T[];
  onChange: (value: T) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          disabled={disabled}
          onClick={() => onChange(option)}
          className={`min-h-9 rounded-full border px-3 text-xs font-medium transition ${
            value === option
              ? "border-ink-950 bg-ink-950 text-white"
              : "border-atlas-line bg-white/80 text-ink-600 hover:bg-white"
          } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
  disabled = false,
  note,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  note?: string;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-atlas-line bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-medium text-ink-800">{label}</p>
        {note ? <p className="mt-1 text-xs leading-5 text-ink-500">{note}</p> : null}
      </div>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`min-h-9 rounded-full border px-3 text-xs font-semibold ${
          checked
            ? "border-emerald-200 bg-emerald-50 text-emerald-800"
            : "border-slate-200 bg-slate-50 text-slate-600"
        } ${disabled ? "cursor-not-allowed opacity-70" : ""}`}
      >
        {checked ? "On" : "Off"}
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const {
    settings,
    restoreHiddenRecommendation,
    updateApprovalRule,
    updateAutonomyMode,
    updateModuleVisibility,
    updateRecommendation,
    updateShoppingPreference,
    updateShoppingRule,
    updateShoppingToggle,
    updateSourceToggle,
  } = useAtlasSettings();
  const [pendingReset, setPendingReset] = useState<PilotResetScope | null>(null);
  const [resetMessage, setResetMessage] = useState("");

  const hiddenActive = settings.hiddenRecommendations.filter(
    (item) => !item.restored,
  ).length;

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl">
        <section className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase text-atlas-sage">
              Tune Atlas
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-normal text-ink-950 sm:text-5xl">
              You control what Atlas surfaces.
            </h1>
            <p className="mt-3 max-w-3xl text-lg leading-8 text-ink-600">
              Atlas learns from what you approve, snooze, reject, and hide. Use
              these settings to reduce bloat and personalize what Atlas prepares.
            </p>
          </div>
          <div className="rounded-lg border border-atlas-line bg-white/76 p-4 shadow-card">
            <p className="text-xs font-semibold uppercase text-ink-500">
              Pilot guardrail
            </p>
            <p className="mt-2 text-sm leading-6 text-ink-600">
              You stay in control. Nothing external happens without approval.
            </p>
          </div>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            title="Autonomy mode"
            value={settings.autonomyMode}
            detail="Pilot mode does not perform real actions."
            icon={LockKeyhole}
          />
          <SummaryCard
            title="Active modules"
            value={settings.modules.filter((module) => module.visibility === "Enabled").length}
            detail="Quiet and off modules reduce surface area."
            icon={Settings}
          />
          <SummaryCard
            title="Hidden items"
            value={hiddenActive}
            detail="Restore anything that should reappear."
            icon={EyeOff}
          />
          <SummaryCard
            title="Locked rules"
            value={settings.approvalRules.filter((rule) => rule.locked).length}
            detail="Dangerous actions stay approval-locked."
            icon={ShieldCheck}
            tone="serious"
          />
        </section>

        <section className="mt-6">
          <PilotModeCard />
        </section>

        <section className="mt-6 rounded-lg border border-atlas-line/80 bg-white/86 p-5 shadow-card backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-atlas-line bg-atlas-cloud text-atlas-tide">
              <Brain aria-hidden="true" size={19} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-ink-950">
                Autonomy Mode
              </h2>
              <p className="mt-2 text-sm leading-6 text-ink-600">
                Watch only summarizes, Prepare only stages drafts and lists,
                Approval required asks before anything happens, and Off stops
                monitoring in that area. Pilot mode does not perform real actions.
              </p>
              <div className="mt-4">
                <SegmentedControl
                  value={settings.autonomyMode}
                  options={autonomyModes}
                  onChange={updateAutonomyMode}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 xl:grid-cols-2">
          <article className="rounded-lg border border-atlas-line/80 bg-white/86 p-5 shadow-card">
            <div className="flex items-center gap-3">
              <SlidersHorizontal aria-hidden="true" className="text-atlas-tide" size={20} />
              <h2 className="text-xl font-semibold text-ink-950">
                Module Visibility
              </h2>
            </div>
            <div className="mt-5 space-y-3">
              {settings.modules.map((module) => (
                <div
                  key={module.id}
                  className="rounded-lg border border-atlas-line bg-atlas-cloud/70 p-4"
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-ink-950">
                        {module.name}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-ink-600">
                        {module.explanation}
                      </p>
                    </div>
                    <SegmentedControl
                      value={module.visibility}
                      options={moduleModes}
                      onChange={(value) => updateModuleVisibility(module.id, value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-lg border border-atlas-line/80 bg-white/86 p-5 shadow-card">
            <div className="flex items-center gap-3">
              <Bell aria-hidden="true" className="text-atlas-tide" size={20} />
              <h2 className="text-xl font-semibold text-ink-950">
                Recommendation Preferences
              </h2>
            </div>
            <div className="mt-5 space-y-3">
              {settings.recommendations.map((recommendation) => (
                <div
                  key={recommendation.id}
                  className="rounded-lg border border-atlas-line bg-atlas-cloud/70 p-4"
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <p className="text-sm font-semibold text-ink-950">
                      {recommendation.name}
                    </p>
                    <SegmentedControl
                      value={recommendation.preference}
                      options={recommendationModes}
                      onChange={(value) => updateRecommendation(recommendation.id, value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="mt-6 grid gap-4 xl:grid-cols-2">
          <article className="rounded-lg border border-atlas-line/80 bg-white/86 p-5 shadow-card">
            <div className="flex items-center gap-3">
              <ShieldCheck aria-hidden="true" className="text-atlas-rose" size={20} />
              <h2 className="text-xl font-semibold text-ink-950">
                Approval Rules
              </h2>
            </div>
            <p className="mt-2 text-sm leading-6 text-ink-600">
              Dangerous actions remain locked on in pilot mode.
            </p>
            <div className="mt-5 space-y-3">
              {settings.approvalRules.map((rule) => (
                <ToggleRow
                  key={rule.id}
                  label={rule.label}
                  checked={rule.enabled}
                  disabled={rule.locked}
                  note={rule.locked ? "Locked on for safety." : undefined}
                  onChange={(value) => updateApprovalRule(rule.id, value)}
                />
              ))}
            </div>
          </article>

          <article className="rounded-lg border border-atlas-line/80 bg-white/86 p-5 shadow-card">
            <div className="flex items-center gap-3">
              <Store aria-hidden="true" className="text-atlas-tide" size={20} />
              <h2 className="text-xl font-semibold text-ink-950">
                Shopping Preferences
              </h2>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {settings.shoppingPreferences.map((preference) => (
                <label key={preference.id} className="block">
                  <span className="text-sm font-medium text-ink-700">
                    {preference.label}
                  </span>
                  <input
                    value={preference.value}
                    onChange={(event) =>
                      updateShoppingPreference(preference.id, event.target.value)
                    }
                    className="mt-2 min-h-11 w-full rounded-lg border border-atlas-line bg-atlas-cloud/70 px-3 text-sm text-ink-800 outline-none focus:border-atlas-tide focus:ring-2 focus:ring-atlas-tide/20"
                  />
                </label>
              ))}
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-ink-700">
                  Grocery budget target
                </span>
                <input
                  value={settings.groceryBudgetTarget}
                  onChange={(event) =>
                    updateShoppingRule("groceryBudgetTarget", event.target.value)
                  }
                  className="mt-2 min-h-11 w-full rounded-lg border border-atlas-line bg-atlas-cloud/70 px-3 text-sm text-ink-800 outline-none focus:border-atlas-tide focus:ring-2 focus:ring-atlas-tide/20"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-ink-700">
                  Substitution rule
                </span>
                <input
                  value={settings.substitutionRule}
                  onChange={(event) =>
                    updateShoppingRule("substitutionRule", event.target.value)
                  }
                  className="mt-2 min-h-11 w-full rounded-lg border border-atlas-line bg-atlas-cloud/70 px-3 text-sm text-ink-800 outline-none focus:border-atlas-tide focus:ring-2 focus:ring-atlas-tide/20"
                />
              </label>
            </div>
            <div className="mt-4 space-y-3">
              <ToggleRow
                label="Require approval for substitutions over $5"
                checked={settings.approveSubstitutionsOverFive}
                onChange={(value) =>
                  updateShoppingToggle("approveSubstitutionsOverFive", value)
                }
              />
              <ToggleRow
                label="Do not add household extras unless shown separately"
                checked={settings.separateHouseholdExtras}
                onChange={(value) =>
                  updateShoppingToggle("separateHouseholdExtras", value)
                }
              />
            </div>
          </article>
        </section>

        <section className="mt-6 rounded-lg border border-atlas-line/80 bg-white/86 p-5 shadow-card">
          <div className="flex items-center gap-3">
            <Database aria-hidden="true" className="text-atlas-tide" size={20} />
            <div>
              <h2 className="text-xl font-semibold text-ink-950">
                Data / Source Controls
              </h2>
              <p className="mt-1 text-sm leading-6 text-ink-600">
                These are pilot controls only. No real accounts are connected.
              </p>
            </div>
          </div>
          <div className="mt-5 grid gap-3 lg:grid-cols-3">
            {settings.sources.map((source) => (
              <div
                key={source.id}
                className="rounded-lg border border-atlas-line bg-atlas-cloud/70 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-ink-950">
                      {source.name}
                    </p>
                    <p className="mt-1 text-xs font-medium text-ink-500">
                      {source.status}
                    </p>
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  <ToggleRow
                    label="Used for recommendations"
                    checked={source.recommendations}
                    onChange={(value) =>
                      updateSourceToggle(source.id, "recommendations", value)
                    }
                  />
                  <ToggleRow
                    label="Used for Daily Brief"
                    checked={source.dailyBrief}
                    onChange={(value) =>
                      updateSourceToggle(source.id, "dailyBrief", value)
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 grid gap-4 xl:grid-cols-2">
          <article className="rounded-lg border border-atlas-line/80 bg-white/86 p-5 shadow-card">
            <div className="flex items-center gap-3">
              <EyeOff aria-hidden="true" className="text-atlas-tide" size={20} />
              <h2 className="text-xl font-semibold text-ink-950">
                Hidden Recommendations
              </h2>
            </div>
            <div className="mt-5 space-y-3">
              {settings.hiddenRecommendations.some((item) => !item.restored) ? (
                settings.hiddenRecommendations.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg border border-atlas-line bg-atlas-cloud/70 p-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-ink-950">
                          {item.title}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-ink-600">
                          {item.reason}
                        </p>
                        <p className="mt-1 text-xs font-medium text-ink-500">
                          Scope: {item.scope}
                        </p>
                      </div>
                      <button
                        type="button"
                        disabled={item.restored}
                        onClick={() => restoreHiddenRecommendation(item.id)}
                        className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-atlas-line bg-white px-3 text-sm font-medium text-ink-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <RotateCcw aria-hidden="true" size={16} />
                        {item.restored ? "Restored" : "Restore"}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-lg border border-atlas-line bg-atlas-cloud/70 p-4">
                  <p className="text-sm font-semibold text-ink-950">
                    No hidden recommendations
                  </p>
                  <p className="mt-2 text-sm leading-6 text-ink-600">
                    Hidden or muted items will appear here so testers can restore
                    them later.
                  </p>
                </div>
              )}
            </div>
          </article>

          <article className="rounded-lg border border-atlas-line/80 bg-ink-950 p-5 text-white shadow-soft">
            <div className="flex items-center gap-3">
              <CheckCircle2 aria-hidden="true" className="text-white/80" size={20} />
              <h2 className="text-xl font-semibold">What Atlas is learning</h2>
            </div>
            <div className="mt-5 space-y-3">
              {[
                "You approve household tasks more often when they have a due date.",
                "You prefer prepared lists over automatic actions.",
                "Shopping suggestions should stay under the weekly budget.",
                "Sensitive items should remain draft-only.",
                "Repeatedly hidden items should stop appearing.",
              ].map((signal) => (
                <div
                  key={signal}
                  className="rounded-lg border border-white/10 bg-white/8 p-3 text-sm leading-6 text-white/84"
                >
                  {signal}
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-lg border border-white/10 bg-white/8 p-4">
              <p className="text-sm font-semibold text-white">
                Recent settings changes
              </p>
              <div className="mt-3 space-y-2">
                {settings.settingsHistory.length > 0 ? (
                  settings.settingsHistory.slice(0, 5).map((item) => (
                    <p key={item.id} className="text-sm leading-6 text-white/74">
                      {item.setting}: {item.previousValue} to {item.newValue}
                    </p>
                  ))
                ) : (
                  <p className="text-sm leading-6 text-white/64">
                    No settings changes yet.
                  </p>
                )}
              </div>
            </div>
          </article>
        </section>

        <section className="mt-6 rounded-lg border border-atlas-line/80 bg-white/86 p-5 shadow-card">
          <div className="flex items-center gap-3">
            <RotateCcw aria-hidden="true" className="text-atlas-tide" size={20} />
            <div>
              <h2 className="text-xl font-semibold text-ink-950">
                Reset Pilot Data
              </h2>
              <p className="mt-1 text-sm leading-6 text-ink-600">
                These controls only clear Atlas localStorage keys in this
                browser. They do not touch unrelated browser storage.
              </p>
            </div>
          </div>
          {resetMessage ? (
            <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium text-emerald-900">
              {resetMessage}
            </div>
          ) : null}
          <div className="mt-5 grid gap-3 lg:grid-cols-2">
            {pilotResetOptions.map((option) => {
              const confirming = pendingReset === option.id;

              return (
                <div
                  key={option.id}
                  className="rounded-lg border border-atlas-line bg-atlas-cloud/70 p-4"
                >
                  <p className="text-sm font-semibold text-ink-950">
                    {option.title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-ink-600">
                    {option.description}
                  </p>
                  {confirming ? (
                    <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-3">
                      <p className="text-sm font-semibold text-rose-900">
                        Confirm reset?
                      </p>
                      <p className="mt-1 text-xs leading-5 text-rose-800">
                        This clears local pilot data for this browser only. A
                        full reset cannot keep an audit event because the audit
                        log is reset too.
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const cleared = resetAtlasPilotStorage(
                              window.localStorage,
                              option.id,
                            );
                            window.dispatchEvent(
                              new Event("atlas-workflow-store-updated"),
                            );
                            setResetMessage(
                              `Reset complete. Cleared ${cleared.length} Atlas pilot key${cleared.length === 1 ? "" : "s"}. Refresh or revisit pages to reload mock defaults.`,
                            );
                            setPendingReset(null);
                          }}
                          className="inline-flex min-h-9 items-center rounded-lg border border-rose-700 bg-rose-700 px-3 text-sm font-semibold text-white"
                        >
                          Confirm reset
                        </button>
                        <button
                          type="button"
                          onClick={() => setPendingReset(null)}
                          className="inline-flex min-h-9 items-center rounded-lg border border-atlas-line bg-white px-3 text-sm font-semibold text-ink-700"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setResetMessage("");
                        setPendingReset(option.id);
                      }}
                      className="mt-4 inline-flex min-h-10 items-center rounded-lg border border-atlas-line bg-white px-3 text-sm font-semibold text-ink-700"
                    >
                      Reset
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
