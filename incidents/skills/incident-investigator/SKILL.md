---
name: incident-investigator
description: Investigate an active or recent incident end-to-end — gather evidence across logs/metrics/traces/deploys, build a root-cause hypothesis, and identify the most likely trigger. Triggers on "investigate this incident", "help me figure out what's causing this outage", "what changed right before this incident started", "investigate why this is failing right now".
user-invocable: true
---

# Incident Investigator

Investigate an active or recent incident, gathering evidence across available signals to identify the most likely root cause and trigger.

## When to use

- An incident is active or recently occurred and needs root-causing.
- The user asks what's causing an outage or what changed right before it started.

**Out of scope**:
- Writing the formal timeline document → `timeline-generator`
- Writing the postmortem document → `postmortem-generator`
- Domain-specific deep investigation once the affected component is known → the relevant domain skill (e.g., `kubernetes/crashloopbackoff`, `linux/performance-investigation`, `networking/dns-investigation`)

## Inputs

- Incident start time and initial symptom/alert.
- Access to logs, metrics, traces for the suspected components (or an `incident-dashboard` if one exists).
- Recent deploys/changes across the suspected components.

## Workflow

### 1. Gather evidence

Collect the initial symptom, affected components, and the timeline of alerts. Pull recent deploys/config changes across suspected components — a change correlating tightly with incident onset is the highest-value initial lead.

### 2. Root cause catalog

Rank candidate causes by likelihood given the evidence:
- **Recent deploy/config change** — most common cause; check deploy timestamps against incident onset time precisely.
- **Dependency failure** — a downstream service, database, or third-party API degraded or failed, propagating upward.
- **Resource exhaustion** — CPU/memory/disk/connection-pool saturation on the affected component or a shared resource.
- **Traffic pattern change** — a spike, a new client behavior, or a retry storm overwhelming capacity.
- **Infrastructure/platform event** — node failure, AZ/region issue, underlying cloud provider incident.

### 3. Confirm and rule out

For the leading hypothesis, find direct confirming evidence (not just correlation — e.g., the specific error in logs matching the specific change). Explicitly state what would be true if a competing hypothesis were correct, and check whether that's the case, to rule out alternatives rather than stopping at the first plausible story.

### 4. Recommend mitigation

Propose the fastest safe mitigation (rollback, scale-up, failover, feature flag) separate from the long-term fix, since restoring service usually shouldn't wait for full root-cause certainty.

### 5. Report

Summary of symptom, timeline of key evidence, root cause (with confidence level), ruled-out alternatives, and recommended immediate mitigation vs. long-term fix.

## Notes

- During an active incident, prioritize speed to a plausible mitigation over certainty on root cause — recommend mitigating first if the investigation is taking too long, and continue root-causing in parallel or afterward.
- A deploy correlating with incident onset is a strong lead but not proof — verify with a specific mechanism (what did the deploy change, and does that change explain the specific symptom) before recommending a rollback based on timing alone.
