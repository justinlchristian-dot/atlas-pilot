"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ClipboardList,
  MessageSquareText,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { SummaryCard } from "@/components/summary-card";
import {
  createFeedbackEntry,
  createPersonaFinding,
  feedbackEntriesStorageKey,
  feedbackRoutes,
  getFeedbackSummary,
  getPersonaName,
  personaFindingsStorageKey,
  safeParseFeedbackEntries,
  safeParsePersonaFindings,
  type FeedbackEntry,
  type FeedbackSentiment,
  type PersonaFinding,
} from "@/data/feedback";
import { syntheticPersonas } from "@/data/personas";
import type { ModuleVisibility } from "@/data/settings";

const sentiments: FeedbackSentiment[] = [
  "Useful",
  "Noisy",
  "Missing",
  "Risky",
  "Confusing",
];
const impactLevels = ["Low", "Medium", "High"] as const;
const helpsOptions = ["Yes", "Somewhat", "No"] as const;
const defaultModes: ModuleVisibility[] = ["Enabled", "Quiet", "Off"];
const featureAreas: PersonaFinding["featureArea"][] = [
  "Today",
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
  "Approvals",
  "Audit",
  "Settings",
  "Feedback",
];

function readStoredFeedback() {
  if (typeof window === "undefined") {
    return [];
  }

  return safeParseFeedbackEntries(
    window.localStorage.getItem(feedbackEntriesStorageKey),
  );
}

function readStoredFindings() {
  if (typeof window === "undefined") {
    return [];
  }

  return safeParsePersonaFindings(
    window.localStorage.getItem(personaFindingsStorageKey),
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-sm font-medium text-ink-700">{children}</span>
  );
}

export default function FeedbackPage() {
  const [entries, setEntries] = useState<FeedbackEntry[]>([]);
  const [findings, setFindings] = useState<PersonaFinding[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState({
    route: "/today",
    personaId: "busy-parent-homeowner",
    sentiment: "Useful" as FeedbackSentiment,
    summary: "",
    detail: "",
  });
  const [findingForm, setFindingForm] = useState({
    personaId: "busy-parent-homeowner",
    featureArea: "Today" as PersonaFinding["featureArea"],
    helps: "Yes" as PersonaFinding["helps"],
    noise: "Low" as PersonaFinding["noise"],
    confusion: "Low" as PersonaFinding["confusion"],
    trustConcern: "Low" as PersonaFinding["trustConcern"],
    defaultMode: "Enabled" as ModuleVisibility,
    finding: "",
    recommendedFix: "",
  });

  useEffect(() => {
    setEntries(readStoredFeedback());
    setFindings(readStoredFindings());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(feedbackEntriesStorageKey, JSON.stringify(entries));
  }, [entries, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(personaFindingsStorageKey, JSON.stringify(findings));
  }, [findings, hydrated]);

  const summary = useMemo(
    () => getFeedbackSummary(entries, findings),
    [entries, findings],
  );

  function submitFeedback(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!feedbackForm.summary.trim()) return;

    setEntries((current) => [
      createFeedbackEntry(feedbackForm),
      ...current,
    ]);
    setFeedbackForm((current) => ({ ...current, summary: "", detail: "" }));
  }

  function submitFinding(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!findingForm.finding.trim()) return;

    setFindings((current) => [
      createPersonaFinding(findingForm),
      ...current,
    ]);
    setFindingForm((current) => ({
      ...current,
      finding: "",
      recommendedFix: "",
    }));
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl">
        <section className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase text-atlas-sage">
              Feedback Log
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-normal text-ink-950 sm:text-5xl">
              Capture tester notes without sending data.
            </h1>
            <p className="mt-3 max-w-3xl text-lg leading-8 text-ink-600">
              Track what felt useful, noisy, missing, risky, or confusing across
              routes and personas. Notes stay in this browser only.
            </p>
          </div>
          <div className="rounded-lg border border-rose-200 bg-rose-50/80 p-4 shadow-card">
            <p className="text-xs font-semibold uppercase text-rose-800">
              Local pilot notes
            </p>
            <p className="mt-2 text-sm leading-6 text-rose-900">
              Feedback is not submitted anywhere. Do not enter real sensitive
              data, private messages, account details, legal facts, or medical details.
            </p>
          </div>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            title="Feedback notes"
            value={summary.feedbackCount}
            detail="Local route and tester observations."
            icon={MessageSquareText}
          />
          <SummaryCard
            title="Persona findings"
            value={summary.findingCount}
            detail="Persona-specific fit, noise, and trust checks."
            icon={UserRound}
          />
          <SummaryCard
            title="Open review items"
            value={summary.openCount}
            detail="Items not yet marked reviewed or closed."
            icon={ClipboardList}
          />
          <SummaryCard
            title="High trust concerns"
            value={summary.highTrustConcerns}
            detail="Persona findings with high trust/privacy concern."
            icon={AlertTriangle}
            tone="serious"
          />
        </section>

        <section className="mt-6 grid gap-4 xl:grid-cols-2">
          <form
            onSubmit={submitFeedback}
            className="rounded-lg border border-atlas-line/80 bg-white/86 p-5 shadow-card"
          >
            <div className="flex items-center gap-3">
              <MessageSquareText aria-hidden="true" className="text-atlas-tide" size={20} />
              <h2 className="text-xl font-semibold text-ink-950">
                Add feedback note
              </h2>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <FieldLabel>Route</FieldLabel>
                <select
                  value={feedbackForm.route}
                  onChange={(event) =>
                    setFeedbackForm((current) => ({
                      ...current,
                      route: event.target.value,
                    }))
                  }
                  className="mt-2 min-h-11 w-full rounded-lg border border-atlas-line bg-atlas-cloud/70 px-3 text-sm text-ink-800"
                >
                  {feedbackRoutes.map((route) => (
                    <option key={route}>{route}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <FieldLabel>Persona</FieldLabel>
                <select
                  value={feedbackForm.personaId}
                  onChange={(event) =>
                    setFeedbackForm((current) => ({
                      ...current,
                      personaId: event.target.value,
                    }))
                  }
                  className="mt-2 min-h-11 w-full rounded-lg border border-atlas-line bg-atlas-cloud/70 px-3 text-sm text-ink-800"
                >
                  {syntheticPersonas.map((persona) => (
                    <option key={persona.id} value={persona.id}>
                      {persona.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block sm:col-span-2">
                <FieldLabel>Signal</FieldLabel>
                <select
                  value={feedbackForm.sentiment}
                  onChange={(event) =>
                    setFeedbackForm((current) => ({
                      ...current,
                      sentiment: event.target.value as FeedbackSentiment,
                    }))
                  }
                  className="mt-2 min-h-11 w-full rounded-lg border border-atlas-line bg-atlas-cloud/70 px-3 text-sm text-ink-800"
                >
                  {sentiments.map((sentiment) => (
                    <option key={sentiment}>{sentiment}</option>
                  ))}
                </select>
              </label>
              <label className="block sm:col-span-2">
                <FieldLabel>Short summary</FieldLabel>
                <input
                  value={feedbackForm.summary}
                  onChange={(event) =>
                    setFeedbackForm((current) => ({
                      ...current,
                      summary: event.target.value,
                    }))
                  }
                  placeholder="Example: Today felt too busy for the renter persona"
                  className="mt-2 min-h-11 w-full rounded-lg border border-atlas-line bg-white px-3 text-sm text-ink-800"
                />
              </label>
              <label className="block sm:col-span-2">
                <FieldLabel>Details optional</FieldLabel>
                <textarea
                  value={feedbackForm.detail}
                  onChange={(event) =>
                    setFeedbackForm((current) => ({
                      ...current,
                      detail: event.target.value,
                    }))
                  }
                  rows={4}
                  className="mt-2 w-full rounded-lg border border-atlas-line bg-white px-3 py-3 text-sm text-ink-800"
                />
              </label>
            </div>
            <button
              type="submit"
              className="mt-5 inline-flex min-h-10 items-center rounded-lg border border-ink-950 bg-ink-950 px-3 text-sm font-semibold text-white"
            >
              Save local note
            </button>
          </form>

          <form
            onSubmit={submitFinding}
            className="rounded-lg border border-atlas-line/80 bg-white/86 p-5 shadow-card"
          >
            <div className="flex items-center gap-3">
              <UserRound aria-hidden="true" className="text-atlas-tide" size={20} />
              <h2 className="text-xl font-semibold text-ink-950">
                Add persona finding
              </h2>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <FieldLabel>Persona</FieldLabel>
                <select
                  value={findingForm.personaId}
                  onChange={(event) =>
                    setFindingForm((current) => ({
                      ...current,
                      personaId: event.target.value,
                    }))
                  }
                  className="mt-2 min-h-11 w-full rounded-lg border border-atlas-line bg-atlas-cloud/70 px-3 text-sm text-ink-800"
                >
                  {syntheticPersonas.map((persona) => (
                    <option key={persona.id} value={persona.id}>
                      {persona.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <FieldLabel>Area</FieldLabel>
                <select
                  value={findingForm.featureArea}
                  onChange={(event) =>
                    setFindingForm((current) => ({
                      ...current,
                      featureArea: event.target.value as PersonaFinding["featureArea"],
                    }))
                  }
                  className="mt-2 min-h-11 w-full rounded-lg border border-atlas-line bg-atlas-cloud/70 px-3 text-sm text-ink-800"
                >
                  {featureAreas.map((area) => (
                    <option key={area}>{area}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <FieldLabel>Helps?</FieldLabel>
                <select
                  value={findingForm.helps}
                  onChange={(event) =>
                    setFindingForm((current) => ({
                      ...current,
                      helps: event.target.value as PersonaFinding["helps"],
                    }))
                  }
                  className="mt-2 min-h-11 w-full rounded-lg border border-atlas-line bg-atlas-cloud/70 px-3 text-sm text-ink-800"
                >
                  {helpsOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <FieldLabel>Default mode</FieldLabel>
                <select
                  value={findingForm.defaultMode}
                  onChange={(event) =>
                    setFindingForm((current) => ({
                      ...current,
                      defaultMode: event.target.value as ModuleVisibility,
                    }))
                  }
                  className="mt-2 min-h-11 w-full rounded-lg border border-atlas-line bg-atlas-cloud/70 px-3 text-sm text-ink-800"
                >
                  {defaultModes.map((mode) => (
                    <option key={mode}>{mode}</option>
                  ))}
                </select>
              </label>
              {(["noise", "confusion", "trustConcern"] as const).map((field) => (
                <label key={field} className="block">
                  <FieldLabel>
                    {field === "trustConcern" ? "Trust/privacy concern" : field}
                  </FieldLabel>
                  <select
                    value={findingForm[field]}
                    onChange={(event) =>
                      setFindingForm((current) => ({
                        ...current,
                        [field]: event.target.value,
                      }))
                    }
                    className="mt-2 min-h-11 w-full rounded-lg border border-atlas-line bg-atlas-cloud/70 px-3 text-sm text-ink-800"
                  >
                    {impactLevels.map((level) => (
                      <option key={level}>{level}</option>
                    ))}
                  </select>
                </label>
              ))}
              <label className="block sm:col-span-2">
                <FieldLabel>Finding</FieldLabel>
                <textarea
                  value={findingForm.finding}
                  onChange={(event) =>
                    setFindingForm((current) => ({
                      ...current,
                      finding: event.target.value,
                    }))
                  }
                  rows={3}
                  className="mt-2 w-full rounded-lg border border-atlas-line bg-white px-3 py-3 text-sm text-ink-800"
                />
              </label>
              <label className="block sm:col-span-2">
                <FieldLabel>Recommended fix optional</FieldLabel>
                <textarea
                  value={findingForm.recommendedFix}
                  onChange={(event) =>
                    setFindingForm((current) => ({
                      ...current,
                      recommendedFix: event.target.value,
                    }))
                  }
                  rows={3}
                  className="mt-2 w-full rounded-lg border border-atlas-line bg-white px-3 py-3 text-sm text-ink-800"
                />
              </label>
            </div>
            <button
              type="submit"
              className="mt-5 inline-flex min-h-10 items-center rounded-lg border border-ink-950 bg-ink-950 px-3 text-sm font-semibold text-white"
            >
              Save persona finding
            </button>
          </form>
        </section>

        <section className="mt-8 grid gap-4 xl:grid-cols-2">
          <article className="rounded-lg border border-atlas-line/80 bg-white/86 p-5 shadow-card">
            <div className="flex items-center gap-3">
              <MessageSquareText aria-hidden="true" className="text-atlas-tide" size={20} />
              <h2 className="text-xl font-semibold text-ink-950">
                Feedback notes
              </h2>
            </div>
            <div className="mt-5 space-y-3">
              {entries.length > 0 ? (
                entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="rounded-lg border border-atlas-line bg-atlas-cloud/70 p-4"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-ink-950">
                          {entry.summary}
                        </p>
                        <p className="mt-1 text-xs font-medium text-ink-500">
                          {entry.route} - {getPersonaName(entry.personaId)} - {entry.sentiment}
                        </p>
                      </div>
                      <span className="rounded-full border border-atlas-line bg-white px-3 py-1 text-xs font-semibold text-ink-600">
                        {entry.status}
                      </span>
                    </div>
                    {entry.detail ? (
                      <p className="mt-3 text-sm leading-6 text-ink-600">
                        {entry.detail}
                      </p>
                    ) : null}
                  </div>
                ))
              ) : (
                <div className="rounded-lg border border-atlas-line bg-atlas-cloud/70 p-4 text-sm leading-6 text-ink-600">
                  No feedback notes yet. Add only synthetic or non-sensitive
                  observations from pilot testing.
                </div>
              )}
            </div>
          </article>

          <article className="rounded-lg border border-atlas-line/80 bg-white/86 p-5 shadow-card">
            <div className="flex items-center gap-3">
              <ShieldCheck aria-hidden="true" className="text-atlas-sage" size={20} />
              <h2 className="text-xl font-semibold text-ink-950">
                Persona findings
              </h2>
            </div>
            <div className="mt-5 space-y-3">
              {findings.length > 0 ? (
                findings.map((finding) => (
                  <div
                    key={finding.id}
                    className="rounded-lg border border-atlas-line bg-atlas-cloud/70 p-4"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-ink-950">
                          {getPersonaName(finding.personaId)} - {finding.featureArea}
                        </p>
                        <p className="mt-1 text-xs font-medium text-ink-500">
                          Helps: {finding.helps} - Noise: {finding.noise} - Trust: {finding.trustConcern}
                        </p>
                      </div>
                      <span className="rounded-full border border-atlas-line bg-white px-3 py-1 text-xs font-semibold text-ink-600">
                        {finding.defaultMode}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-ink-600">
                      {finding.finding}
                    </p>
                    {finding.recommendedFix ? (
                      <p className="mt-2 text-sm leading-6 text-ink-600">
                        Fix: {finding.recommendedFix}
                      </p>
                    ) : null}
                  </div>
                ))
              ) : (
                <div className="rounded-lg border border-atlas-line bg-atlas-cloud/70 p-4 text-sm leading-6 text-ink-600">
                  No persona findings yet. Use this to capture whether a feature
                  helps, creates noise, creates confusion, or raises trust concerns.
                </div>
              )}
            </div>
          </article>
        </section>
      </div>
    </AppShell>
  );
}
