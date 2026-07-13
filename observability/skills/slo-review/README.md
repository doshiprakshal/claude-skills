# SLO Review

Reviews Service Level Objective definitions — whether the SLI reflects user-perceived reliability, whether the target is meaningful and achievable, and whether measurement is implemented correctly.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our SLO definitions."
- "Is our SLI actually meaningful?"
- "Is this SLO target achievable given our architecture?"

## Example

### Input

SLO: "99.95% of requests succeed" measured as `count(http_status < 500) / count(all requests)` at the load balancer, over a rolling 7-day window. Requests include a synthetic health check hitting `/healthz` every 5 seconds. The architecture is single-region with no automated failover.

### Output (abbreviated)

> **Findings**
>
> - **SLI is diluted by synthetic health-check traffic** — `[High]` — the health check runs every 5 seconds (~120,960 requests over 7 days) and almost always succeeds, inflating the measured success rate above what real user traffic experiences. Exclude synthetic/health-check traffic from the SLI computation, or measure it separately.
> - **99.95% target implies availability the single-region architecture can't sustain through a regional outage** — `[High]` — a regional infrastructure event would drop actual availability far below 99.95% with no automated failover to recover within the budget. Either lower the target to reflect current architecture, or treat multi-region failover as a prerequisite before committing to this target.
> - **Load-balancer-level status code doesn't capture client-perceived failures** — `[Medium]` — a request can return `< 500` at the LB while still failing or timing out from the client's perspective (e.g., slow responses, client-side errors). Consider a synthetic-user or RUM-based SLI for the critical user journey if client experience diverges meaningfully from server-side status codes.
>
> **Overall verdict**
> The SLI needs to exclude synthetic traffic before the target can be evaluated honestly, and the target itself is not achievable as currently architected — recommend revisiting both before treating this SLO as a reliable signal.

This example is illustrative — a real review depends entirely on the actual SLO definitions and architecture for the target service.
