# Atlas Connector Security Model

Atlas has no real connectors today. Future connectors are blocked until the
Bank-Grade Security Gate is scoped, implemented, tested, and approved.

## Bank-Grade Connector Rules

- Connectors must be read-only first.
- Connector permissions must be least privilege.
- Connector access must be revocable by the user.
- Connector tokens must live in a server-side token vault.
- Connector tokens must never be stored in browser localStorage, sessionStorage,
  client JavaScript, or public environment variables.
- Connector activity must be audit logged server-side.
- Connector scopes must be visible and understandable to the user.
- Connector data must be minimized to what Atlas needs for the approved use.
- Connector actions must never happen silently.
- No connector may send, order, pay, cancel, message, modify, or contact a
  vendor without explicit user approval and an audit event.

## Read-Only-First Policy

The first production connector phase must be read-only. Atlas may summarize
or recommend based on approved connector data, but it must not mutate external
systems. Any write-capable scope requires a separate security review, product
approval, and explicit user approval flow.

## Token Vault Requirement

All connector credentials must be stored server-side in a secure token vault
with encryption, rotation planning, access logging, and revocation. Browser
storage is prohibited for connector tokens.

## Approval And Audit Requirements

Every connector recommendation must be clear about data used, assumptions,
risk, and result. Every user decision must be auditable. Any future connector
action requires approval-first UX and a server-side audit log before execution.

