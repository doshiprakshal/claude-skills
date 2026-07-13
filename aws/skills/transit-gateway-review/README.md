# Transit Gateway Review

Reviews Transit Gateway configuration — attachment routing, route table associations/propagations, cross-account sharing scope, and blast radius of shared connectivity.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our Transit Gateway."
- "TGW routing review."
- "Is our Transit Gateway routing correct?"

## Example

### Input

Single TGW route table, all attachments (prod VPC, dev VPC, shared-services VPC, site-to-site VPN) associated and propagated into it. Team's stated intent: "dev should never be able to reach prod directly."

### Output (abbreviated)

> **Findings**
>
> - **Flat routing contradicts stated isolation intent** — `[Blocker]` — all attachments share one TGW route table with full propagation, meaning the dev VPC currently *can* route directly to the prod VPC through the TGW — the opposite of the stated requirement. Split into separate route tables: associate dev and prod attachments with different route tables, and only propagate the shared-services VPC's routes into both (so both can reach shared services, but not each other).
>
> **Recommended fix**
> Create at least two TGW route tables (e.g., `prod-rt`, `dev-rt`). Associate the prod VPC attachment with `prod-rt` and propagate only shared-services + VPN routes into it (not dev's). Associate the dev VPC attachment with `dev-rt` similarly, excluding prod's routes. Verify with a connectivity test from a dev instance that prod is genuinely unreachable afterward.
>
> **Overall verdict**
> This is a direct contradiction between stated security intent and actual routing — treat as the highest-priority fix in this review.

This example is illustrative — a real review depends entirely on the actual TGW configuration discovered for the target account.
