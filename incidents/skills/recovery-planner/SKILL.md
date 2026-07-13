---
name: recovery-planner
description: Plan the safe recovery path out of an active incident — sequencing rollback/failover/scale-up steps, verifying each step before proceeding, and avoiding actions that could compound the outage. Triggers on "help me plan the recovery from this incident", "what's the safest way to roll this back", "sequence the recovery steps for this outage", "plan how to bring this back up safely".
user-invocable: true
---

# Recovery Planner

Plan a safe, sequenced recovery path out of an active incident, verifying each step before proceeding rather than taking simultaneous uncoordinated actions.

## When to use

- An active incident needs a deliberate recovery plan, especially when multiple systems/steps are involved or a wrong sequencing could compound the outage.

**Out of scope**:
- Root-causing the incident itself → `incident-investigator`
- Assembling the incident-specific dashboard to monitor recovery → `observability/incident-dashboard`
- Post-incident escalation to bring in more people → `escalation-assistant`

## Inputs

- Current incident state and suspected/confirmed root cause.
- Available recovery actions (rollback, failover, scale-up, feature flag disable, cache flush, etc.) and their individual risk/reversibility.
- Blast radius of the affected component (from `blast-radius-analysis` if available), to know what else recovery actions might touch.

## Workflow

### 1. Enumerate recovery options

List candidate recovery actions with their expected effect, risk, and reversibility (a feature-flag disable is low-risk/instantly reversible; a database schema rollback is high-risk/hard-to-reverse).

### 2. Sequence by risk and reversibility

Prefer the lowest-risk, most-reversible action that plausibly resolves the incident first; escalate to riskier actions only if lower-risk ones don't resolve it — avoid reaching for a high-risk action (e.g., a forced failover) before ruling out a simpler fix, unless time-criticality clearly justifies skipping ahead.

### 3. Define a verification checkpoint per step

For each step, define what "this worked" looks like (a specific metric returning to baseline) before proceeding to the next step — taking multiple simultaneous recovery actions makes it impossible to know which one worked, and can compound risk if one of them was actually wrong.

### 4. Identify a rollback-of-the-rollback

For any recovery step that is itself risky, state what to do if that step doesn't help or makes things worse — a recovery plan without its own abort path can leave responders stuck mid-action during a worsening incident.

### 5. Report

An ordered recovery plan: step, expected effect, verification checkpoint, and fallback if the step doesn't work — plus the single next action to take right now.

## Notes

- Simultaneous, uncoordinated recovery actions from multiple responders are a common way incidents get worse, not better — a recovery plan's sequencing and single-owner-per-step discipline is often as valuable as the actions themselves.
- Time-criticality can justify skipping the "try low-risk first" ordering (e.g., a full regional failover during a severe, clearly-diagnosed outage) — state explicitly when this tradeoff is being made and why, rather than defaulting to escalation.
