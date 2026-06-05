# Atlas Codex Operating Rules

These rules are the standing operating contract for future Codex work on Atlas.
They apply to product builds, audits, documentation passes, test updates, and
deployment prep unless a user explicitly scopes a different task.

## Product Principles

- Atlas is universal first and personalized second.
- Atlas is mock-only and localStorage-only during the pilot.
- Atlas is read-only by default.
- Atlas prepares actions but does not perform external actions.
- Nothing external happens without explicit approval.
- Every meaningful user decision should be auditable.
- Users must be able to tune, hide, quiet, or disable recommendations.
- Shopping must stay provider-agnostic.
- Sensitive legal, financial, medical, identity, household, and family items must remain draft-only or review-only.
- Atlas must not overfit to founder-specific context.
- Do not use real sensitive user data in pilot testing.

## Permanent Guardrails

- Do not add authentication unless explicitly requested.
- Do not add a database unless explicitly requested.
- Do not add real integrations unless explicitly requested.
- Do not add AI calls unless explicitly requested.
- Do not send messages.
- Do not place orders.
- Do not process payments.
- Do not contact vendors.
- Do not cancel anything.
- Do not add secrets or API keys.
- Do not add external actions.
- Do not collect sensitive real user data.
- Do not introduce legal, financial, or medical advice.
- Preserve approval-first and audit-first architecture.
- Keep everything mock-only and localStorage-only until backend/security scope is explicitly approved.

## Required Codex Definition Of Done

Every Codex task should include validation, security/privacy review, product drift checks, and clear reporting. At minimum:

- Run `npm run test:run`.
- Run `npm run typecheck`.
- Run `npm run build`.
- Run `npm run validate`.
- Run `npm audit`.
- Run `npm run test:e2e` when feasible.
- Report clearly if e2e cannot run because Chromium or Playwright is blocked by sandbox limitations.
- Scan for secrets, API keys, and secret-like `NEXT_PUBLIC` variables.
- Scan for external-action code or implementation names.
- Scan for founder-specific strings.
- Scan for narrow business, mortgage, realtor, motorsports, or store-specific assumptions.
- Confirm no auth, database, integration, AI call, or external action was added unless explicitly scoped.
- Confirm approval-first and audit-first architecture is preserved.
- Confirm reset/localStorage behavior remains scoped to Atlas pilot keys.
- Confirm docs were updated when behavior changed.
- Report known vulnerabilities and whether they are new, fixed, or still unresolved.
- State whether Atlas is still safe for pilot testing.

## Required Scans

Use focused source scans before reporting completion:

```bash
rg -n "sendEmail|sendText|placeOrder|submitPayment|cancelSubscription|contactVendor|autoOrder|autoPay|executeExternalAction|fetch\(|axios|openai|apiKey|secret|sk-proj|sk-live|NEXT_PUBLIC_[A-Z0-9_]*(SECRET|TOKEN|KEY)" app components data hooks tests docs README.md DEPLOYMENT.md package.json
```

```bash
rg -n "Walmart|Amazon|Home Depot|Costco|Justin|mortgage|Mortgage|Culture|Motorsports|motorsports|realtor|Realtor|Zillow" app components data hooks tests docs README.md DEPLOYMENT.md package.json
```

Treat matches in security guardrail tests or local path documentation as expected only when they are clearly not product behavior.

## Required Persona QA Checklist

Every future feature, page, component, workflow, settings change, or recommendation pattern must be tested or reasoned through against all synthetic personas:

- Busy Parent Homeowner
- Single Professional Renter
- Retired Couple
- Small Business Owner
- Caregiver / Adult Child
- Budget-Focused Household
- Non-Technical User
- Power User / Life Admin Heavy

For each persona, report:

- Does this feature help this persona?
- Does it create noise?
- Does it create confusion?
- Does it create a trust or privacy concern?
- Should it be Enabled, Quiet, or Off by default?
- What fix or follow-up is recommended?

If a change does not affect a persona, say so explicitly. Do not assume silence means no impact.

## Learning From Mistakes

- Do not overfit Atlas to Justin or founder context.
- Do not hardcode mortgage, realtor, Zillow, Culture Motorsports, motorsports, or store-specific assumptions into the core product.
- Build shared workflow, approval, and audit patterns before isolated feature actions.
- Do not rely on Codex temporary servers for access; GitHub and Vercel are the source of truth.
- Add tests and security guardrails before expanding data collection.
- Do not run parallel Next builds.
- Document localStorage keys when adding persistence.
- Every new module needs reset behavior, audit behavior, and persona behavior.

## Required Future Response Format

Every future Codex result should include:

- Summary of changes
- Files changed
- Validation result
- E2E result or sandbox limitation
- `npm audit` result
- Security/privacy audit
- External-action status
- Secrets/API key status
- Auth/database/integration status
- Hardcoded personalized strings
- Persona QA impact
- Open bugs/gaps
- Whether Atlas is safe for pilot users
- Whether changes were pushed to GitHub, when requested

## Pilot Safety Statement

Until production security scope is explicitly approved, Atlas must remain a local mock pilot. A completed Codex task is not done until it can honestly say:

- No external action was added.
- No secrets were added.
- No real integration was added.
- No sensitive real data collection was added.
- Approval and audit behavior still work.
- Known vulnerabilities are reported.
- Atlas remains safe for pilot testers using synthetic or non-sensitive data.

