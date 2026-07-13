# Latency Investigation

Diagnoses elevated latency along a network path, distinguishing genuine network-layer latency from application-layer processing time misattributed to the network.

See `SKILL.md` for the full workflow.

## How to invoke

- "Why is latency so high to this service?"
- "Is this network latency or application latency?"
- "Diagnose slow response times."

## Example

### Input

Users report "the API feels slow" — full request response time averaging 850ms. Raw TCP connect time / ping to the API host averages 12ms.

### Output (abbreviated)

> **Network vs. application split**
> Network-layer latency (12ms) is low and unremarkable — it's not the source of the 850ms end-to-end response time users are experiencing. The gap (850ms total vs. 12ms of network round-trip) is almost entirely application-layer processing time.
>
> **Hand-off**
> This is not a network issue — the network path is fine. The actual slowness is in how long the application takes to process the request and generate a response, which is outside this domain's scope. Recommend investigating application-level factors instead: database query time, downstream dependency calls, or application code performance (e.g., via application profiling or APM tooling — the `observability` domain's skills would be the right next step for that investigation).
>
> **Overall verdict**
> Ruling out the network as the cause, backed by the direct measurement comparison (12ms network vs. 850ms total), is itself the valuable finding here — it redirects the investigation to where the actual problem is, rather than continuing to look at network infrastructure that isn't the issue.

This example is illustrative — a real investigation depends entirely on the actual latency measurements for the target service.
