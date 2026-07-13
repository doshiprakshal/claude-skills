# Incident Dashboard

Assembles a focused, incident-specific dashboard from panels relevant to the suspected components, for fast triage during an active incident.

See `SKILL.md` for the full workflow.

## How to invoke

- "Build a dashboard for this incident."
- "Assemble the relevant panels for this outage — checkout, payments, and the shared database."
- "Generate a war-room dashboard for this investigation."

## Example

### Input

Incident: elevated checkout errors reported at 14:32. Suspected components: `checkout-service`, `payments-service`, and the shared `orders-db` Postgres instance they both connect to. A deploy to `payments-service` went out at 14:20.

### Output (abbreviated)

> **Assembled incident dashboard**
>
> **Row 1 — checkout-service**: request rate, error rate, latency p95 (window: 14:00–now)
> **Row 2 — payments-service**: request rate, error rate, latency p95, with a deploy annotation marked at 14:20
> **Row 3 — orders-db**: connection count, query latency p95, replication lag (shared dependency — relevant if impact appears simultaneous across both services)
>
> **What this layout helps distinguish**: if the error spike in Row 1 (checkout) starts *after* and *correlates with* the spike in Row 2 (payments), that points to the 14:20 payments-service deploy as the likely trigger, propagating downstream. If Row 3 shows a simultaneous connection or latency spike in `orders-db` at the same time, a shared database issue independent of the deploy becomes the more likely explanation — check that before concluding the deploy is at fault.
>
> **Note**: the 14:20 deploy annotation is the highest-value single signal here given the ~12-minute proximity to incident onset — check it first.

This example is illustrative — a real assembled dashboard depends entirely on the actual incident, suspected components, and available panels.
