---
name: incident-trend-review
description: Review incident trends specifically through an SRE reliability-investment lens — connecting trend patterns to concrete reliability roadmap decisions, distinct from the broader cross-category incident-trend-analysis in the Incident Response domain. Triggers on "what do our incident trends tell us about where to invest", "review our incident trends for reliability roadmap input", "translate our incident patterns into reliability priorities", "sre-focused incident trend review".
user-invocable: true
---

# Incident Trend Review

Review incident trends specifically to inform SRE reliability investment decisions, connecting patterns directly to roadmap priorities.

## When to use

- Incident trend data needs to be translated specifically into reliability investment/roadmap input.

**Out of scope**:
- The general incident volume/severity/MTTR trend computation itself → `incidents/incident-trend-analysis` (this skill builds on that data with an SRE-investment-focused lens)
- Extracting systemic cross-incident lessons for postmortem/process purposes → `incidents/lessons-learned`

## Inputs

- Incident trend data (ideally already computed via `incidents/incident-trend-analysis`): volume, severity mix, MTTR, top contributing services/causes.
- Current reliability roadmap/capacity context.

## Workflow

### 1. Start from computed trend data

Take the underlying volume/severity/MTTR/cause-breakdown trend data as a given input (route to `incidents/incident-trend-analysis` first if it doesn't yet exist) rather than re-deriving it here.

### 2. Translate patterns into investment categories

Map trend findings to specific reliability investment categories — e.g., a rising deploy-related incident share points toward deploy-safety tooling investment; a specific service's disproportionate contribution points toward targeted reliability work for that service; a slow MTTR trend points toward operational readiness/runbook investment.

### 3. Weigh against current capacity

Cross-reference `capacity-planning` to check whether the team has room to actually act on the highest-priority translated investment, or whether the investment itself needs to be sequenced behind a capacity fix.

### 4. Connect to roadmap

Feed the translated, capacity-aware investment priorities directly into `reliability-roadmap` as candidate items, rather than leaving the trend analysis as an disconnected standalone report.

### 5. Report

The trend-to-investment translation (which pattern implies which reliability investment), weighed against current team capacity, formatted as roadmap-ready candidate items.

## Notes

- This skill's distinct value over `incidents/incident-trend-analysis` is the translation step — turning "what happened" trend data into "what should we invest in" recommendations specifically scoped to reliability engineering decisions, not just describing the pattern.
- Always check current team capacity before finalizing investment recommendations — a trend-justified investment that the team has no capacity to execute needs explicit sequencing against capacity constraints, not just a priority ranking in isolation.
