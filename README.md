# Atlas Pilot

Atlas is a private, approval-based AI life assistant pilot. It helps organize everyday life admin across a daily brief, onboarding, Persona QA Mode, Life Map, household routines, shopping prep, approvals, audit history, and settings.

## Current Pilot Status

- Version: Pilot v1.5
- Framework: Next.js, TypeScript, Tailwind CSS
- Data mode: mock-only and localStorage-only
- External actions: none
- Approval model: approval-first

Atlas does not add authentication, connect accounts, call AI services, send messages, place orders, process payments, contact vendors, cancel services, or run real integrations in this pilot.

## Required Node Version

Use Node.js 20.9.0 or newer. Next.js 16 requires Node 20.9.0+.

Check your version:

```bash
node --version
```

## Install

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

Default local URL:

- `http://localhost:3000`
- `http://127.0.0.1:3000`

If port 3000 is busy:

```bash
npm run dev -- --port 3001
```

Then open:

- `http://localhost:3001`
- `http://127.0.0.1:3001`

## Validate

Run the full local validation suite:

```bash
npm run validate
```

This runs TypeScript checks, Vitest tests, and a production build.

Individual commands:

```bash
npm run test:run
npm run test:e2e
npm run typecheck
npm run build
```

Browser smoke tests are separate from `npm run validate` so deployment validation
stays fast and stable. Run `npm run test:e2e` before test group releases.

## Codex Operating Rules

Future Codex work should follow the permanent testing, audit, persona QA, and
reporting rules in `docs/codex-operating-rules.md`.

## Troubleshooting

If `npm run dev` says port 3000 is busy, use another port:

```bash
npm run dev -- --port 3001
```

On Windows, you can identify a process using port 3000:

```powershell
netstat -ano | Select-String ':3000'
```

Then stop it if you know it is safe:

```powershell
Stop-Process -Id <PID> -Force
```

If Git reports dubious ownership for this folder, run:

```bash
git config --global --add safe.directory C:/Users/Justin/OneDrive/Documents/Atlas
```

## Pilot Privacy Reminder

Atlas currently stores setup and workflow state in browser localStorage for pilot/demo use only. Do not enter real sensitive data yet. Production use still needs authentication, secure storage, encryption, retention controls, export/delete flows, and integration security review.
