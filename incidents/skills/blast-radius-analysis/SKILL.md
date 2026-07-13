---
name: blast-radius-analysis
description: Map the architectural blast radius of an incident or a proposed change — which systems/services are directly affected and which are exposed transitively via dependencies, to scope both incident impact and pre-change risk. Triggers on "what's the blast radius of this incident", "what else could this change affect if it goes wrong", "map the blast radius for this deployment", "what services depend on this component that could be affected".
user-invocable: true
---

# Blast Radius Analysis

Map the architectural blast radius of an incident (what was actually or potentially affected) or a proposed change (what could be affected if it goes wrong), following dependency relationships.

## When to use

- Determining which systems were or could be affected by an incident or a proposed risky change.
- Pre-change risk scoping: "what could this affect if it goes wrong."

**Out of scope**:
- Quantifying user/business impact numbers → `impact-assessment`
- The investigation to find root cause → `incident-investigator`

## Inputs

- The affected/changed component.
- The dependency graph (what calls this component, what this component calls/depends on) — direct and, ideally, transitive.

## Workflow

### 1. Map direct dependents and dependencies

Identify what directly calls the affected component (direct blast radius) and what it directly depends on (in case the incident is actually upstream).

### 2. Trace transitive exposure

Follow the dependency graph outward — a service two hops away that depends on a direct dependent of the affected component is still potentially exposed, especially for shared-fate failure modes (e.g., connection pool exhaustion, retry storms) that propagate beyond the first hop.

### 3. Distinguish blast radius types

- **Hard dependency** — a dependent that fails/degrades if the affected component fails.
- **Soft/degraded dependency** — a dependent that degrades gracefully (cached data, fallback) rather than failing outright — lower severity, still worth noting.
- **Shared-fate risk** — components sharing infrastructure (same node pool, same database, same rate-limited upstream) with the affected component, which could be impacted through resource contention even without a direct call relationship.

### 4. Report

A blast-radius map: directly affected, transitively exposed (with hop count/path), and shared-fate risks, each annotated with dependency type (hard/soft) and confidence.

## Notes

- Shared-fate risk (same underlying infrastructure, not a call-graph relationship) is the most commonly missed category — always check for it explicitly, since it explains "seemingly unrelated" services being affected together.
- For pre-change risk scoping specifically, err toward over-inclusion in the initial map — it's cheaper to rule out a falsely-flagged dependent than to miss a real one before a risky change ships.
