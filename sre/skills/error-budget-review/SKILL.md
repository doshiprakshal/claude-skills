---
name: error-budget-review
description: Review error budget policy governance across an organization's service portfolio — whether policy is applied consistently across teams, whether budget-exhaustion escalation actually happens, and whether budget status informs org-wide prioritization, distinct from a single service's burn-rate math correctness. Triggers on "review our error budget governance across teams", "do we consistently enforce error budget policy org-wide", "is error budget status actually informing our prioritization decisions", "audit error budget policy consistency across services".
user-invocable: true
---

# Error Budget Review

Review error budget policy governance across an organization's service portfolio — consistency of application, escalation follow-through, and whether budget status actually informs prioritization at the org level.

## When to use

- Assessing error budget policy consistency and enforcement across many teams/services.

**Out of scope**:
- Single-service burn-rate alert math and policy design → `observability/error-budget-review`
- SLO adoption/coverage itself → `slo-review`

## Inputs

- Error budget policies as defined per team/service, and how consistently they're structured.
- History of budget-exhaustion events and what actually happened afterward (was the stated policy action taken).

## Workflow

### 1. Assess policy consistency across teams

Check whether error budget policies (what happens on exhaustion) are structured consistently across teams, or whether each team has invented its own ad hoc approach with wildly different rigor — inconsistency undermines the ability to compare reliability posture across the org and makes org-wide prioritization decisions harder to reason about.

### 2. Assess escalation follow-through

For teams/services that have exhausted their error budget, check whether the stated policy action (feature freeze, reprioritization) actually happened — a policy that's consistently not followed in practice is equivalent to having no policy, and this gap is often invisible until specifically audited.

### 3. Assess org-level prioritization influence

Determine whether budget status across the portfolio actually informs org-wide resourcing/prioritization decisions (e.g., a team with a chronically exhausted budget getting reliability investment prioritized) — this is the org-level analogue of the single-service question in `observability/error-budget-review`'s policy-teeth check.

### 4. Identify systemically under-resourced teams

Look for a pattern of teams whose error budgets are chronically exhausted despite policy — this may indicate the team is genuinely under-resourced for its reliability bar, a finding that's only visible when looking across the portfolio rather than one team at a time.

### 5. Report

A cross-team policy consistency assessment, escalation follow-through evidence, org-level prioritization influence assessment, and any identified chronically under-resourced teams.

## Notes

- Escalation follow-through (or the lack of it) is the highest-value and most commonly unchecked finding here — a well-designed policy that's never actually enforced when triggered provides no more real protection than no policy at all; always look for concrete evidence of policy actions actually taken, not just the policy's existence.
- A pattern of chronic budget exhaustion across a specific team, visible only at the portfolio level, is a signal worth escalating as a resourcing conversation, not just a series of individual team-level findings.
