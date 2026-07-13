# Error Budget Review

Reviews error budget policy governance across an organization's service portfolio — cross-team consistency, escalation follow-through, and org-level prioritization influence.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our error budget governance across teams."
- "Do we consistently enforce error budget policy org-wide?"
- "Is error budget status actually informing our prioritization decisions?"

## Example

### Input

5 teams each have their own error budget policy document, with wording ranging from a specific, measurable freeze-trigger to a vague "we'll discuss it." Reviewing the last 3 budget-exhaustion events across the org: in 2 cases, the stated policy action was never actually taken; the affected teams simply kept shipping features. One team's budget has been chronically exhausted for 4 of the last 6 months.

### Output (abbreviated)

> **Policy consistency**: `[Flag]` — wide variance in policy rigor across teams, from a specific measurable trigger to vague language with no enforceable action; this makes cross-team reliability comparison and org-wide resourcing decisions harder to reason about consistently. Recommend a standardized policy template with a required concrete trigger and action, applied across all teams.
>
> **Escalation follow-through**: `[High]` — 2 of the last 3 budget-exhaustion events resulted in no actual policy action being taken; teams continued shipping features despite exhausted budgets. This means the org's error budget policies, in practice, provide essentially no real enforcement — equivalent to not having a policy for those teams. This is the most significant finding here.
>
> **Chronically exhausted team**: `[Flag]` — one team has been over-budget for 4 of the last 6 months with no apparent change in resourcing or prioritization. This pattern, visible only when looking across the portfolio's history, suggests this team may be structurally under-resourced for its current reliability bar — recommend a resourcing conversation rather than continuing to treat each exhaustion event as an isolated incident.
>
> **Overall verdict**: fix the escalation follow-through gap first — no amount of policy consistency work matters if policies aren't actually enforced when triggered. The chronically exhausted team is a strong candidate for the org's next reliability investment conversation.

This example is illustrative — a real review depends entirely on the actual policies and escalation history discovered.
