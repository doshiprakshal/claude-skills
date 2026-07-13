# Service Maturity Assessment

Scores reliability/operational maturity across a service portfolio against a consistent stage model, weighted by criticality, to prioritize investment.

See `SKILL.md` for the full workflow.

## How to invoke

- "Score reliability maturity across our service portfolio."
- "Which services most need reliability investment?"
- "Portfolio-wide reliability maturity scoring."

## Example

### Input

Portfolio of 12 services. `checkout-service` (customer-critical, tier-1): no SLO defined, on-call ownership assigned but no runbooks exist. `internal-reporting-tool` (low criticality, tier-3): no SLO, no runbooks, no dedicated on-call — but also low business impact if it degrades. `payments-service` (tier-1): strong maturity across all dimensions.

### Output (abbreviated)

> **Maturity scorecard**
>
> | Service | Criticality | Monitoring | Runbooks | On-Call | SLO |
> |---|---|---|---|---|---|
> | checkout-service | Tier-1 | Managed | Ad Hoc (none) | Managed | Ad Hoc (none) |
> | payments-service | Tier-1 | Optimized | Self-Service | Optimized | Self-Service |
> | internal-reporting-tool | Tier-3 | Ad Hoc | Ad Hoc | Ad Hoc | Ad Hoc |
>
> **Risk concentration identified**: `checkout-service` — `[Highest priority]` — despite being tier-1 (customer-critical, comparable importance to `payments-service`), it has significant maturity gaps (no runbooks, no SLO) that `payments-service` doesn't have. This high-criticality/low-maturity combination is the portfolio's clearest reliability investment priority.
>
> **Lower priority despite low maturity**: `internal-reporting-tool` scores low across every dimension too, but its tier-3 criticality means these gaps matter far less — recommend not prioritizing this service's maturity gaps ahead of `checkout-service`'s, despite `internal-reporting-tool`'s scorecard looking similarly sparse.
>
> **Overall verdict**: `checkout-service` is the portfolio's top reliability investment priority — its gaps sit at the intersection of high business criticality and meaningfully low maturity, which is a stronger signal than either the raw maturity score or criticality tier alone.

This example is illustrative — a real assessment depends entirely on the actual portfolio and evidence gathered.
