# Atlas Security Risk Register

Atlas is currently safe only for synthetic or non-sensitive pilot data. The
risks below block real user data, real connectors, backend user storage, AI
tool execution, and external actions until the Bank-Grade Security Gate is
implemented.

| Risk | Current Status | Requirement Before Real Data |
| --- | --- | --- |
| Weak authentication | No auth exists. | Add MFA-capable authentication aligned with NIST digital identity guidance. |
| Missing MFA | No MFA exists. | Support MFA for sensitive accounts and elevated actions. |
| Insecure account recovery | No recovery flow exists. | Define recovery that resists takeover and social engineering. |
| Insecure sessions | No production sessions exist. | Add secure cookies, expiry, rotation, inactivity timeout, and session revocation. |
| Token leakage | No connector tokens exist. | Store tokens only in a server-side vault, never in browser storage. |
| localStorage sensitive data | Pilot stores mock state locally. | Do not store sensitive real data in localStorage. |
| Missing encryption | No backend exists. | Encrypt data in transit and at rest with managed keys. |
| Missing row-level access control | No user database exists. | Enforce user-level authorization and row-level access controls. |
| Missing deletion/export | No backend data lifecycle exists. | Provide user export, delete, and retention controls. |
| Excessive connector permissions | No connectors exist. | Use least-privilege scopes and read-only-first access. |
| Silent external actions | External actions are prohibited. | Require explicit approval and audit logging before any external action. |
| Prompt injection for future AI | No AI features exist. | Add prompt-injection, tool-permission, and data-boundary defenses before AI. |
| Audit log tampering | Audit is local mock storage. | Move audit logs server-side with tamper-resistant controls. |
| Incident response gaps | No response plan exists. | Define monitoring, alerting, escalation, user notice, and post-incident review. |

## Required Review Cadence

- Review this register before any task involving auth, storage, connectors, AI,
  or external actions.
- Mark the task blocked if the Bank-Grade Security Gate is not satisfied.
- Document unresolved risks before release.

