import Link from "next/link";
import {
  ArrowRight,
  ClipboardList,
  MessageSquareText,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PilotModeCard } from "@/components/pilot-mode-card";

const feedbackPrompts = [
  "What felt useful?",
  "What felt noisy?",
  "What did Atlas miss?",
  "What would you hide?",
  "What felt trustworthy?",
  "What felt risky?",
  "Would you use this daily?",
  "What would make this worth paying for?",
  "Would you trust this with real data if security/auth were added?",
];

const testAreas = [
  "Load a synthetic persona from Persona QA Mode.",
  "Complete onboarding with a light profile.",
  "Review Today and notice what feels relevant or noisy.",
  "Tune Life Areas to Enabled, Quiet, or Off.",
  "Try Household and Shopping mock actions.",
  "Approve, snooze, reject, hide, or edit a mock recommendation.",
  "Review the Audit Log after decisions.",
  "Capture non-sensitive notes in the Feedback Log.",
  "Reset pilot data from Settings and confirm the experience restarts cleanly.",
];

export default function PilotGuidePage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl">
        <section className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase text-atlas-sage">
              Pilot Guide
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-normal text-ink-950 sm:text-5xl">
              Help test Atlas safely.
            </h1>
            <p className="mt-3 max-w-3xl text-lg leading-8 text-ink-600">
              Use this guide to review the pilot experience, spot noisy
              recommendations, and capture what would make Atlas useful every day.
            </p>
          </div>
          <Link
            href="/settings"
            className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-ink-950 bg-ink-950 px-4 text-sm font-semibold text-white"
          >
            Reset pilot data
            <ArrowRight aria-hidden="true" size={16} />
          </Link>
        </section>

        <section className="mt-8">
          <PilotModeCard />
        </section>

        <section className="mt-6 rounded-lg border border-atlas-line/80 bg-white/86 p-5 shadow-card">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-ink-950">
                Persona QA Mode
              </h2>
              <p className="mt-2 text-sm leading-6 text-ink-600">
                Load synthetic demo households to test whether Atlas adapts
                across lifestyles without using real sensitive data.
              </p>
            </div>
            <Link
              href="/personas"
              className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-atlas-line bg-white px-3 text-sm font-semibold text-ink-700"
            >
              Open personas
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>
        </section>

        <section className="mt-6 rounded-lg border border-atlas-line/80 bg-white/86 p-5 shadow-card">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-ink-950">
                Feedback Log
              </h2>
              <p className="mt-2 text-sm leading-6 text-ink-600">
                Save local tester observations and persona findings. Feedback is
                not submitted anywhere in this pilot.
              </p>
            </div>
            <Link
              href="/feedback"
              className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-atlas-line bg-white px-3 text-sm font-semibold text-ink-700"
            >
              Open feedback
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-2">
          <article className="rounded-lg border border-atlas-line/80 bg-white/86 p-5 shadow-card">
            <div className="flex items-center gap-3">
              <Sparkles aria-hidden="true" className="text-atlas-tide" size={20} />
              <h2 className="text-xl font-semibold text-ink-950">
                What Atlas is
              </h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-ink-600">
              Atlas is a private, approval-based life assistant pilot. It gives
              a calm daily brief, prepares helpful local recommendations, and
              keeps decisions visible through approvals and audit history.
            </p>
          </article>

          <article className="rounded-lg border border-atlas-line/80 bg-white/86 p-5 shadow-card">
            <div className="flex items-center gap-3">
              <ShieldCheck aria-hidden="true" className="text-atlas-sage" size={20} />
              <h2 className="text-xl font-semibold text-ink-950">
                What not to enter
              </h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-ink-600">
              Do not enter real sensitive data, account credentials, payment
              details, medical information, legal details, private messages, or
              anything you would not want stored in browser localStorage.
            </p>
          </article>
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-[1fr_0.9fr]">
          <article className="rounded-lg border border-atlas-line/80 bg-white/86 p-5 shadow-card">
            <div className="flex items-center gap-3">
              <ClipboardList aria-hidden="true" className="text-atlas-tide" size={20} />
              <h2 className="text-xl font-semibold text-ink-950">
                What to test
              </h2>
            </div>
            <div className="mt-4 space-y-3">
              {testAreas.map((item) => (
                <div
                  key={item}
                  className="rounded-lg border border-atlas-line bg-atlas-cloud/70 p-3 text-sm leading-6 text-ink-700"
                >
                  {item}
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-lg border border-atlas-line/80 bg-white/86 p-5 shadow-card">
            <div className="flex items-center gap-3">
              <RotateCcw aria-hidden="true" className="text-atlas-tide" size={20} />
              <h2 className="text-xl font-semibold text-ink-950">
                How pilot data works
              </h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-ink-600">
              Atlas stores pilot setup and decisions locally in this browser.
              Settings includes reset controls that clear only Atlas localStorage
              keys. A full reset clears the audit log too, so it cannot keep a
              reset event afterward.
            </p>
            <Link
              href="/settings"
              className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg border border-atlas-line bg-white px-3 text-sm font-semibold text-ink-700"
            >
              Open reset controls
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </article>
        </section>

        <section className="mt-6 rounded-lg border border-atlas-line/80 bg-ink-950 p-5 text-white shadow-soft">
          <div className="flex items-center gap-3">
            <MessageSquareText aria-hidden="true" className="text-white/78" size={20} />
            <h2 className="text-xl font-semibold">Feedback prompts</h2>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {feedbackPrompts.map((prompt) => (
              <div
                key={prompt}
                className="rounded-lg border border-white/10 bg-white/8 p-3 text-sm leading-6 text-white/82"
              >
                {prompt}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-lg border border-atlas-line/80 bg-white/86 p-5 shadow-card">
          <h2 className="text-xl font-semibold text-ink-950">
            Known limitations
          </h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {[
              "No real accounts are connected.",
              "No backend or database exists yet.",
              "localStorage is not secure storage for real sensitive data.",
              "No AI calls or real automations run in this pilot.",
              "Approvals update local state only.",
              "Feedback prompts are static; no feedback is submitted yet.",
            ].map((item) => (
              <div
                key={item}
                className="rounded-lg border border-atlas-line bg-atlas-cloud/70 p-3 text-sm leading-6 text-ink-700"
              >
                {item}
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
