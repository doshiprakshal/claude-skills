# Platform Cost Review

Reviews platform-level cost allocation and visibility — allocation mechanism completeness, shared-resource attribution, visibility, and incentive alignment.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our platform cost allocation model."
- "Do teams actually see the cost of what they provision?"
- "Why can't we attribute our shared infra cost to teams?"

## Example

### Input

Resources provisioned via the platform's Terraform modules are tagged with team ownership automatically. A cost dashboard exists showing per-team spend. However, the shared Kubernetes cluster's control plane and platform-tooling licensing costs (~20% of total infra spend) are unallocated, sitting as a general "platform" line item. No team has this cost reflected in any budget they're accountable for.

### Output (abbreviated)

> **Findings**
>
> - **Automated tagging and per-team dashboard exist** — no finding on the allocation mechanism itself or team-level visibility for tagged resources; this part of the model is working.
> - **20% of spend (shared cluster control plane, tooling licenses) is unallocated** — `[Medium]` — this "platform tax" isn't visible to any consuming team and isn't attributed even approximately, meaning it can grow without any team-level pressure to question it. Recommend a proportional attribution method (e.g., by team's pod/node resource consumption share) even if imperfect, rather than leaving it fully unattributed.
> - **Visibility exists but no budget accountability** — `[Medium]` — teams can see their dashboard, but no team's actual budget is affected by it, and no planning process reviews it. Visibility alone is unlikely to change provisioning behavior. Recommend tying the dashboard into a quarterly showback review in team planning, even short of full chargeback.
>
> **Overall verdict**: the accountability gap (visibility exists, but nothing depends on it) is likely the highest-leverage fix — connecting the existing dashboard to an actual planning process would make the already-built visibility useful, before investing further effort in the harder shared-resource attribution problem.

This example is illustrative — a real review depends entirely on the actual cost allocation practices and infrastructure discovered.
