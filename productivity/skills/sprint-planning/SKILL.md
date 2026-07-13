---
name: sprint-planning
description: Assist with sprint planning — backlog grooming for readiness, capacity-aware scope sizing, and flagging over-commitment risk, based on the team's actual historical throughput rather than optimistic estimates. Triggers on "help us plan this sprint", "is our sprint backlog realistic given our capacity", "groom this backlog for sprint readiness", "are we over-committing for this sprint".
user-invocable: true
---

# Sprint Planning

Assist with sprint planning — backlog readiness, capacity-aware scope sizing grounded in actual historical throughput, and over-commitment risk.

## When to use

- Planning a sprint's scope, or assessing whether a proposed sprint backlog is realistic.

**Out of scope**:
- Prioritizing infrastructure/reliability-specific investment items → `sre/reliability-roadmap`, `platform/platform-roadmap`
- Identifying/prioritizing technical debt items to include → `technical-debt-analysis`

## Inputs

- Candidate backlog items for the sprint, with size estimates.
- The team's actual historical velocity/throughput (not just capacity in theory).
- Known capacity reductions (holidays, planned time off, on-call rotation load).

## Workflow

### 1. Assess backlog item readiness

Check whether each candidate item is actually ready for sprint inclusion — clear acceptance criteria, no unresolved blocking dependency, appropriately sized (not so large it should be broken down further) — an item pulled into a sprint while still ambiguous is a common source of mid-sprint scope confusion.

### 2. Establish realistic capacity

Use actual historical velocity/throughput, adjusted for known capacity reductions this specific sprint (holidays, on-call load, planned time off) — rather than nominal full-team capacity, which systematically overstates what a team can actually deliver.

### 3. Size the sprint against realistic capacity

Compare total candidate item size against the realistic capacity figure, not the optimistic one — flag over-commitment explicitly if candidate scope exceeds what historical throughput suggests is achievable.

### 4. Flag risk concentration

Check whether the sprint's risk is concentrated in a small number of items (e.g., most items are well-understood but one large, ambiguous item dominates the sprint) — this affects how the sprint should be sequenced (tackle the risky item early, not last) more than raw point totals suggest.

### 5. Report

A backlog readiness assessment, realistic capacity estimate with adjustments, over-commitment flag if scope exceeds it, and risk concentration notes with sequencing recommendation.

## Notes

- Always ground capacity in actual historical throughput, not nominal full-capacity estimates — teams systematically over-commit when sprint planning uses theoretical full capacity rather than what they've actually delivered in recent comparable sprints.
- An item with unresolved blocking dependencies or unclear acceptance criteria shouldn't be pulled into the sprint as-is — flag it for further grooming rather than including it and hoping it resolves itself mid-sprint.
