# AWS Architecture Review

Reviews an AWS workload's overall architecture — service selection fit, cross-service integration patterns, and account/region structure — using live AWS state directly.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our AWS architecture."
- "Is our AWS service selection right?"
- "Should we be using this AWS service for this workload?"

## Example

### Input

An order-processing workload: API Gateway → Lambda (synchronous) → RDS (write) → Lambda (synchronous, calls a third-party shipping API with no retry logic) → returns response to the original caller. During shipping-API slowness, the entire request chain times out and the order write itself gets rolled back even though it had already succeeded.

### Output (abbreviated)

> **Findings**
>
> - **Synchronous coupling to a third-party dependency inside the critical path** — `[High]` — the shipping API call is fully synchronous within the same request that writes the order. A slow/failing third party directly causes order-write failures, even though the order data itself was already successfully persisted moments earlier. Decouple: write the order first, commit, then publish an event (EventBridge/SQS) that a separate consumer uses to call the shipping API asynchronously with retries — order success no longer depends on shipping-API latency.
> - **No dead-letter handling for the shipping integration** — `[Medium]` — once decoupled via a queue, add a DLQ so a persistently failing shipping call doesn't silently retry forever or get dropped.
>
> **Overall verdict**
> The synchronous coupling is the core architectural issue — it's collapsing two independent operations (order persistence, shipping notification) into one failure domain that doesn't need to be coupled. Decoupling them addresses both reliability and the observed timeout/rollback issue directly.

This example is illustrative — a real review depends entirely on the actual AWS architecture discovered for the target workload.
