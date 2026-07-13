# Self-Service Review

Reviews what a platform actually offers as self-service versus manual/ticket-based, and whether existing self-service guardrails are appropriately scoped.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our self-service capabilities."
- "What still requires a ticket that should be self-service?"
- "Are our self-service guardrails appropriately scoped?"

## Example

### Input

New service provisioning is self-service via a template with resource quotas enforced. Requesting a new database instance requires a manual ticket to the platform team; ticket volume is ~15/week with an average 2-day turnaround. Requesting elevated IAM permissions is self-service with no approval gate or scoping limit — any developer can request any permission level.

### Output (abbreviated)

> **Self-service inventory**
> | Action | Mode | Notes |
> |---|---|---|
> | New service provisioning | Self-service, guardrailed | Quotas enforced — appears well-scoped |
> | Database provisioning | Manual ticket | ~15/week, 2-day turnaround |
> | IAM permission requests | Self-service, unguardrailed | No approval gate or scoping limit |
>
> **Findings**
>
> - **Database provisioning is a strong self-service automation candidate** — `[High]` — 15 requests/week at 2-day turnaround is a substantial, quantifiable bottleneck for a request type that's typically well-suited to templated self-service (predictable inputs, low variability). Recommend building a self-service database provisioning flow with appropriate resource quotas, similar to the existing service provisioning template.
> - **Unguardrailed self-service IAM permission requests** — `[Blocker]` — self-service with no approval gate or scoping limit for permission escalation is a significant security risk; any developer can currently self-grant any permission level. This is a more urgent finding than the database bottleneck despite being the "already self-service" case — recommend adding an approval gate and/or a scoped permission catalog immediately; see `security/iam-audit` for the underlying least-privilege review.
>
> **Overall verdict**: fix the IAM guardrail gap first (active risk today) before investing in the database self-service automation (a throughput improvement, not a risk).

This example is illustrative — a real review depends entirely on the actual platform actions and their current mode discovered.
