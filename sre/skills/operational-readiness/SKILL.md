---
name: operational-readiness
description: Assess whether a service is actually ready to operate reliably in production — a pre-launch or ongoing checklist-style review covering monitoring, alerting, runbooks, on-call ownership, and rollback capability together, distinct from any single dimension's deep-dive. Triggers on "is this service ready for production launch", "run an operational readiness review for this service", "do we have everything needed to operate this service reliably", "pre-launch reliability checklist for this service".
user-invocable: true
---

# Operational Readiness

Assess whether a service is actually ready to operate reliably in production, synthesizing across monitoring, alerting, runbooks, on-call ownership, and rollback capability.

## When to use

- A pre-launch or periodic operational readiness review is needed for a specific service.

**Out of scope**:
- Deep-dive on any single dimension → `observability/monitoring-audit`, `runbook-review`, `databases/ha-review`
- Portfolio-wide maturity scoring across many services → `service-maturity-assessment`

## Inputs

- The service's current monitoring/alerting setup, runbook coverage, on-call assignment, and deployment/rollback mechanism.
- Launch context (new service pre-launch, or an ongoing readiness check for an existing service).

## Workflow

### 1. Check monitoring and alerting exist and are adequate

Confirm basic golden-signal monitoring exists and alerts would actually fire for the failure modes most likely to occur — at a checklist level, not the full depth of `observability/monitoring-audit`.

### 2. Check runbook coverage for known failure modes

Confirm runbooks exist for the most likely failure modes, at minimum, before launch — cross-reference `runbook-review` for depth if gaps are found.

### 3. Check on-call ownership is defined and unambiguous

Confirm a specific team/rotation is assigned as the owner for this service's incidents — an unowned or ambiguously-owned service is a readiness blocker regardless of how good its technical setup is.

### 4. Check rollback/mitigation capability

Confirm a safe, fast rollback or mitigation path exists and has been at least conceptually validated — launching without a known way to quickly back out of a bad deployment is a significant risk.

### 5. Check dependency readiness

Confirm the service's critical dependencies are themselves operationally sound (not launching a new service on top of a known-fragile dependency without accounting for that risk).

### 6. Report

A checklist-style readiness verdict across Monitoring/Alerting, Runbook Coverage, On-Call Ownership, Rollback Capability, Dependency Readiness — go/no-go for launch context, or a gap list for an ongoing check.

## Notes

- On-call ownership ambiguity is a surprisingly common and severe readiness gap — a technically well-monitored service with no clear owning team means alerts may fire into a void during an actual incident; always check this explicitly and treat it as a blocker if unresolved.
- For pre-launch reviews specifically, be willing to give an explicit no-go verdict when readiness is genuinely insufficient — the value of this skill depends on being honest about gaps rather than defaulting to a lenient "mostly ready" characterization under launch-date pressure.
