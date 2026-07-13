---
name: platform-cost-review
description: Review platform-level cost allocation and visibility — whether shared platform infrastructure cost is fairly attributed to consuming teams, and whether cost accountability actually drives behavior, distinct from any single cloud provider's cost-optimization deep-dive. Triggers on "review our platform cost allocation model", "do teams actually see the cost of what they provision", "why can't we attribute our shared infra cost to teams", "review platform-level cost accountability".
user-invocable: true
---

# Platform Cost Review

Review platform-level cost allocation and visibility — whether shared infrastructure cost is fairly and usefully attributed to the teams consuming it, as a cost-accountability question distinct from raw cost-optimization tactics.

## When to use

- Reviewing whether/how platform-provided infrastructure cost is allocated back to consuming teams.

**Out of scope**:
- Cloud-provider-specific cost optimization tactics → `aws/cost-optimization`, `kubernetes/cost-optimization`
- Cost review specific to AI/LLM infrastructure → `ai-infra` domain's cost skills

## Inputs

- Current cost allocation/tagging practice for platform-provisioned resources.
- Whether teams have visibility into their own consumption cost, and whether cost is tied to any team-level accountability (budget, chargeback/showback).
- Shared/pooled infrastructure that's hard to attribute to a single team.

## Workflow

### 1. Assess allocation mechanism completeness

Check whether resources provisioned through the platform are consistently tagged/labeled with the consuming team, enabling per-team cost attribution — inconsistent or missing tagging is the most common reason cost can't be allocated even when the underlying cloud billing data exists.

### 2. Assess shared/pooled resource attribution

For genuinely shared infrastructure (a shared cluster's control plane, a shared platform tool's licensing), determine whether there's a reasonable attribution method (even an approximate one, like proportional-to-usage) rather than leaving it as an unattributed "platform tax" that no team sees or is accountable for.

### 3. Assess visibility and accountability

Check whether teams can actually see their own cost (not just whether the platform team can see aggregate cost) and whether that visibility is tied to any actual accountability (a team budget, a showback report reviewed in planning) — visibility without accountability rarely changes behavior; accountability without visibility isn't actionable.

### 4. Assess incentive alignment

Check whether the cost allocation model actually incentivizes efficient usage (e.g., a team that over-provisions sees a corresponding cost) rather than a flat/socialized cost model that removes any team-level incentive to be efficient.

### 5. Report

Findings on Allocation Mechanism, Shared Resource Attribution, Visibility, Accountability, Incentive Alignment, each with severity.

## Notes

- Visibility without accountability (a dashboard nobody's budget depends on) is a common half-measure that looks like progress but doesn't change behavior — always check whether cost data actually connects to a real accountability mechanism, not just whether it's technically viewable.
- A flat/socialized cost model removes the incentive for any individual team to optimize — if efficiency is a stated goal, the allocation model itself needs to create team-level cost consequences, not just report aggregate spend.
