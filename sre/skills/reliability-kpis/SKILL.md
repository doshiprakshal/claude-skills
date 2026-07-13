---
name: reliability-kpis
description: Define or review the set of reliability KPIs an organization tracks — whether the chosen metrics actually measure what matters, avoid perverse incentives, and roll up sensibly from service-level to org-level reporting. Triggers on "help us define reliability kpis for the org", "review whether our reliability metrics actually measure what matters", "do our reliability kpis create any perverse incentives", "how should we roll up service-level reliability metrics to org level".
user-invocable: true
---

# Reliability KPIs

Define or review the set of reliability KPIs an organization tracks, checking that they measure what matters, avoid perverse incentives, and roll up sensibly.

## When to use

- Defining a new set of org-level reliability KPIs, or reviewing whether existing ones are actually good metrics.

**Out of scope**:
- A single service's SLI/SLO technical correctness → `observability/slo-review`
- Computing the KPI values themselves from raw data → `availability-review`, `incidents/incident-metrics-review`

## Inputs

- Current or proposed reliability KPIs and how they're used (reported to leadership, tied to team performance, etc.).
- How individual service-level metrics roll up into any org-level aggregate.

## Workflow

### 1. Assess whether each KPI measures what actually matters

Check that each KPI is a genuine proxy for the outcome the org cares about (user-experienced reliability, business impact) rather than a metric that's easy to measure but only loosely connected to real impact — e.g., raw incident count is a weaker KPI than severity-weighted downtime, since it doesn't distinguish a 2-minute blip from a 2-hour outage.

### 2. Check for perverse incentives

For any KPI tied to team evaluation or incentives, reason through how it could be gamed or how it might discourage the right behavior — e.g., a raw incident-count KPI can discourage honest incident reporting/postmortem culture (teams under-report to keep the number low), which is a worse outcome than the metric was meant to prevent.

### 3. Assess rollup methodology

Check how service-level metrics combine into an org-level aggregate — a simple average across services of very different criticality/scale can obscure a severe problem in one critical service by diluting it among many healthy, less-critical ones; consider severity/criticality-weighted rollups instead.

### 4. Assess actionability

Check whether each KPI, when it moves in a concerning direction, actually points toward a specific action — a KPI that can only ever prompt "let's investigate" without narrowing down where to look is less useful than one that's inherently diagnostic (e.g., cause-decomposed downtime versus a single aggregate number).

### 5. Report

Findings per KPI on Measures-What-Matters, Perverse Incentive Risk, Rollup Methodology, Actionability, with recommended KPI additions/changes where gaps are found.

## Notes

- Perverse incentive risk is the most consequential and most often overlooked check — a KPI that inadvertently discourages honest incident reporting or postmortem participation can quietly undermine the entire reliability culture it was meant to improve; always reason through gaming scenarios explicitly, not just measurement accuracy.
- A naive average-based rollup across services of different criticality is a common design flaw — always check whether the aggregation method could hide a severe problem in an important service among many less-important healthy ones.
