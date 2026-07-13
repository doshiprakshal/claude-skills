# Tempo Analysis

Analyzes traces in Grafana Tempo using TraceQL, adapted to Tempo's specific query language and its typical pairing with Grafana metrics/logs correlation.

See `SKILL.md` for the full workflow.

## How to invoke

- "Analyze this Tempo trace."
- "Write a TraceQL query for this."
- "Correlate this trace with our metrics in Grafana."

## Example

### Input

A Grafana dashboard shows a latency spike on `payments-api` around 14:32 UTC. Need to find and analyze traces from that window to understand the cause.

### Output (abbreviated)

> **TraceQL query used**
> ```
> { .service.name = "payments-api" && duration > 500ms }
> ```
> Scoped to the 14:30-14:35 UTC window in Tempo's search.
>
> **Trace summary**
> Found 8 matching traces in the window, all showing elevated duration concentrated in a single span: `http.client: POST https://fraud-check.internal/verify`.
>
> **Dominant span / pattern identified**
> The fraud-check downstream call is the dominant contributor in all 8 traces (durations 800ms-1.4s for that span alone, vs. ~50ms baseline visible in traces outside the spike window). This points at the fraud-check service itself being slow during this window, not `payments-api`'s own code.
>
> **Correlated context**
> Using Tempo's trace-to-metrics link on the `fraud-check.internal` span, the corresponding Prometheus metrics for that service show a CPU utilization spike starting at 14:31, aligning with the trace timing.
>
> **Recommended fix**
> The root cause is in `fraud-check.internal`, not `payments-api` — redirect investigation there (check what caused its CPU spike at 14:31). `payments-api`'s elevated latency is a downstream symptom.

This example is illustrative — a real analysis depends entirely on the actual traces and correlated data available in Tempo/Grafana.
