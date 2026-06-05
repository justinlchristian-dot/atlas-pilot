# Atlas Pilot Test Plan

## Goal

Validate whether Atlas feels useful, calm, trustworthy, and low-friction for everyday life admin before adding real accounts, integrations, AI calls, or production data handling.

## Who Should Test

- People willing to evaluate a mock/local pilot experience.
- People comfortable using fake or light setup data.
- People who can describe what felt useful, noisy, missing, or trustworthy.

Do not use this pilot with real sensitive data.

## 7-Day Test Flow

Day 1:
- Open `/personas` and load one synthetic demo persona, or open `/onboarding`.
- Open `/onboarding`.
- Complete setup with light, non-sensitive information.
- Visit `/today` and note whether the brief feels useful.

Day 2:
- Toggle Life Areas between Enabled, Quiet, and Off.
- Check whether Today and Life Map respond clearly.

Day 3:
- Review Household Operations.
- Note whether selected routines feel relevant.

Day 4:
- Review Shopping Prep.
- Update provider preferences and budget targets using non-sensitive examples.

Day 5:
- Use Approval Center actions: approve, edit, snooze, reject, and hide mock items.
- Confirm the Audit Log records local decisions.

Day 6:
- Use Settings to tune modules and recommendations.
- Restore or hide recommendations.

Day 7:
- Reset pilot data.
- Repeat the first-run experience and capture final feedback.

## Daily Tasks

- Visit `/today`.
- Check whether anything feels too noisy.
- Try one mock decision in `/approvals`.
- Review `/audit` for clarity.
- Note what Atlas missed or overemphasized.
- Capture non-sensitive observations in `/feedback`.

## Mobile Testing

- Test on at least one phone-sized viewport or real mobile browser.
- Confirm the mobile navigation scrolls horizontally and remains usable.
- Confirm cards stack cleanly without horizontal overflow.
- Confirm buttons and segmented controls are easy to tap.
- Confirm `/today`, `/onboarding`, `/pilot-guide`, `/personas`, `/command`, `/shopping`, `/approvals`, `/audit`, and `/settings` remain readable.

## Persona QA Testing

Personas are synthetic demo users. They are meant for product testing only and
should not be replaced with real sensitive data.

How to test:

- Open `/personas`.
- Load one persona.
- Visit `/today`, `/command`, `/shopping`, and `/settings`.
- Confirm the greeting, enabled life areas, household routines, shopping budget, and provider preferences reflect the persona.
- Confirm unrelated approvals, audit history, settings edits, and shopping edits are not cleared by loading a persona.
- Record persona-specific findings in `/feedback` after testing Today, Life Map, Shopping, and Settings.
- Persona loading updates onboarding/profile preferences but does not overwrite existing Settings changes.
- For a fully clean persona test, use Reset settings or Reset all Atlas pilot data first, then load the persona.
- Use Reset Pilot Data in `/settings` only when you intentionally want to clear local pilot data.

What to look for:

- Busy Parent Homeowner should emphasize family, household tasks, groceries, reminders, and approvals.
- Single Professional Renter should emphasize work, documents, bills/subscriptions, and simple shopping without primary homeowner maintenance.
- Retired Couple should use simple language and emphasize household routines, reminders, documents, shopping, and family.
- Small Business Owner should emphasize projects, business/admin follow-ups, documents, supplies, and approvals.
- Caregiver / Adult Child should keep legal and health wording review-only, not advice.
- Budget-Focused Household should emphasize budget, shopping totals, subscriptions/refunds, and basic household without extras.
- Non-Technical User should keep setup light, gentle, and not overwhelming.
- Power User / Life Admin Heavy should show broader coverage while staying calm, approval-first, and auditable.

## What Not To Enter

- Passwords, tokens, or account credentials
- Payment information
- Real medical, legal, financial, or identity details
- Private emails, texts, or documents
- Sensitive household or family information
- Anything you would not want stored in browser localStorage

## Feedback Questions

- What felt useful?
- What felt noisy?
- What did Atlas miss?
- What would you hide?
- What would you approve?
- What would make this worth using daily?
- What felt trustworthy?
- What felt risky?
- Would you use this daily?
- What would make this worth paying for?
- Would you trust this with real data if security/auth were added?

## How To Report Feedback

The app does not submit feedback yet. Send notes manually with:

- The route or screen where the feedback happened
- What you expected
- What happened
- Whether it felt useful, noisy, risky, or missing
- The device/browser used

## Known Limitations

- No real accounts are connected.
- No backend, database, or authentication exists.
- localStorage is not secure storage for sensitive data.
- localStorage data is device-specific and browser-specific.
- Persona QA writes synthetic onboarding preferences to localStorage only.
- Feedback Log writes local tester notes and persona findings to localStorage only. It does not submit feedback.
- Calendar and Vault are pilot placeholders. No real calendar or document data is connected.
- No AI calls or real automations run.
- Approvals update local state only.
- Feedback prompts are static and are not submitted.
- A full reset clears audit history, so a full-reset audit event cannot persist.

## Security and Privacy Reminders

Atlas is mock-only, localStorage-only, and approval-first in this pilot. It does not send messages, place orders, submit payments, contact vendors, cancel services, or trigger external actions.

## How To Reset Pilot Data

1. Open `/settings`.
2. Scroll to Reset Pilot Data.
3. Choose one reset option.
4. Confirm the reset.
5. Refresh or revisit pages to reload mock defaults.

Reset controls only remove known Atlas pilot localStorage keys. They do not clear unrelated browser storage.
