---
name: root-cause-categorization
description: Categorize an incident's root cause against a consistent taxonomy (deploy/config, dependency failure, capacity, infrastructure, human process, external) to enable aggregate reporting and comparison across incidents. Triggers on "categorize this incident's root cause", "what taxonomy category does this incident fall under", "tag this postmortem with a root cause category", "classify this incident for our reporting taxonomy".
user-invocable: true
---

# Root Cause Categorization

Categorize an incident's root cause against a consistent taxonomy, enabling aggregate reporting and comparison across incidents.

## When to use

- A single incident's root cause needs to be tagged/classified against a standard taxonomy.

**Out of scope**:
- Performing the root cause analysis itself → `rca-generator`
- Aggregate trend analysis across many categorized incidents → `incident-trend-analysis`

## Inputs

- The incident's confirmed root cause (from `rca-generator` or equivalent).
- The organization's taxonomy, if one exists; otherwise a standard default taxonomy is used.

## Workflow

### 1. Apply the taxonomy

Default categories if none is specified: Deploy/Config Change, Dependency Failure, Capacity/Resource Exhaustion, Infrastructure/Platform Event, Human Process Gap (e.g., missing test coverage, missing runbook), External/Third-Party, Security Incident. Use the organization's own taxonomy if one is defined, rather than forcing this default onto an existing system.

### 2. Categorize primary and contributing causes separately

The trigger/root cause gets a primary category; contributing factors may span additional categories (e.g., primary: Deploy/Config Change; contributing: Human Process Gap for delayed detection) — tag both rather than forcing a single category onto a multi-factor incident.

### 3. Handle ambiguous cases explicitly

Some incidents genuinely span categories (e.g., a deploy that wouldn't have caused impact without a pre-existing capacity issue) — state the primary driver and note the secondary category explicitly rather than forcing an artificial single choice.

### 4. Report

Primary category, contributing categories if applicable, and brief justification for the categorization choice.

## Notes

- Consistency matters more than precision for any single incident — the value of this skill comes from enabling aggregate analysis (`incident-trend-analysis`) across many consistently-tagged incidents, so apply the same taxonomy definitions every time rather than reinterpreting categories per-incident.
- When an incident is genuinely ambiguous between two categories, document the reasoning rather than silently picking one — this preserves the ability to re-categorize later if the taxonomy or understanding evolves.
