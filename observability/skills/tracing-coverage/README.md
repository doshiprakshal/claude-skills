# Tracing Coverage

Assesses distributed tracing coverage — end-to-end context propagation, span granularity, dependency coverage, and log/metric correlation.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our tracing coverage."
- "Do we have gaps in our distributed tracing?"
- "Why does this trace stop partway through the request?"

## Example

### Input

Request flow: `api-gateway` → `order-service` (HTTP, instrumented) → publishes to a Kafka topic → `fulfillment-worker` (consumer, no tracing instrumentation) → calls `inventory-service` (HTTP, instrumented). Traces currently show `api-gateway` → `order-service` and then nothing further.

### Output (abbreviated)

> **Coverage map**
>
> | Hop | Propagation | Gap |
> |---|---|---|
> | api-gateway → order-service | Yes (HTTP headers) | — |
> | order-service → Kafka publish | No | `[High]` — trace context isn't attached to message metadata when publishing |
> | Kafka consume → fulfillment-worker | No (no instrumentation at all) | `[High]` — worker has no tracing instrumentation; even if context were propagated, nothing would consume it |
> | fulfillment-worker → inventory-service | N/A | Downstream of the break — untraceable regardless of inventory-service's own instrumentation |
>
> **Overall verdict**
> The trace breaks at the Kafka publish/consume boundary — this is the highest-priority gap since everything downstream (`fulfillment-worker` and its call to `inventory-service`) is currently invisible in any trace regardless of individual instrumentation quality. Recommend: (1) propagate trace context into Kafka message headers on publish, (2) instrument `fulfillment-worker` to extract context on consume and continue the trace. `inventory-service`'s existing instrumentation will then connect automatically once the upstream gap is closed.

This example is illustrative — a real assessment depends entirely on the actual call graph and instrumentation discovered.
