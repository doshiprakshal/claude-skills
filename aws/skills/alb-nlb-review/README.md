# ALB/NLB Review

Reviews Application/Network Load Balancer configuration — listener rules, target group health checks, SSL/TLS policy, cross-zone load balancing, and deregistration delay tuning.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our load balancer."
- "ALB listener rule review."
- "Is our target group health check correct?"

## Example

### Input

Target group health check path is `/` (returns a static 200 regardless of database connectivity). The app's actual failure mode is a broken database connection while `/` still returns 200. Deregistration delay is 300 seconds (5 minutes) — deployments take a long time to fully cut over.

### Output (abbreviated)

> **Findings**
>
> - **Health check doesn't reflect real application health** — `[High]` — `/` returns 200 unconditionally, so the load balancer considers a target healthy even when its database connection is broken — exactly the failure mode the team cares about. Add a dedicated `/healthz` endpoint that checks the database connection (and any other critical dependency) and returns non-200 when they're down, then point the health check at it.
> - **Deregistration delay of 300s slows every deployment** — `[Medium]` — each deployment waits up to 5 minutes per target for in-flight requests to drain before it's fully replaced. Unless requests genuinely run this long, reducing to something like 30-60s would speed up deployments significantly with minimal risk of cutting off in-flight requests.
>
> **Overall verdict**
> The health check gap is the more serious issue — it means the load balancer is currently blind to the exact failure the team is worried about. Fix that first; the deregistration delay is a deployment-speed improvement, not a correctness issue.

This example is illustrative — a real review depends entirely on the actual load balancer configuration discovered for the target account.
