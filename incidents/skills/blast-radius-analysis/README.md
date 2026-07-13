# Blast Radius Analysis

Maps the architectural blast radius of an incident or proposed change — direct dependents, transitive exposure, and shared-fate infrastructure risk.

See `SKILL.md` for the full workflow.

## How to invoke

- "What's the blast radius of this incident?"
- "What else could this change affect if it goes wrong?"
- "What services depend on this component that could be affected?"

## Example

### Input

Component: `orders-db` (shared Postgres instance). Direct callers: `order-service`, `fulfillment-service`. `order-service` is also called by `checkout-service` and `admin-dashboard`. `notifications-service` doesn't call `orders-db` directly but runs on the same node pool as `order-service` and `fulfillment-service`.

### Output (abbreviated)

> **Blast radius map**
>
> **Direct (hard dependency)**:
> - `order-service` — fails if `orders-db` is unavailable (no fallback).
> - `fulfillment-service` — fails if `orders-db` is unavailable (no fallback).
>
> **Transitive (2 hops)**:
> - `checkout-service` — depends on `order-service`; would fail or degrade if `order-service` fails due to `orders-db`.
> - `admin-dashboard` — depends on `order-service`; likely degrades (read-heavy, may have caching) rather than hard-fails — `[soft dependency, verify caching behavior]`.
>
> **Shared-fate risk**:
> - `notifications-service` — `[Flag]` — no call-graph relationship to `orders-db`, but shares a node pool with `order-service` and `fulfillment-service`; a resource-exhaustion scenario (e.g., both services under heavy retry load consuming node CPU/memory) could degrade `notifications-service` through contention, not through any direct dependency.
>
> **Overall**: a full `orders-db` outage has a confirmed blast radius of at least 4 services (2 hard, 2 transitive/soft), plus a shared-fate risk to a 5th service under sustained load — recommend verifying `admin-dashboard`'s actual fallback behavior and considering node-pool isolation for `notifications-service` if this risk is unacceptable.

This example is illustrative — a real analysis depends entirely on the actual dependency graph and infrastructure topology discovered.
