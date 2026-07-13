---
name: platform-scaling
description: Assess whether the platform team and its tooling can scale with organizational growth — platform-team-to-engineer ratio trends, tooling bottlenecks that degrade at higher scale, and where manual processes will break first, distinct from any single infrastructure component's autoscaling configuration. Triggers on "will our platform scale as we grow headcount", "what will break first as we add more teams to the platform", "review our platform team's scaling capacity", "assess platform bottlenecks at 2x our current scale".
user-invocable: true
---

# Platform Scaling

Assess whether the platform team and its tooling can scale with organizational growth — where the platform will hit a wall as team/service count grows, and how far in advance that's visible.

## When to use

- Anticipating scaling bottlenecks in the platform team or its tooling ahead of organizational growth.

**Out of scope**:
- Infrastructure-component-level autoscaling configuration (compute, k8s HPA/VPA) → `kubernetes/autoscaling-review`, `aws/auto-scaling-review`
- Database-specific scaling → the relevant `databases/` skill

## Inputs

- Current platform-team size and the number of engineers/services/teams it supports.
- Growth trajectory (projected headcount/service count over a defined horizon).
- Known manual or partially-manual processes in the platform's operation.

## Workflow

### 1. Establish the current ratio and trend

Determine the current platform-team-to-supported-engineer (or per-service) ratio, and how it's trended as the org has grown — a ratio that's held steady or improved (fewer platform engineers needed per supported engineer, thanks to self-service/automation) is a healthy sign; a ratio requiring proportional platform-team growth to keep pace is a scaling risk, since platform-team headcount rarely grows proportionally with the org.

### 2. Identify manual bottlenecks that don't scale linearly

Find specific processes (manual approvals, manual configuration propagation, ad hoc support) that get proportionally slower or more error-prone as team/service count grows — these are the concrete "what breaks first" answer, more useful than an abstract ratio discussion (cross-reference `self-service-review` for automation candidates).

### 3. Project forward

Given a stated growth horizon (e.g., "2x headcount in 18 months"), reason through which specific bottleneck would be hit first and roughly when, based on current trend — this turns an abstract scaling concern into a concrete, timed warning.

### 4. Recommend the highest-leverage scaling investment

Prioritize investments that reduce the platform team's per-unit involvement (more self-service, more automation) over investments that only work by adding platform-team headcount, since the latter is a weaker long-term scaling strategy.

### 5. Report

Current ratio/trend, identified bottlenecks ranked by how soon they'd be hit at the stated growth trajectory, and prioritized scaling investments.

## Notes

- A platform strategy that requires headcount to scale proportionally with the org is fragile — always frame recommendations toward reducing per-unit platform-team involvement (automation, self-service) rather than assuming more platform hires will solve the bottleneck.
- Projecting forward with a concrete timeline ("this breaks at ~150 engineers, expected in Q3") is far more actionable than a general "this won't scale forever" statement — always attempt the concrete projection when growth trajectory data is available.
