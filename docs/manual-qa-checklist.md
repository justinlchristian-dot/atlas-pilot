# Atlas Manual QA Checklist

Run this checklist before moving to the next pilot sprint.

## Core Routes

- `/today` loads and shows approval counts, recent activity, and safety language.
- `/onboarding` loads and shows the setup flow.
- `/pilot-guide` loads and shows tester instructions.
- `/approvals` loads and approval actions update local state.
- `/audit` loads and shows decisions, settings changes, and module origins.
- `/command` loads and Household actions can prepare approvals/audit events.
- `/shopping` loads and Shopping actions can prepare approvals/audit events.
- `/settings` loads and Tune Atlas controls are visible.

## Workflow Checks

- Complete `/onboarding` and confirm setup reaches the finish step.
- Complete onboarding with a custom display name.
- Verify Today greeting updates from onboarding.
- Turn Shopping Off and verify shopping is deemphasized on Today and disabled on `/shopping`.
- Turn Household Off and verify household is deemphasized on Today and `/command`.
- Select no pool and verify pool is not a primary Household action.
- Set a grocery provider and verify `/shopping` reflects it.
- Skip onboarding and confirm demo mode remains available.
- Refresh after onboarding and confirm setup choices persist locally.
- Confirm onboarding does not connect real accounts.
- Confirm Today still loads after onboarding and can show the local display name.
- Open `/pilot-guide` and confirm it explains what to test, what not to enter, limitations, reset behavior, and feedback prompts.
- Use Reset Pilot Data in `/settings` and confirm it requires confirmation.
- Confirm reset controls clear only Atlas pilot localStorage keys.
- Approve, edit, snooze, reject, and hide an approval.
- Confirm the decision appears in `/audit`.
- Create a Household approval and confirm it appears in `/approvals`.
- Create a Shopping approval and confirm it appears in `/approvals`.
- Restore a hidden recommendation in `/settings`.
- Change settings and confirm an audit event is created.

## Guardrails

- Confirm no emails, texts, orders, payments, cancellations, vendor contacts, or external actions occur.
- Confirm the UI says mock/pilot data only where relevant.
- Confirm approval-required language remains visible.
- Confirm sensitive/legal items remain draft-only or review-recommended.
- Confirm Pilot Mode status is visible on Today and Settings.

## Empty States

- Confirm no approvals waiting has clear guidance.
- Confirm no audit events explains local audit history.
- Confirm no hidden recommendations explains where hidden items appear.
- Confirm Shopping Off shows "Shopping is off in your Life Areas."
- Confirm Household Off shows household routines are hidden or deemphasized.
- Confirm Life Area Off cards are labeled Off.
- Confirm no onboarding profile yet links to setup.

## Responsive Smoke Check

- Check desktop layout.
- Check mobile header and horizontal navigation.
- Check cards stack cleanly on small screens.
- Check text does not overlap in buttons or cards.
- Mobile smoke test `/today`, `/onboarding`, `/pilot-guide`, `/command`, `/shopping`, `/approvals`, `/audit`, and `/settings`.

## Vercel Smoke Check

- `/`
- `/today`
- `/onboarding`
- `/pilot-guide`
- `/command`
- `/shopping`
- `/approvals`
- `/audit`
- `/settings`

## Release Checklist

- `npm audit` reviewed.
- Critical and high vulnerabilities reviewed before release.
- Unresolved vulnerabilities documented.
- `npm run validate` passed.
- `npm run validate` passed after pilot-readiness changes.
- No external-action guardrails failed.
- App smoke checked.

## Commands

- `npm audit`
- `npm run typecheck`
- `npm run test:run`
- `npm run build`
- `npm run validate`
