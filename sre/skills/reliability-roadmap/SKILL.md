---
name: reliability-roadmap
description: Sequence and prioritize an SRE team's reliability investment roadmap from a set of identified gaps — incident trends, toil, capacity constraints, availability findings — balancing impact, effort, and dependency ordering, distinct from platform-team roadmap sequencing. Triggers on "help us prioritize our reliability roadmap", "sequence these reliability initiatives", "what should our sre team work on next", "build a reliability roadmap from these findings".
user-invocable: true
---

# Reliability Roadmap

Sequence and prioritize an SRE team's reliability investment roadmap from already-identified gaps, balancing impact, effort, and dependency ordering.

## When to use

- Turning a set of reliability findings (incident trends, toil, capacity gaps, availability issues) into a sequenced roadmap.

**Out of scope**:
- Identifying the gaps themselves → `incident-trend-review`, `toil-detection`, `capacity-planning`, `availability-review`, `reliability-assessment`
- Platform-team (broader tooling/DX) roadmap sequencing → `platform/platform-roadmap`

## Inputs

- A set of identified reliability gaps/opportunities, ideally with impact/effort context from source assessments.
- SRE team's current capacity (cross-reference `capacity-planning`).
- Any hard constraints (an upcoming SLA renewal, a compliance deadline).

## Workflow

### 1. Normalize inputs

Gather findings across whatever reliability assessments have been run (incident trends, toil, capacity, availability, service-specific assessments) into a single candidate list.

### 2. Score impact and effort

Estimate impact (incident reduction potential, toil eliminated, capacity freed) and effort per candidate — favor high-impact/low-effort items as near-term priorities.

### 3. Resolve dependencies

Identify ordering constraints (e.g., toil automation needs to land before a planned service portfolio expansion for the team to absorb the added load, per `capacity-planning`) and sequence accordingly.

### 4. Account for hard constraints

Any item tied to a fixed deadline (an SLA renewal requiring demonstrated reliability improvement, a compliance requirement) is sequenced to meet that deadline, flagged explicitly as constraint-driven.

### 5. Report

A sequenced roadmap (near-term/mid-term/later) with each item's impact/effort rationale, dependency notes, and constraint-driven items flagged explicitly.

## Notes

- This mirrors `platform/platform-roadmap`'s structure but applied specifically to reliability-domain findings (incidents, toil, capacity, availability) rather than platform tooling/DX gaps — use this skill when the candidate list is reliability-focused.
- Always distinguish constraint-driven sequencing from pure impact/effort prioritization explicitly, so the roadmap's tradeoffs remain visible and defensible when revisited later.
