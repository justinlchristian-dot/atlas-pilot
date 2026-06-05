# Atlas Deployment Guide

Atlas can be deployed as a standard Next.js app. The current pilot does not require environment variables because it uses mock data and browser localStorage only.

## Create a GitHub Repository

1. Go to GitHub and create a new repository.
2. Recommended name: `atlas-pilot`.
3. Keep it private unless you intentionally want the source public.
4. Do not initialize with a README if this local project already has one.

## Fix Git Dubious Ownership

If Git reports dubious ownership for this workspace, run:

```bash
git config --global --add safe.directory C:/Users/Justin/OneDrive/Documents/Atlas
```

## Push Atlas to GitHub

From the project folder:

```bash
cd C:/Users/Justin/OneDrive/Documents/Atlas
git init
git status
git add .
git commit -m "Prepare Atlas Pilot v1.1 for deployment"
git branch -M main
git remote add origin https://github.com/<your-username>/atlas-pilot.git
git push -u origin main
```

If the repo already exists locally and only needs a remote:

```bash
git remote add origin https://github.com/<your-username>/atlas-pilot.git
git push -u origin main
```

## Deploy to Vercel

1. Sign in to Vercel.
2. Choose Add New Project.
3. Import the GitHub `atlas-pilot` repository.
4. Confirm the framework preset is Next.js.
5. Deploy.

## Recommended Vercel Settings

- Framework preset: Next.js
- Build command: `npm run build`
- Install command: `npm install`
- Output directory: leave default for Next.js
- Node.js version: 20.x or newer

## Environment Variables

No environment variables are needed for the current pilot.

Do not add API keys, secrets, integration tokens, database URLs, or AI provider keys until Atlas has the required production security model.

## Future Codex Changes

For future Codex work:

1. Make the local changes.
2. Run:

```bash
npm run validate
```

3. Review changed files:

```bash
git status
```

4. Commit and push:

```bash
git add .
git commit -m "Describe the Atlas change"
git push
```

5. Vercel will redeploy automatically from the pushed branch if the project is connected to GitHub.

## Deployment Guardrails

The pilot must remain mock-only, localStorage-only, and approval-first. Do not deploy real integrations, AI calls, payments, orders, messages, cancellations, vendor contacts, authentication, or database behavior until the security/privacy foundation is ready.
