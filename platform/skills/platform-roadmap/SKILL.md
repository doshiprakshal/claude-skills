---
name: platform-roadmap
description: Sequence and prioritize a platform team's roadmap from a set of identified gaps/opportunities (maturity gaps, scaling bottlenecks, developer-experience friction, cost/security findings), balancing impact, effort, and dependency ordering, distinct from any single assessment that identifies the gaps in the first place. Triggers on "help us prioritize our platform roadmap", "sequence these platform initiatives", "what should our platform team work on next", "build a platform roadmap from these findings".
user-invocable: true
---

# Platform Roadmap

Sequence and prioritize a platform team's roadmap from a set of already-identified gaps and opportunities, balancing impact, effort, and dependency ordering.

## When to use

- Turning a set of platform findings/gaps (from maturity assessment, DX audit, cost/security review, etc.) into a sequenced roadmap.

**Out of scope**:
- Identifying the gaps themselves → `platform-maturity-assessment`, `developer-experience-audit`, `platform-cost-review`, `platform-security`, `platform-scaling`
- General reliability roadmap sequencing (SRE-specific reliability investment, as opposed to platform capability investment) → `sre/reliability-roadmap`

## Inputs

- A set of identified gaps/opportunities, ideally with impact and effort context from the source assessments.
- The platform team's current capacity.
- Any hard constraints/deadlines (e.g., a compliance deadline forcing a specific item earlier).

## Workflow

### 1. Normalize inputs

Gather findings across whatever assessments have been run (maturity, DX, cost, security, scaling) into a single candidate list, since roadmap prioritization needs to weigh across categories, not just within one assessment's own findings.

### 2. Score impact and effort

For each candidate, estimate impact (how many teams/how much friction/cost/risk it addresses) and effort (rough sizing) — favor items with disproportionately high impact relative to effort as near-term candidates, deferring high-effort/lower-impact items regardless of how interesting they are.

### 3. Resolve dependencies

Identify ordering constraints (e.g., a self-service automation depends on a catalog data-model fix landing first) and sequence accordingly — a naturally high-priority item blocked on a lower-scored prerequisite needs the prerequisite pulled forward.

### 4. Account for hard constraints

Any item with a fixed external deadline (compliance, a committed executive promise) gets sequenced to meet that deadline regardless of its relative impact/effort score, but should be flagged as constraint-driven rather than pure prioritization, so the tradeoff is visible.

### 5. Report

A sequenced roadmap (near-term / mid-term / later) with each item's impact/effort rationale, dependency notes, and any constraint-driven placement flagged explicitly.

## Notes

- Always distinguish constraint-driven sequencing (a compliance deadline) from priority-driven sequencing (impact/effort scoring) explicitly in the output — conflating them obscures the actual tradeoffs being made and makes the roadmap harder to defend or revisit later.
- Resist sequencing purely by how recently or loudly a gap was raised — a rigorous impact/effort comparison across all identified gaps, not just the most recent assessment's findings, produces a more defensible roadmap.
