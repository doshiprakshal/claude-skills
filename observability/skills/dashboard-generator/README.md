# Dashboard Generator

Generates a dashboard definition for a service — golden signals, dependency panels, and saturation metrics — from its available metrics and architecture.

See `SKILL.md` for the full workflow.

## How to invoke

- "Generate a dashboard for this service."
- "Create a Grafana dashboard for our API covering golden signals."
- "Build a dashboard for checkout-service including its dependencies."

## Example

### Input

Service: `checkout-service`, Prometheus metrics available: `http_requests_total{status,endpoint}`, `http_request_duration_seconds_bucket{endpoint}`, `db_query_duration_seconds_bucket`, `payments_service_call_duration_seconds_bucket`, `process_cpu_seconds_total`, `process_resident_memory_bytes`. Target: Grafana.

### Output (abbreviated)

> **Generated dashboard: `checkout-service`**
>
> **Row 1 — Golden Signals**
> - Request rate: `sum(rate(http_requests_total[5m])) by (endpoint)`
> - Error rate: `sum(rate(http_requests_total{status=~"5.."}[5m])) by (endpoint) / sum(rate(http_requests_total[5m])) by (endpoint)`
> - Latency p95/p99: `histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le, endpoint))`
>
> **Row 2 — Dependencies**
> - DB query latency p95: `histogram_quantile(0.95, sum(rate(db_query_duration_seconds_bucket[5m])) by (le))`
> - payments-service call latency p95: `histogram_quantile(0.95, sum(rate(payments_service_call_duration_seconds_bucket[5m])) by (le))`
>
> **Row 3 — Resource Saturation**
> - CPU usage: `rate(process_cpu_seconds_total[5m])`
> - Memory: `process_resident_memory_bytes`
>
> **Templating**: `$endpoint` variable derived from `label_values(http_requests_total, endpoint)`.
>
> **Note**: no error-rate metric was available for either dependency call (only duration) — dependency error panels were omitted; recommend adding a status/outcome label to both histograms so dependency error rate can be tracked, not just latency.

This example is illustrative — a real generated dashboard depends entirely on the actual metrics and naming convention available for the target service.
