"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  ClipboardList,
  Home,
  RotateCcw,
  ShieldCheck,
  ShoppingCart,
  UserRound,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import {
  loadPersonaToStorage,
  syntheticPersonas,
  type SyntheticPersona,
} from "@/data/personas";

function PersonaCard({
  persona,
  onLoad,
}: {
  persona: SyntheticPersona;
  onLoad: (persona: SyntheticPersona) => void;
}) {
  return (
    <article className="rounded-lg border border-atlas-line/80 bg-white/86 p-5 shadow-card backdrop-blur-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase text-atlas-sage">
            Synthetic persona
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-normal text-ink-950">
            {persona.name}
          </h2>
          <p className="mt-2 text-sm leading-6 text-ink-600">
            {persona.shortDescription}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onLoad(persona)}
          className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-ink-950 bg-ink-950 px-3 text-sm font-semibold text-white"
        >
          Load persona
          <ArrowRight aria-hidden="true" size={16} />
        </button>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        <div className="rounded-lg border border-atlas-line bg-atlas-cloud/70 p-3">
          <p className="text-xs font-semibold uppercase text-ink-500">
            Enabled
          </p>
          <p className="mt-2 text-sm leading-6 text-ink-700">
            {persona.enabledLifeAreas.join(", ")}
          </p>
        </div>
        <div className="rounded-lg border border-atlas-line bg-atlas-cloud/70 p-3">
          <p className="text-xs font-semibold uppercase text-ink-500">
            Quiet / Off
          </p>
          <p className="mt-2 text-sm leading-6 text-ink-700">
            Quiet: {persona.quietLifeAreas.join(", ") || "None"}. Off:{" "}
            {persona.offLifeAreas.join(", ") || "None"}.
          </p>
        </div>
        <div className="rounded-lg border border-atlas-line bg-atlas-cloud/70 p-3">
          <p className="text-xs font-semibold uppercase text-ink-500">
            Approval mode
          </p>
          <p className="mt-2 text-sm leading-6 text-ink-700">
            {persona.autonomyMode}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div>
          <p className="text-sm font-semibold text-ink-950">
            What Atlas should emphasize
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {persona.emphasize.map((item) => (
              <span
                key={item}
                className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-ink-950">
            What Atlas should avoid
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {persona.avoid.map((item) => (
              <span
                key={item}
                className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-800"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-atlas-line bg-white/80 p-3">
        <p className="text-sm leading-6 text-ink-600">
          <span className="font-semibold text-ink-900">Household:</span>{" "}
          {persona.householdNeeds.length > 0
            ? persona.householdNeeds.join(", ")
            : "No routines selected. Atlas can ask later."}
        </p>
        <p className="mt-1 text-sm leading-6 text-ink-600">
          <span className="font-semibold text-ink-900">Shopping:</span>{" "}
          {persona.shopping.weeklyBudgetTarget || "budget unknown"}; providers
          stay generic demo preferences
          {persona.shopping.pharmacyProvider
            ? `, including ${persona.shopping.pharmacyProvider}`
            : ""}
          .
        </p>
      </div>
    </article>
  );
}

export default function PersonasPage() {
  const [loadedPersona, setLoadedPersona] = useState<SyntheticPersona | null>(null);

  function handleLoadPersona(persona: SyntheticPersona) {
    loadPersonaToStorage(window.localStorage, persona);
    window.dispatchEvent(new Event("storage"));
    setLoadedPersona(persona);
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl">
        <section className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase text-atlas-sage">
              Persona QA Mode
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-normal text-ink-950 sm:text-5xl">
              Test Atlas with synthetic households.
            </h1>
            <p className="mt-3 max-w-3xl text-lg leading-8 text-ink-600">
              Load a demo persona to populate local onboarding preferences and
              check whether Atlas emphasizes the right life areas without using
              real sensitive data.
            </p>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-ink-500">
              Persona loading updates local onboarding/profile preferences. It
              does not overwrite existing Settings changes; reset Settings first
              when you want a clean persona test.
            </p>
          </div>
          <div className="rounded-lg border border-rose-200 bg-rose-50/80 p-4 shadow-card">
            <p className="text-xs font-semibold uppercase text-rose-800">
              Demo data only
            </p>
            <p className="mt-2 text-sm leading-6 text-rose-900">
              Personas are synthetic demo users. Do not enter real sensitive
              data. Loading a persona does not send, order, pay, cancel, or
              contact anyone.
            </p>
          </div>
        </section>

        {loadedPersona ? (
          <section className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-5 shadow-card">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-3">
                <ShieldCheck
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-emerald-700"
                  size={20}
                />
                <div>
                  <p className="text-sm font-semibold text-emerald-950">
                    Persona loaded locally. Go to Today to review the experience.
                  </p>
                  <p className="mt-1 text-sm leading-6 text-emerald-800">
                    Loaded {loadedPersona.name}. Existing approvals, audit
                    events, settings, shopping edits, and unrelated browser
                    storage were not cleared. For a fully clean persona test,
                    reset pilot data first, then load the persona.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/today"
                  className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-ink-950 bg-ink-950 px-3 text-sm font-semibold text-white"
                >
                  <Home aria-hidden="true" size={16} />
                  Go to Today
                </Link>
                <Link
                  href="/command"
                  className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-emerald-200 bg-white px-3 text-sm font-semibold text-emerald-900"
                >
                  <ClipboardList aria-hidden="true" size={16} />
                  Review Life Map
                </Link>
                <Link
                  href="/shopping"
                  className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-emerald-200 bg-white px-3 text-sm font-semibold text-emerald-900"
                >
                  <ShoppingCart aria-hidden="true" size={16} />
                  Open Shopping
                </Link>
                <Link
                  href="/settings"
                  className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-emerald-200 bg-white px-3 text-sm font-semibold text-emerald-900"
                >
                  <RotateCcw aria-hidden="true" size={16} />
                  Reset Pilot Data
                </Link>
              </div>
            </div>
          </section>
        ) : null}

        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-lg border border-atlas-line bg-white/82 p-4 shadow-card">
            <UserRound aria-hidden="true" className="text-atlas-tide" size={20} />
            <p className="mt-3 text-2xl font-semibold text-ink-950">
              {syntheticPersonas.length}
            </p>
            <p className="mt-1 text-sm text-ink-600">Synthetic test personas</p>
          </div>
          <div className="rounded-lg border border-atlas-line bg-white/82 p-4 shadow-card">
            <ClipboardList aria-hidden="true" className="text-atlas-tide" size={20} />
            <p className="mt-3 text-2xl font-semibold text-ink-950">
              Local only
            </p>
            <p className="mt-1 text-sm text-ink-600">Writes onboarding storage</p>
          </div>
          <div className="rounded-lg border border-atlas-line bg-white/82 p-4 shadow-card">
            <ShieldCheck aria-hidden="true" className="text-atlas-sage" size={20} />
            <p className="mt-3 text-2xl font-semibold text-ink-950">
              Approval-first
            </p>
            <p className="mt-1 text-sm text-ink-600">No external actions</p>
          </div>
          <div className="rounded-lg border border-atlas-line bg-white/82 p-4 shadow-card">
            <ShoppingCart aria-hidden="true" className="text-atlas-tide" size={20} />
            <p className="mt-3 text-2xl font-semibold text-ink-950">
              Generic
            </p>
            <p className="mt-1 text-sm text-ink-600">Provider-agnostic shopping</p>
          </div>
        </section>

        <section className="mt-8 grid gap-4 xl:grid-cols-2">
          {syntheticPersonas.map((persona) => (
            <PersonaCard
              key={persona.id}
              persona={persona}
              onLoad={handleLoadPersona}
            />
          ))}
        </section>
      </div>
    </AppShell>
  );
}
