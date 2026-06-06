# Atlas Cybersecurity Audit

Atlas is currently a mock-only, localStorage-only pilot. It has no auth,
database, backend, connectors, AI calls, secrets, payments, orders, messages,
cancellations, vendor contact, or external actions. It is safe only for
synthetic or non-sensitive pilot data.

## Bank-Grade Security Requirement

Bank-Grade Security is the minimum requirement before Atlas may handle real
user data, real connectors, backend user storage, AI tool execution, or
external actions. For Atlas, "bank-grade" means layered controls comparable to
what a careful online banking product would require for sensitive account and
life-admin data.

Atlas must align future production planning with:

- FFIEC-style layered authentication and access risk management.
- NIST digital identity and authentication guidance.
- OWASP ASVS web application security verification.
- OWASP GenAI and LLM risk controls before any AI feature or tool execution.
- NIST SSDF secure software development practices.
- FTC-style data minimization and personal information protection principles.

Until this gate is explicitly scoped, implemented, tested, and approved, Atlas
must remain mock-only and must not collect sensitive real user data.

## Bank-Grade Security Gate

Before Atlas can handle real sensitive data or real connectors, it must have:

- MFA-capable authentication.
- Secure session management.
- Device and session revocation.
- Secure account recovery plan.
- Encrypted backend database.
- Row-level or user-level access controls.
- No sensitive data in localStorage.
- Server-side audit logs.
- Data export and delete flows.
- Data retention policy.
- Secrets manager.
- Server-side connector token vault.
- Least-privilege connector scopes.
- Revocable connector permissions.
- Rate limiting.
- Dependency scanning.
- Secret scanning.
- Security monitoring.
- Incident response plan.
- Prompt-injection defenses before AI.
- External security review before production.

## Current Pilot Finding

Atlas v1.6 does not satisfy the Bank-Grade Security Gate. That is acceptable
only because the current pilot is mock-only, localStorage-only, and limited to
synthetic or non-sensitive data.

## Production Blockers

- No authentication or MFA exists.
- No secure sessions or device revocation exist.
- No backend database or server-side authorization exists.
- No token vault or connector security layer exists.
- localStorage is not secure storage for sensitive data.
- Audit logs are local mock records and can be modified by the browser user.
- No incident response, monitoring, retention, export, or delete system exists.
- No prompt-injection defense exists because AI features are not implemented.

