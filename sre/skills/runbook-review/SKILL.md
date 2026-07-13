---
name: runbook-review
description: Review the quality and currency of existing runbooks across a service portfolio — findability, correctness, currency, and whether they've actually been validated against a real incident, distinct from generating a new runbook from scratch. Triggers on "review our runbook quality and coverage", "are our runbooks actually up to date", "audit our runbooks across the service portfolio", "have our runbooks ever actually been tested".
user-invocable: true
---

# Runbook Review

Review the quality, currency, and validation status of existing runbooks across a service portfolio.

## When to use

- Auditing existing runbooks for quality/coverage across services, as opposed to generating a new one.

**Out of scope**:
- Generating a new runbook from scratch for a specific failure mode → `linux/runbook-generator`, `kubernetes/runbook-generator`, `incidents/runbook-recommendation`
- A single incident's specific resolution documentation → `incidents/postmortem-generator`

## Inputs

- The runbook inventory across services in scope.
- Runbook usage/update history if available.
- Recent incidents and whether an existing runbook was used/applicable.

## Workflow

### 1. Assess coverage

Determine which critical failure modes have a documented runbook versus none — prioritize by how frequently/severely each failure mode has occurred historically, similar to the prioritization approach in `incidents/runbook-recommendation`.

### 2. Assess findability

Check whether runbooks are discoverable during an actual incident (linked from alerts, in a searchable central location) rather than requiring insider knowledge of where to look — an excellent runbook that can't be found during an incident provides no real value under pressure.

### 3. Assess currency

Check whether runbooks reflect the current system state — a runbook referencing a deprecated tool, an old architecture, or since-changed access patterns actively misleads an on-call responder rather than helping them, similar to the staleness risk in `platform/golden-path-review`.

### 4. Assess validation status

The most important check: has the runbook actually been executed/tested recently (during a drill or a real incident), or is it unvalidated, written once and never confirmed to still work — an unvalidated runbook should be treated with lower confidence regardless of how well-written it appears.

### 5. Report

A coverage map, findability assessment, currency findings, and validation status per runbook, prioritized by the failure mode's frequency/severity.

## Notes

- Validation status is the most commonly overlooked and most consequential dimension — a runbook that reads correctly but has never actually been executed against a real system carries meaningful risk of containing an error that would only surface during a real, high-pressure incident; always ask explicitly when a runbook was last actually used or drilled.
- Findability during an actual incident (not just existence) determines real-world value — always check the discovery path (alert-linked, searchable, or requiring insider knowledge) alongside content quality.
