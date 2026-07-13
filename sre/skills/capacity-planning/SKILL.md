---
name: capacity-planning
description: Project an SRE/on-call team's operational capacity against growing service portfolio and incident load — on-call sustainability, toil growth trajectory, and when team capacity (not infrastructure) becomes the binding constraint, distinct from infrastructure-resource capacity planning. Triggers on "project our sre team capacity against growth", "will our on-call rotation be sustainable as we grow", "when will our sre team be overloaded", "plan our reliability team's capacity for the next year".
user-invocable: true
---

# Capacity Planning

Project an SRE/on-call team's operational capacity forward against growing service count and incident load — a people/process capacity question, distinct from infrastructure resource capacity.

## When to use

- Forecasting whether an SRE/on-call team's capacity will keep pace with organizational/service growth.

**Out of scope**:
- Infrastructure resource capacity (compute, storage, database) → `linux/capacity-planning`, `databases/capacity-planning`, `ai-infra/ai-capacity-planning`
- Broader platform-team scaling (not SRE/on-call specific) → `platform/platform-scaling`

## Inputs

- Current team size, on-call rotation structure, and service/incident load per person.
- Growth trajectory (services added, expected incident volume growth).
- Toil trend data if available (from `toil-detection`).

## Workflow

### 1. Establish current load per person

Determine current on-call burden per person (services covered, incidents/pages per rotation, toil hours) as a baseline — this is the unit that needs to stay sustainable as growth occurs.

### 2. Project forward against growth

Given the growth trajectory (more services, more incident volume), project how per-person load changes if team size stays fixed — a growing service portfolio with a fixed team size means per-person load rises proportionally unless toil is reduced or automation absorbs the growth.

### 3. Identify the sustainability threshold

Determine what per-person load level is actually sustainable (informed by page frequency/burnout indicators, not just an arbitrary number) and project when the trend crosses that threshold — this turns an abstract "the team feels stretched" concern into a concrete, timed capacity constraint.

### 4. Weigh levers against each other

Compare the available levers — hiring, toil reduction/automation, reducing on-call scope (e.g., some services moving to a different support model) — since headcount growth is rarely the only or fastest option, similar to the automation-over-headcount framing in `platform/platform-scaling`.

### 5. Report

Current load baseline, projected load trajectory against growth, estimated date the sustainability threshold is crossed, and a comparison of available levers with recommendation.

## Notes

- Team capacity, not infrastructure capacity, is often the actual binding constraint as an organization scales — this is a distinct and commonly under-planned dimension compared to infrastructure capacity planning, which tends to get more proactive attention.
- Always weigh toil reduction/automation against pure headcount growth as the response to a capacity constraint — automation-driven capacity increases scale better long-term than linear headcount growth, similar to the reasoning in `platform/platform-scaling`.
