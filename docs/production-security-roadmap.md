# Atlas Production Security Roadmap

Atlas must advance through security levels deliberately. A higher level cannot
start until the required controls for that level are scoped, implemented,
validated, and approved.

## Security Levels

### Level 0: Mock Demo

- Mock data only.
- localStorage-only state.
- No auth, database, connectors, AI calls, secrets, or external actions.
- Safe only for synthetic or non-sensitive data.

### Level 1: Local Pilot

- Local pilot state for testing UX and workflows.
- Manual QA, validation, dependency audit, and guardrail tests required.
- No real user data beyond non-sensitive tester notes.

### Level 2: Authenticated Private Alpha

- MFA-capable authentication.
- Secure sessions.
- Account recovery plan.
- Device/session revocation.
- User-level access controls.
- No connectors or external actions yet.

### Level 3: Read-Only Connector Alpha

- Server-side connector token vault.
- Least-privilege read-only scopes.
- Revocable connector permissions.
- Server-side audit logs.
- No connector tokens in browser storage.

### Level 4: AI Recommendation Alpha

- Prompt-injection defenses.
- Tool-permission boundaries.
- Data minimization and retrieval limits.
- Human-readable assumptions and confidence.
- No AI tool execution that mutates external systems.

### Level 5: Approval-Based Action Beta

- Explicit approval before any external action.
- Strong audit trail before and after action execution.
- Rate limits and abuse controls.
- High-risk action review paths.
- Rollback or correction process where possible.

### Level 6: External-Security-Reviewed Production

- External security review completed.
- OWASP ASVS-aligned verification completed.
- Incident response process live.
- Security monitoring live.
- Dependency and secret scanning live.
- Data export, delete, retention, and user notice processes live.

## Bank-Grade Security Gate

Atlas is blocked from real sensitive data, real connectors, backend user data
storage, AI tool execution, and external actions until the Bank-Grade Security
Gate in `docs/cybersecurity-audit.md` is satisfied.

