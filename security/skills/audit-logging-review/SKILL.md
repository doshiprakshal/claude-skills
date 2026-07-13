---
name: audit-logging-review
description: Review security audit logging completeness, retention, and tamper-resistance across an environment — whether security-relevant events are actually captured and preserved for investigation, distinct from platform-specific investigation tools or general observability logging coverage. Triggers on "review our audit logging coverage", "is our audit log retention sufficient", "can our audit logs be tampered with", "audit logging completeness review for compliance".
user-invocable: true
---

# Audit Logging Review

Review security audit logging completeness, retention, and tamper-resistance — whether the events needed to investigate a security incident are actually captured and preserved.

## When to use

- Reviewing whether audit logging is complete and retained appropriately for security/compliance purposes.

**Out of scope**:
- AWS-specific CloudTrail investigation of a specific event → `aws/cloudtrail-investigation`
- General application/operational logging coverage (not security-audit-specific) → `observability/logging-coverage`
- Kubernetes cluster audit policy configuration specifically → `kubernetes-security`

## Inputs

- Audit logging configuration across the systems in scope (what's logged, where it's stored, retention settings).
- Access control on the audit logs themselves.

## Workflow

### 1. Discover

Inventory what audit logging exists across systems in scope — authentication events, authorization decisions, administrative actions, data access where relevant.

### 2. Checks

- **Event coverage** — security-relevant event categories are actually captured: authentication (success and failure), authorization denials, privilege changes, administrative/configuration changes, and sensitive data access where applicable — a common gap is logging authentication but not authorization/administrative actions.
- **Retention sufficiency** — retention period matches investigative and compliance needs (many incidents aren't discovered until well after they occur — short retention can mean the relevant logs are already gone by the time an investigation starts).
- **Tamper-resistance** — logs are protected from modification/deletion by the same actors whose actions they record — e.g., an administrator with delete access to their own audit trail undermines the log's evidentiary value; recommend write-once storage or a separate, more restricted access path for log retention than for the systems generating them.
- **Centralization and searchability** — logs from disparate systems are aggregated somewhere searchable, not scattered across each system's local storage, which becomes impractical to investigate across during an actual incident.
- **Alerting on audit events** — critical audit events (e.g., privilege escalation, security-control disablement) generate alerts, not just passive log entries that would only be reviewed after the fact.

### 3. Report

Findings grouped by Event Coverage, Retention, Tamper-Resistance, Centralization, Alerting, each with severity.

## Notes

- Tamper-resistance is a frequently overlooked dimension — logging existing is not the same as logging being trustworthy; always check who can modify or delete the audit trail, not just whether it's being generated.
- Retention gaps often aren't discovered until they matter (an investigation reaching for logs that have already rotated out) — proactively check retention against a realistic "how long until we'd notice this kind of incident" estimate, not just a generic compliance minimum.
