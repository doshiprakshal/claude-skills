# NAT Gateway Review

A vendor-agnostic NAT strategy review — redundancy design, connection/port exhaustion risk, and cost-vs-resilience tradeoffs in NAT placement.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our NAT strategy."
- "Are we going to run out of NAT ports?"
- "Should we have one NAT gateway or one per AZ?"

## Example

### Input

A batch processing fleet of 200 hosts makes frequent short-lived outbound HTTPS connections to a single third-party API endpoint, all routed through one NAT point. Team reports intermittent "connection refused" errors specifically during peak batch windows.

### Output (abbreviated)

> **Findings**
>
> - **Likely port exhaustion against a single destination** — `[High]` — 200 hosts making frequent short-lived connections to the *same* destination IP:port through a single NAT point is exactly the pattern that exhausts available SNAT ports (the NAT can only track a limited number of concurrent connections per unique source-NAT-IP-to-destination combination). The intermittent "connection refused" errors during peak windows match this signature closely. Confirm by checking the NAT implementation's actual port utilization/exhaustion metrics during a peak window if available.
>
> **Recommended fix**
> If confirmed, options include: increase the number of NAT IP addresses (each additional NAT IP effectively multiplies available port capacity), reduce connection churn by enabling connection reuse/pooling in the batch client (fewer, longer-lived connections instead of one-per-request), or reduce concurrency of the batch fleet if the third-party API can't actually handle this volume regardless of NAT capacity.
>
> **Overall verdict**
> This is very likely a NAT port exhaustion issue given the specific pattern (many hosts, single destination, short-lived connections, peak-correlated failures) — worth confirming with actual NAT metrics before implementing a fix, but the pattern match is strong enough to prioritize this investigation first.

This example is illustrative — a real review depends entirely on the actual NAT topology and connection data discovered for the target setup.
