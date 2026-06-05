# Atlas Security and Privacy Foundation

Atlas is read-only by default. In the pilot, Atlas uses mock data and localStorage only. It prepares summaries, drafts, lists, reminders, and approval items, but it does not send, order, purchase, pay, cancel, contact vendors, or trigger external actions.

## Principles

- Data minimization: collect and retain only what is needed for the user-facing workflow.
- Approval-first: external actions must require explicit user approval.
- Prepared, not ordered: shopping, reminders, and drafts are staged for review only.
- Auditability: user decisions and settings changes should be visible in the audit log.
- Sensitive-by-default: legal, financial, medical, identity, household, and family data need extra care.

## Pilot Limitations

- localStorage is not secure storage for real sensitive data.
- No real accounts are connected.
- No authentication, encryption, backend access control, deletion/export flow, or retention policy exists yet.
- Demo data may include household examples, provider preferences, and approval records for product testing only.

## Sensitive Data Categories

- Profile and household details
- Calendar, email, message, and document data
- Shopping preferences, receipts, and returns
- Money organization and subscription context
- Legal/risk review items
- Approval decisions and audit events
- Settings and hidden recommendation preferences

## Required Before Real User Data

- Authentication and session management
- Encrypted transport and encrypted storage
- Secure backend with access controls
- User data deletion and export
- Audit retention policy
- Vendor/API security review
- Privacy policy and terms
- Incident response plan
- Dependency and vulnerability scanning
- Prompt injection testing before AI integrations
- Abuse, authorization, and external-action approval tests

## Dependency and Release Security

- Run `npm audit` before releases and after dependency changes.
- Review critical and high vulnerabilities first, then assess moderate findings by runtime impact.
- Avoid blind `npm audit fix --force` changes because force fixes can introduce breaking downgrades or major upgrades.
- Document unresolved vulnerabilities with severity, affected package, impact area, and reason they remain open.
- Run `npm run validate` after dependency changes to confirm typecheck, tests, and production build still pass.

### Current Follow-up

- `next` includes a nested `postcss@8.4.31` copy flagged by `GHSA-qx2v-qp2m-jg93`.
- Severity: moderate.
- Impact area: production framework dependency during CSS processing; Atlas does not accept user-authored CSS in the pilot.
- Status: unresolved because `npm audit fix --force` recommends `next@9.3.3`, which would be a breaking downgrade from Next 16.
- Follow-up: monitor Next.js releases for a patched nested PostCSS dependency and upgrade Next when a compatible fix is available.

## External Action Policy

Atlas must not implement real external actions until the security model is complete. Banned pilot capabilities include sending messages, placing orders, submitting payments, canceling services, contacting vendors, or executing third-party API actions.
