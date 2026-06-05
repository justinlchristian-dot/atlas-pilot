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
- Would you trust this with real data if security/auth were added?

## Known Limitations

- No real accounts are connected.
- No backend, database, or authentication exists.
- localStorage is not secure storage for sensitive data.
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
