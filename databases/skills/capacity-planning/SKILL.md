---
name: capacity-planning
description: Project a database's capacity needs (storage, compute, connections, IOPS) forward against growth trends to identify when current capacity will be exhausted, database-workload-specific and distinct from host-level OS capacity planning. Triggers on "project our database capacity needs", "when will we run out of database storage or iops", "plan our database capacity for the next 6 months", "database-specific capacity forecasting".
user-invocable: true
---

# Capacity Planning

Project a database's capacity needs — storage, compute, connections, IOPS — forward against actual growth trends, specific to database workload characteristics.

## When to use

- Forecasting when current database capacity (storage, IOPS, connections, compute) will be exhausted given growth trends.

**Out of scope**:
- General host/OS-level capacity planning (disk, CPU, memory at the infrastructure layer, not database-workload-specific) → `linux/capacity-planning`
- Data growth's storage-volume trend specifically, in isolation from other capacity dimensions → `storage-growth-analysis`

## Inputs

- Historical trend data for storage, IOPS/throughput, connection count, and CPU/memory utilization.
- Known upcoming events that could change growth trajectory (a major feature launch, an expected traffic increase).

## Workflow

### 1. Gather trend data per dimension

Collect historical trends for each relevant capacity dimension separately — storage growth, IOPS/throughput utilization, connection count trend, and CPU/memory headroom — since they often grow at different rates and hit their respective limits at different times.

### 2. Project forward per dimension

Extrapolate each dimension's trend to estimate when it will hit its current limit (storage volume capacity, provisioned IOPS ceiling, `max_connections`, CPU/memory saturation) — identify which dimension will be exhausted first, since that's the actual binding constraint regardless of how much headroom other dimensions have.

### 3. Factor in known upcoming events

Adjust projections for known future changes (a planned feature launch expected to increase write volume, a marketing campaign expected to spike read traffic) rather than relying purely on historical linear extrapolation, which can significantly understate near-term needs if a step-change is expected.

### 4. Recommend action with lead time

Given typical provisioning/migration lead times for the relevant change (e.g., a storage resize might be near-instant on a managed service, while a major version upgrade or a sharding migration takes much longer), recommend when action needs to start, not just when the limit will theoretically be hit — the lead time, not just the exhaustion date, determines urgency.

### 5. Report

A per-dimension projection with estimated exhaustion date, the binding (first-to-exhaust) constraint, and a recommended action-start date accounting for lead time.

## Notes

- Always identify the binding constraint explicitly — teams often focus on the most visible dimension (storage) while a less-visible one (connection count or IOPS) is actually going to be exhausted first; report all dimensions, not just the one that prompted the question.
- Lead time matters as much as the projection itself — a capacity fix that takes months to execute (e.g., a resharding project) needs to start well before the projected exhaustion date, not at it.
