---
name: slo-review
description: Review SLO adoption and culture across an organization's service portfolio — whether critical services actually have SLOs defined, whether SLOs consistently inform real decisions, and where adoption gaps exist, distinct from a single service's SLI/target/measurement technical correctness. Triggers on "review our slo adoption across the org", "do all our critical services actually have slos", "is our slo culture actually driving decisions", "audit slo coverage across our service portfolio".
user-invocable: true
---

# SLO Review

Review SLO adoption and culture across an organization's service portfolio — coverage, consistency, and whether SLOs actually inform decisions, as an org-wide governance concern.

## When to use

- Assessing SLO adoption/coverage across many services or the whole organization.
- The user asks whether SLO culture is actually working, not whether one specific SLI definition is correct.

**Out of scope**:
- Single-service SLI/target/measurement technical correctness → `observability/slo-review`
- Burn-rate math and per-service error budget policy depth → `error-budget-review` (this skill's org-wide counterpart), `observability/error-budget-review` (single-service depth)

## Inputs

- Inventory of services and whether each has a defined SLO.
- How SLOs are actually used in practice (do they inform prioritization, appear in postmortems, gate launches).

## Workflow

### 1. Assess coverage

Determine what fraction of critical services actually have a defined SLO — prioritize by criticality, since gaps on lower-tier services matter less than gaps on customer-facing or revenue-critical ones.

### 2. Assess consistency

Check whether SLO definition quality/rigor is consistent across teams, or whether some teams have well-considered SLOs (validated per `observability/slo-review`'s technical checks) while others have superficial or copy-pasted ones with no real analysis behind them.

### 3. Assess whether SLOs actually drive decisions

The core question: do SLOs and error budgets actually influence real decisions (prioritization, launch gating, incident response urgency) or do they exist as a reporting artifact nobody references — this is the difference between genuine SLO culture and SLO theater.

### 4. Identify adoption barriers

For services without SLOs, or teams where SLOs aren't influencing decisions, identify the actual barrier (unclear ownership, lack of tooling, lack of leadership reinforcement) rather than assuming it's simply an unprioritized task.

### 5. Report

A coverage map by service criticality, a consistency assessment, evidence (or lack thereof) that SLOs drive real decisions, and identified adoption barriers with recommendations.

## Notes

- The most important and most often unasked question is whether SLOs actually change behavior — an org can have impressive SLO coverage numbers while nothing about prioritization or incident response actually references them; always probe for real usage evidence, not just existence.
- When recommending expanded SLO adoption, prioritize by service criticality — pushing for 100% coverage before critical services have solid, decision-driving SLOs is a lower-value use of effort than deepening adoption where it matters most first.
