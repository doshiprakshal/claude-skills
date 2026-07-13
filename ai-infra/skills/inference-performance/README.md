# Inference Performance

Investigates inference latency/throughput issues end-to-end — separating time-to-first-token from generation latency and localizing the actual bottleneck.

See `SKILL.md` for the full workflow.

## How to invoke

- "Why is our inference latency high?"
- "Investigate our LLM response time."
- "Diagnose slow time to first token."

## Example

### Input

Users report the assistant feature "feels slow." Metrics show time-to-first-token averages 4 seconds during peak hours (versus 400ms off-peak), while per-token generation speed is consistent regardless of time of day. Peak-hour request concurrency is roughly 8x off-peak levels. Serving capacity has not been scaled up to match peak demand.

### Output (abbreviated)

> **TTFT vs. generation latency breakdown**: TTFT is the problem (4s peak vs. 400ms off-peak, a 10x difference); generation-phase latency is stable across load levels, ruling out a compute/decode-phase issue.
>
> **Root cause catalog**
> - Queueing — `[Likely]` — TTFT degrading specifically under 8x higher concurrency, with no corresponding capacity increase, strongly suggests requests are queueing for an available serving slot before processing begins.
> - Long prompt/prefill cost — `[Ruled out]` — this would cause elevated TTFT regardless of concurrency level, but off-peak TTFT is fast, ruling out prompt size as the primary driver.
> - Cold start — `[Ruled out]` — no evidence of autoscaling events correlating with the slowness; capacity isn't being scaled up at all currently.
>
> **Root cause**: request queueing under peak concurrency, with serving capacity not scaled to match peak demand. `[Confidence: Likely]`
>
> **Recommended fix**: scale serving capacity for peak hours (autoscaling or increased baseline capacity), and/or review batching configuration to confirm available capacity is used efficiently — see `vllm-review`/`gpu-cluster-optimization` for the specific capacity and batching fix once this is confirmed as the bottleneck.

This example is illustrative — a real investigation depends entirely on the actual latency metrics and infrastructure for the target case.
