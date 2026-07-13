---
name: tempo-analysis
description: Analyze traces in Grafana Tempo using TraceQL — the same trace-diagnosis workflow as jaeger-trace-analysis, adapted to Tempo's query language and its typical pairing with Grafana metrics/logs correlation. Triggers on "analyze this tempo trace", "write a traceql query for this", "tempo trace analysis", "correlate this trace with our metrics in grafana".
user-invocable: true
---

# Tempo Analysis

Analyze traces in Grafana Tempo using TraceQL — the same diagnostic goal as `jaeger-trace-analysis`, adapted to Tempo's specific query language and its common pairing with Grafana's metrics/logs correlation features (exemplars, trace-to-logs).

## When to use

- Diagnosing a slow/errored trace stored in Tempo specifically.
- The user wants a TraceQL query written for a specific trace-search need.

**Out of scope**:
- Jaeger-specific analysis (different tooling, same underlying diagnostic approach) → `jaeger-trace-analysis`
- Overall tracing coverage → `tracing-coverage`

## Inputs

- A trace ID, or a TraceQL search need (find traces matching certain span attributes/duration).
- If correlating with metrics/logs: the relevant Grafana dashboard/exemplar context.

## Workflow

### 1. Retrieve or search

If given a trace ID, retrieve it directly. If searching, construct a TraceQL query targeting the specific characteristic needed (e.g., `{ .service.name = "checkout-api" && duration > 1s }` for slow traces on a specific service).

### 2. Analyze the span tree

Same core analysis as `jaeger-trace-analysis`: dominant span, serialization vs. parallelism, N+1 patterns, error origin span, unexpected gaps.

### 3. Leverage Grafana correlation if relevant

If the investigation started from a metrics anomaly (via an exemplar linking a metric spike to specific traces) or needs log correlation, use Tempo's trace-to-logs/trace-to-metrics linking to pull in the corresponding log lines or metric context for the same time window — this cross-signal correlation is a distinctive strength of the Tempo+Grafana combination worth using explicitly.

### 4. Report

1. **Trace summary / TraceQL query used** (if search-based, include the query for reproducibility).
2. **Dominant span / pattern identified** — same analysis depth as `jaeger-trace-analysis`.
3. **Correlated context** — any relevant logs/metrics pulled in via Tempo's correlation features.
4. **Recommended fix**.

## Notes

- TraceQL syntax differs meaningfully from Jaeger's search UI — always show the actual query used so it's reproducible and refinable.
- The metrics/logs/traces correlation available in a Grafana+Tempo+Loki+Prometheus stack is a real differentiator — use it when the investigation would benefit from cross-signal context, not just the trace in isolation.
