---
name: toil-detection
description: Identify toil — manual, repetitive, automatable operational work — across an SRE/on-call team's activity, quantifying its cost and prioritizing automation candidates, distinct from general platform self-service review. Triggers on "identify toil in our on-call work", "how much of our time is spent on repetitive manual tasks", "prioritize our toil for automation", "what operational work should we automate first".
user-invocable: true
---

# Toil Detection

Identify toil — manual, repetitive, automatable operational work — across an SRE/on-call team's activity, and prioritize automation candidates by cost.

## When to use

- Assessing how much of a team's time goes to toil, or prioritizing what to automate.

**Out of scope**:
- Platform-wide self-service capability review across the org (broader than one SRE team's own toil) → `platform/self-service-review`
- The reliability roadmap sequencing once toil-reduction candidates are identified → `reliability-roadmap`

## Inputs

- On-call/operational activity logs (ticket history, runbook execution frequency, manual intervention records).
- Time estimates per recurring task type, if available.

## Workflow

### 1. Classify activity as toil vs. engineering work

Apply toil's defining characteristics — manual, repetitive, automatable, tactical (not lasting value), scales linearly with service growth — to distinguish genuine toil from necessary but non-automatable operational work (e.g., a novel incident investigation is not toil; restarting a known-flaky service via a manual runbook step repeatedly is).

### 2. Quantify toil volume and cost

For each identified toil category, estimate frequency and time cost — aggregate cost (frequency × time × number of people who do it) is what should drive prioritization, not how annoying any single instance feels.

### 3. Assess automatability

For each toil category, assess how feasible automation actually is — some toil is automatable with modest effort (a scripted runbook step), while some requires more significant engineering investment (a self-healing system) — this affects prioritization alongside raw cost.

### 4. Prioritize by cost-to-automate ratio

Rank toil-reduction candidates by aggregate time cost relative to automation effort — favor high-frequency, low-automation-effort toil first, since it offers the fastest payback.

### 5. Report

A toil inventory with frequency/cost estimates, automatability assessment per item, and a prioritized automation candidate list.

## Notes

- Toil scales with service/traffic growth in a way that engineering work doesn't — a toil category that's tolerable today at current scale can become a significant burden as the service or on-call surface grows; factor growth trajectory into prioritization, not just current cost.
- Distinguish toil from legitimately necessary manual judgment work — not all manual work is toil; toil specifically is the repetitive, automatable, no-lasting-value category, and misclassifying necessary judgment work as toil risks automating away steps that actually need human judgment.
