# Incident Trend Review

Translates computed incident trend data into concrete SRE reliability investment priorities, weighed against current team capacity.

See `SKILL.md` for the full workflow.

## How to invoke

- "What do our incident trends tell us about where to invest?"
- "Review our incident trends for reliability roadmap input."
- "Translate our incident patterns into reliability priorities."

## Example

### Input

Trend data (from `incidents/incident-trend-analysis`): deploy-related incidents rose from 30% to 55% of total incident causes over two quarters. `checkout-service` accounts for a disproportionate share. Current SRE team capacity (per `capacity-planning`) is already projected to be strained by an upcoming service portfolio expansion.

### Output (abbreviated)

> **Translation**: the rising deploy-related incident share (30% → 55%) points directly toward a deploy-safety investment — specifically, better rollout gating/canary tooling — rather than a general reliability catch-all initiative. The `checkout-service` concentration suggests this investment should be piloted there first, both because it's the highest-value target and because a smaller pilot scope fits current capacity better than an org-wide rollout.
>
> **Capacity check**: `[Flag]` — team capacity is already projected to be strained by the upcoming portfolio expansion; a full org-wide deploy-safety tooling rollout right now would compete with that. Recommend scoping this as a `checkout-service`-only pilot in the near term, with broader rollout sequenced after the capacity picture improves (per `toil-detection`-driven automation work already in progress).
>
> **Roadmap-ready candidate**: "Pilot deploy-safety/canary tooling on checkout-service" — high impact (addresses the fastest-growing incident cause), scoped effort (single-service pilot fits current capacity), feeds directly into `reliability-roadmap` as a near-term candidate.
>
> **Overall verdict**: the trend clearly justifies a deploy-safety investment, but capacity constraints mean it should start as a scoped pilot rather than an org-wide initiative — the roadmap should reflect this staging, not just the raw priority ranking.

This example is illustrative — a real translation depends entirely on the actual trend data and capacity context for the target organization.
