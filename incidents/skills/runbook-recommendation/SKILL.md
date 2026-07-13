---
name: runbook-recommendation
description: Recommend or draft a runbook for a specific failure mode based on incident history — turning "we've now handled this 3 times manually" into a documented, repeatable procedure. Triggers on "we should have a runbook for this", "draft a runbook based on how we resolved this incident", "recommend runbooks based on our incident history", "turn this incident resolution into a documented procedure".
user-invocable: true
---

# Runbook Recommendation

Recommend or draft a runbook for a specific failure mode, based on how it was actually resolved during real incidents.

## When to use

- A failure mode has been manually resolved (once or repeatedly) and would benefit from a documented, repeatable procedure.
- Reviewing incident history to identify which failure modes most need a runbook.

**Out of scope**:
- Detecting that a repeat incident occurred in the first place → `repeat-incident-detection`
- General reliability runbook generation from operational context rather than incident history → domain-specific `runbook-generator` skills (e.g., `linux/runbook-generator`)

## Inputs

- The incident(s) where this failure mode was manually resolved, including the actual steps taken.
- Whether this is a one-off (proactive runbook suggestion) or a recurring pattern (from `repeat-incident-detection`/`incident-trend-analysis`).

## Workflow

### 1. Extract the actual resolution steps

Reconstruct precisely what was done to diagnose and resolve the incident, from the incident record/timeline — not an idealized version, but what actually worked, including any dead ends that should be noted as "don't bother" shortcuts for next time.

### 2. Generalize carefully

Distinguish steps that generalize to the failure mode versus incident-specific detail that shouldn't be baked into a reusable runbook — a runbook that's too narrowly tied to one incident's specifics won't apply cleanly next time.

### 3. Structure as an executable procedure

Format as: symptom/trigger recognition (how to know this runbook applies), diagnostic steps in order, resolution steps in order, verification step, and rollback/escalation path if the runbook's steps don't resolve it.

### 4. Prioritize by recurrence/impact

If recommending which failure modes most need a runbook (rather than drafting one already-identified), prioritize by how often the failure mode recurs and how severe/time-consuming manual resolution has been.

### 5. Report

The drafted runbook (or, for a recommendation, the prioritized list of failure modes lacking one).

## Notes

- A runbook drafted from a single incident should be flagged as unvalidated until it's been used/verified against at least one more occurrence — the first draft may bake in incident-specific quirks that don't generalize.
- Always include a "how do you know this runbook applies" recognition step — a runbook that's technically correct but doesn't help someone identify when to use it under pressure has limited real value during an actual incident.
