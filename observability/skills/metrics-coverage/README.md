# Metrics Coverage

Assesses metrics coverage for a service — golden signals, dependency instrumentation, and async/background work — and surfaces monitoring blind spots.

See `SKILL.md` for the full workflow.

## How to invoke

- "What metrics coverage do we have for this service?"
- "Do we have blind spots in our monitoring?"
- "Assess metrics coverage for the checkout service."

## Example

### Input

Service: `checkout-service`. Instrumented: request latency, request count, error rate at the HTTP layer. Dependencies: a Postgres database and a downstream `payments-service` call. A background job reconciles pending orders every 10 minutes. No metrics exist for the database calls, the `payments-service` call, or the reconciliation job.

### Output (abbreviated)

> **Coverage map**
>
> | Component | Instrumented | Gap |
> |---|---|---|
> | HTTP request path | Latency, count, errors | — |
> | Postgres calls | None | `[High]` — no query latency/error metrics; a slow or failing DB call is only visible as generic elevated HTTP latency, not attributable to the database |
> | `payments-service` call | None | `[High]` — same issue; a failing payment dependency is indistinguishable from a checkout-service-internal problem in current metrics |
> | Reconciliation job | None | `[Medium]` — no visibility into whether the job is running, how long it takes, or whether it's failing; a silently broken reconciliation job could go unnoticed for a long time |
>
> **Overall verdict**
> The primary request path is well covered, but both critical dependencies and the background job are completely uninstrumented — any incident whose root cause is the database, payments-service, or reconciliation would currently be invisible or misattributed. Recommend adding dependency-call and job-level metrics before relying on this service's current monitoring to diagnose real incidents.

This example is illustrative — a real assessment depends entirely on the actual service architecture and instrumentation discovered.
