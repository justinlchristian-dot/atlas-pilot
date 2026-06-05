"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ClipboardList,
  Home,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import {
  buildOnboardingPreview,
  completeOnboardingState,
  defaultOnboardingState,
  householdNeedOptions,
  lifeAreaOptions,
  lockedPilotApprovalRules,
  onboardingStorageKey,
  primaryGoalOptions,
  safeParseOnboardingState,
  setLifeAreaMode,
  substitutionRules,
  type HouseholdMaintenance,
  type HousingStatus,
  type OnboardingState,
} from "@/data/onboarding";
import type { AutonomyMode, ModuleVisibility } from "@/data/settings";

const steps = [
  "Welcome",
  "Profile",
  "Life Areas",
  "Household",
  "Shopping",
  "Approvals",
  "Preview",
  "Finish",
];

const lifeAreaModes: ModuleVisibility[] = ["Enabled", "Quiet", "Off"];
const autonomyModes: Exclude<AutonomyMode, "Off">[] = [
  "Watch only",
  "Prepare only",
  "Approval required",
];

function ToggleChip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-10 rounded-full border px-3 text-sm font-medium transition ${
        selected
          ? "border-ink-950 bg-ink-950 text-white"
          : "border-atlas-line bg-white/82 text-ink-600 hover:bg-white"
      }`}
    >
      {label}
    </button>
  );
}

function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: T[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`min-h-9 rounded-full border px-3 text-xs font-semibold transition ${
            value === option
              ? "border-ink-950 bg-ink-950 text-white"
              : "border-atlas-line bg-white/80 text-ink-600 hover:bg-white"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function TextInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-ink-700">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 min-h-11 w-full rounded-lg border border-atlas-line bg-white/82 px-3 text-sm text-ink-800 outline-none transition placeholder:text-ink-400 focus:border-atlas-tide focus:ring-2 focus:ring-atlas-tide/20"
      />
    </label>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-atlas-line bg-white/82 p-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-medium text-ink-800">{label}</p>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`min-h-9 rounded-full border px-3 text-xs font-semibold ${
          checked
            ? "border-emerald-200 bg-emerald-50 text-emerald-800"
            : "border-slate-200 bg-slate-50 text-slate-600"
        }`}
      >
        {checked ? "On" : "Off"}
      </button>
    </div>
  );
}

function StepShell({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-atlas-line/80 bg-white/88 p-5 shadow-soft backdrop-blur-sm sm:p-7">
      <p className="text-sm font-semibold uppercase text-atlas-sage">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-semibold tracking-normal text-ink-950">
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [setup, setSetup] = useState<OnboardingState>(defaultOnboardingState);
  const [hydrated, setHydrated] = useState(false);
  const preview = useMemo(() => buildOnboardingPreview(setup), [setup]);

  useEffect(() => {
    setSetup(safeParseOnboardingState(window.localStorage.getItem(onboardingStorageKey)));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(onboardingStorageKey, JSON.stringify(setup));
  }, [hydrated, setup]);

  function updateSetup(updater: (current: OnboardingState) => OnboardingState) {
    setSetup((current) => updater(current));
  }

  function toggleArrayValue(key: "primaryGoals" | "needs", value: string) {
    updateSetup((current) => {
      if (key === "primaryGoals") {
        const exists = current.profile.primaryGoals.includes(value);
        return {
          ...current,
          profile: {
            ...current.profile,
            primaryGoals: exists
              ? current.profile.primaryGoals.filter((goal) => goal !== value)
              : [...current.profile.primaryGoals, value],
          },
        };
      }

      const exists = current.household.needs.includes(value);
      return {
        ...current,
        household: {
          ...current.household,
          needs: exists
            ? current.household.needs.filter((need) => need !== value)
            : [...current.household.needs, value],
        },
      };
    });
  }

  function finish(skippedToDemo = false) {
    setSetup((current) => completeOnboardingState(current, skippedToDemo));
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl">
        <section className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase text-atlas-sage">
              Atlas setup
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-normal text-ink-950 sm:text-5xl">
              Make Atlas useful without a giant form.
            </h1>
            <p className="mt-3 max-w-3xl text-lg leading-8 text-ink-600">
              Confirm what applies, skip anything, and let Atlas learn later.
              This pilot stores setup locally and connects no real accounts.
            </p>
          </div>
          <div className="rounded-lg border border-atlas-line bg-white/76 p-4 shadow-card">
            <p className="text-xs font-semibold uppercase text-ink-500">
              Pilot guardrail
            </p>
            <p className="mt-2 text-sm leading-6 text-ink-600">
              Nothing external happens without approval.
            </p>
          </div>
        </section>

        <section className="mt-7 rounded-lg border border-atlas-line bg-white/74 p-3 shadow-card">
          <div className="flex flex-wrap gap-2">
            {steps.map((label, index) => (
              <button
                key={label}
                type="button"
                onClick={() => setStep(index)}
                className={`min-h-9 rounded-full border px-3 text-xs font-semibold ${
                  step === index
                    ? "border-ink-950 bg-ink-950 text-white"
                    : index < step
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                      : "border-atlas-line bg-white/70 text-ink-500"
                }`}
              >
                {index + 1}. {label}
              </button>
            ))}
          </div>
        </section>

        <div className="mt-5">
          {step === 0 ? (
            <StepShell title="Welcome to your Atlas pilot." eyebrow="Step 1">
              <p className="max-w-3xl text-lg leading-8 text-ink-600">
                Atlas gives you a daily brief, prepares helpful actions, and asks before doing anything.
              </p>
              <div className="mt-6 grid gap-3 md:grid-cols-3">
                {[
                  "See what needs your attention",
                  "Prepare lists, drafts, and reminders",
                  "Approve everything before action",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-lg border border-atlas-line bg-atlas-cloud/70 p-4"
                  >
                    <CheckCircle2 aria-hidden="true" className="text-atlas-sage" size={20} />
                    <p className="mt-3 text-sm font-medium leading-6 text-ink-700">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-ink-950 bg-ink-950 px-4 text-sm font-semibold text-white"
                >
                  Start setup
                  <ArrowRight aria-hidden="true" size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    finish(true);
                    setStep(7);
                  }}
                  className="inline-flex min-h-11 items-center rounded-lg border border-atlas-line bg-white px-4 text-sm font-semibold text-ink-700"
                >
                  Skip and use demo profile
                </button>
              </div>
            </StepShell>
          ) : null}

          {step === 1 ? (
            <StepShell title="Basic profile." eyebrow="Step 2">
              <div className="grid gap-4 md:grid-cols-2">
                <TextInput
                  label="First name / display name"
                  value={setup.profile.displayName}
                  placeholder="Alex"
                  onChange={(displayName) =>
                    updateSetup((current) => ({
                      ...current,
                      profile: { ...current.profile, displayName },
                    }))
                  }
                />
                <TextInput
                  label="Household name optional"
                  value={setup.profile.householdName}
                  placeholder="My household"
                  onChange={(householdName) =>
                    updateSetup((current) => ({
                      ...current,
                      profile: { ...current.profile, householdName },
                    }))
                  }
                />
                <TextInput
                  label="Time zone optional"
                  value={setup.profile.timezone}
                  placeholder="America/Phoenix"
                  onChange={(timezone) =>
                    updateSetup((current) => ({
                      ...current,
                      profile: { ...current.profile, timezone },
                    }))
                  }
                />
                <TextInput
                  label="Preferred daily brief time"
                  type="time"
                  value={setup.profile.preferredBriefTime}
                  onChange={(preferredBriefTime) =>
                    updateSetup((current) => ({
                      ...current,
                      profile: { ...current.profile, preferredBriefTime },
                    }))
                  }
                />
              </div>
              <div className="mt-6">
                <p className="text-sm font-semibold text-ink-800">
                  Primary goals
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {primaryGoalOptions.map((goal) => (
                    <ToggleChip
                      key={goal}
                      label={goal}
                      selected={setup.profile.primaryGoals.includes(goal)}
                      onClick={() => toggleArrayValue("primaryGoals", goal)}
                    />
                  ))}
                </div>
              </div>
            </StepShell>
          ) : null}

          {step === 2 ? (
            <StepShell title="Choose what Atlas should pay attention to." eyebrow="Step 3">
              <div className="grid gap-3 md:grid-cols-2">
                {lifeAreaOptions.map((area) => (
                  <div
                    key={area}
                    className="rounded-lg border border-atlas-line bg-atlas-cloud/70 p-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm font-semibold text-ink-950">
                        {area}
                      </p>
                      <SegmentedControl
                        value={setup.lifeAreas[area]}
                        options={lifeAreaModes}
                        onChange={(mode) =>
                          updateSetup((current) =>
                            setLifeAreaMode(current, area, mode),
                          )
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </StepShell>
          ) : null}

          {step === 3 ? (
            <StepShell title="Household setup." eyebrow="Step 4">
              <div className="grid gap-5 lg:grid-cols-2">
                <div className="rounded-lg border border-atlas-line bg-atlas-cloud/70 p-4">
                  <p className="text-sm font-semibold text-ink-800">
                    Do you own or rent?
                  </p>
                  <div className="mt-3">
                    <SegmentedControl<HousingStatus>
                      value={setup.household.housingStatus}
                      options={["Own", "Rent", "Other / not sure"]}
                      onChange={(housingStatus) =>
                        updateSetup((current) => ({
                          ...current,
                          household: { ...current.household, housingStatus },
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="rounded-lg border border-atlas-line bg-atlas-cloud/70 p-4">
                  <p className="text-sm font-semibold text-ink-800">
                    Do you have recurring household maintenance?
                  </p>
                  <div className="mt-3">
                    <SegmentedControl<HouseholdMaintenance>
                      value={setup.household.hasRecurringMaintenance}
                      options={["Yes", "No", "Not sure"]}
                      onChange={(hasRecurringMaintenance) =>
                        updateSetup((current) => ({
                          ...current,
                          household: {
                            ...current.household,
                            hasRecurringMaintenance,
                          },
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <p className="text-sm font-semibold text-ink-800">
                  Do you have any of these?
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {householdNeedOptions.map((need) => (
                    <ToggleChip
                      key={need}
                      label={need}
                      selected={setup.household.needs.includes(need)}
                      onClick={() => toggleArrayValue("needs", need)}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    updateSetup((current) => ({
                      ...current,
                      household: {
                        ...current.household,
                        askLater: !current.household.askLater,
                      },
                    }))
                  }
                  className={`mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg border px-3 text-sm font-semibold ${
                    setup.household.askLater
                      ? "border-ink-950 bg-ink-950 text-white"
                      : "border-atlas-line bg-white text-ink-700"
                  }`}
                >
                  <Sparkles aria-hidden="true" size={16} />
                  I&apos;m not sure. Atlas can ask later.
                </button>
              </div>
            </StepShell>
          ) : null}

          {step === 4 ? (
            <StepShell title="Shopping setup." eyebrow="Step 5">
              <div className="grid gap-4 md:grid-cols-2">
                <TextInput
                  label="Preferred grocery provider"
                  value={setup.shopping.groceryProvider}
                  placeholder="Any store or app"
                  onChange={(groceryProvider) =>
                    updateSetup((current) => ({
                      ...current,
                      shopping: { ...current.shopping, groceryProvider },
                    }))
                  }
                />
                <TextInput
                  label="Preferred household supplier"
                  value={setup.shopping.householdSupplier}
                  placeholder="Any store or app"
                  onChange={(householdSupplier) =>
                    updateSetup((current) => ({
                      ...current,
                      shopping: { ...current.shopping, householdSupplier },
                    }))
                  }
                />
                <TextInput
                  label="Preferred bulk store"
                  value={setup.shopping.bulkStore}
                  placeholder="Optional"
                  onChange={(bulkStore) =>
                    updateSetup((current) => ({
                      ...current,
                      shopping: { ...current.shopping, bulkStore },
                    }))
                  }
                />
                <TextInput
                  label="Preferred hardware provider"
                  value={setup.shopping.hardwareProvider}
                  placeholder="Optional"
                  onChange={(hardwareProvider) =>
                    updateSetup((current) => ({
                      ...current,
                      shopping: { ...current.shopping, hardwareProvider },
                    }))
                  }
                />
                <TextInput
                  label="Weekly grocery budget target"
                  value={setup.shopping.weeklyBudgetTarget}
                  placeholder="$250/week"
                  onChange={(weeklyBudgetTarget) =>
                    updateSetup((current) => ({
                      ...current,
                      shopping: { ...current.shopping, weeklyBudgetTarget },
                    }))
                  }
                />
                <div>
                  <p className="text-sm font-medium text-ink-700">
                    Substitution rule
                  </p>
                  <div className="mt-2">
                    <SegmentedControl
                      value={setup.shopping.substitutionRule}
                      options={substitutionRules}
                      onChange={(substitutionRule) =>
                        updateSetup((current) => ({
                          ...current,
                          shopping: { ...current.shopping, substitutionRule },
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="mt-5 space-y-3">
                <ToggleRow
                  label="Require approval before any order"
                  checked={setup.shopping.requireApprovalBeforeOrder}
                  onChange={(requireApprovalBeforeOrder) =>
                    updateSetup((current) => ({
                      ...current,
                      shopping: {
                        ...current.shopping,
                        requireApprovalBeforeOrder,
                      },
                    }))
                  }
                />
                <ToggleRow
                  label="Keep household extras separate from groceries"
                  checked={setup.shopping.keepHouseholdExtrasSeparate}
                  onChange={(keepHouseholdExtrasSeparate) =>
                    updateSetup((current) => ({
                      ...current,
                      shopping: {
                        ...current.shopping,
                        keepHouseholdExtrasSeparate,
                      },
                    }))
                  }
                />
              </div>
            </StepShell>
          ) : null}

          {step === 5 ? (
            <StepShell title="Approval rules." eyebrow="Step 6">
              <div className="grid gap-3 md:grid-cols-2">
                {lockedPilotApprovalRules.map((rule) => (
                  <div
                    key={rule}
                    className="flex items-start gap-3 rounded-lg border border-atlas-line bg-atlas-cloud/70 p-4"
                  >
                    <LockKeyhole aria-hidden="true" className="mt-0.5 shrink-0 text-atlas-rose" size={17} />
                    <div>
                      <p className="text-sm font-semibold text-ink-900">
                        {rule}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-ink-500">
                        Locked on in pilot mode.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-lg border border-atlas-line bg-white/82 p-4">
                <p className="text-sm font-semibold text-ink-800">
                  Default autonomy mode
                </p>
                <p className="mt-2 text-sm leading-6 text-ink-600">
                  Approval required is the safest default. Watch only observes;
                  Prepare only stages drafts and lists.
                </p>
                <div className="mt-4">
                  <SegmentedControl
                    value={setup.autonomyMode}
                    options={autonomyModes}
                    onChange={(autonomyMode) =>
                      updateSetup((current) => ({ ...current, autonomyMode }))
                    }
                  />
                </div>
              </div>
            </StepShell>
          ) : null}

          {step === 6 ? (
            <StepShell title="First Daily Brief preview." eyebrow="Step 7">
              <div className="rounded-lg border border-atlas-line bg-atlas-cloud/70 p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ink-950 text-white">
                    <ClipboardList aria-hidden="true" size={19} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-ink-950">
                      {preview.greeting}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-ink-600">
                      Here&apos;s what Atlas would watch in your local pilot.
                    </p>
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {preview.enabledLifeAreas.length > 0 ? (
                    preview.enabledLifeAreas.map((area) => (
                      <span
                        key={area}
                        className="rounded-full border border-atlas-line bg-white px-3 py-1.5 text-xs font-semibold text-ink-700"
                      >
                        {area}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-ink-500">
                      No enabled life areas yet.
                    </span>
                  )}
                </div>
                <div className="mt-5 space-y-3">
                  {preview.recommendations.map((recommendation) => (
                    <div
                      key={recommendation}
                      className="rounded-lg border border-atlas-line bg-white/84 p-3 text-sm leading-6 text-ink-700"
                    >
                      {recommendation}
                    </div>
                  ))}
                </div>
                <div className="mt-5 rounded-lg border border-atlas-line bg-white p-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck aria-hidden="true" className="mt-0.5 text-atlas-sage" size={18} />
                    <p className="text-sm font-medium leading-6 text-ink-700">
                      {preview.safetyNote}
                    </p>
                  </div>
                </div>
              </div>
            </StepShell>
          ) : null}

          {step === 7 ? (
            <StepShell title="Atlas is ready for your pilot." eyebrow="Step 8">
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                <div className="flex items-start gap-3">
                  <Check aria-hidden="true" className="mt-0.5 text-emerald-700" size={19} />
                  <div>
                    <p className="text-sm font-semibold text-emerald-900">
                      Setup is saved locally.
                    </p>
                    <p className="mt-1 text-sm leading-6 text-emerald-800">
                      No real accounts are connected, and Atlas will not send,
                      order, pay, cancel, or contact anyone in pilot mode.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/today"
                  onClick={() => finish(false)}
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-ink-950 bg-ink-950 px-4 text-sm font-semibold text-white"
                >
                  <Home aria-hidden="true" size={16} />
                  Go to Today
                </Link>
                <Link
                  href="/command"
                  onClick={() => finish(false)}
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-atlas-line bg-white px-4 text-sm font-semibold text-ink-700"
                >
                  Review Life Map
                </Link>
                <Link
                  href="/settings"
                  onClick={() => finish(false)}
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-atlas-line bg-white px-4 text-sm font-semibold text-ink-700"
                >
                  Tune Settings
                </Link>
              </div>
            </StepShell>
          ) : null}
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            disabled={step === 0}
            onClick={() => setStep((current) => Math.max(0, current - 1))}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-atlas-line bg-white px-3 text-sm font-semibold text-ink-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ArrowLeft aria-hidden="true" size={16} />
            Back
          </button>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setStep((current) => Math.min(7, current + 1))}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-atlas-line bg-white px-3 text-sm font-semibold text-ink-700"
            >
              Skip this step
            </button>
            <button
              type="button"
              onClick={() => {
                if (step === 6) {
                  finish(false);
                }
                setStep((current) => Math.min(7, current + 1));
              }}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-ink-950 bg-ink-950 px-3 text-sm font-semibold text-white"
            >
              {step >= 6 ? "Finish setup" : "Continue"}
              <ArrowRight aria-hidden="true" size={16} />
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
