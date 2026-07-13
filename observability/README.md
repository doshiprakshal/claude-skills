# Observability Skills

Planned: 20 skills. 20 built so far.

Each skill lives in its own subfolder under [`skills/`](./skills) with a `SKILL.md` (instructions Claude follows when the skill runs) and a `README.md` (what it does, how to invoke it, and a worked example).

## Built

| Skill | What it does |
|---|---|
| [`grafana-dashboard-review`](./skills/grafana-dashboard-review) | Reviews existing dashboards for layout, query correctness, and signal clarity. |
| [`prometheus-review`](./skills/prometheus-review) | Query/rule correctness and cardinality-explosion risk. |
| [`alert-review`](./skills/alert-review) | Whether an alert would actually fire and page the right thing. |
| [`alert-fatigue-analysis`](./skills/alert-fatigue-analysis) | Volume/noise analysis across an alert set to find fatigue sources. |
| [`recording-rules-review`](./skills/recording-rules-review) | Whether recording rules are needed, correct, and not redundant. |
| [`opentelemetry-review`](./skills/opentelemetry-review) | SDK/collector configuration, sampling strategy, exporter setup. |
| [`jaeger-trace-analysis`](./skills/jaeger-trace-analysis) | Diagnoses a specific trace or trace pattern in Jaeger. |
| [`tempo-analysis`](./skills/tempo-analysis) | Diagnoses trace data and TraceQL usage in Grafana Tempo. |
| [`loki-review`](./skills/loki-review) | Label design, cardinality, and LogQL query efficiency. |
| [`splunk-analysis`](./skills/splunk-analysis) | SPL query design/optimization and index/ingestion cost review. |
| [`datadog-review`](./skills/datadog-review) | Monitor design, APM setup, and custom-metrics/log-ingestion cost. |
| [`slo-review`](./skills/slo-review) | Whether an SLI/target/measurement is meaningful and achievable. |
| [`error-budget-review`](./skills/error-budget-review) | Burn-rate alert math and whether the error budget policy has teeth. |
| [`metrics-coverage`](./skills/metrics-coverage) | Golden-signal and dependency instrumentation gap analysis. |
| [`logging-coverage`](./skills/logging-coverage) | Error-path context, level discipline, and correlation field gaps. |
| [`tracing-coverage`](./skills/tracing-coverage) | End-to-end context propagation gaps across service boundaries. |
| [`dashboard-generator`](./skills/dashboard-generator) | Generates a new dashboard definition from available metrics. |
| [`incident-dashboard`](./skills/incident-dashboard) | Assembles a focused, incident-specific panel view for fast triage. |
| [`monitoring-audit`](./skills/monitoring-audit) | Holistic posture audit — coverage balance, ownership, staleness. |
| [`observability-architecture`](./skills/observability-architecture) | Reviews/designs the overall metrics/logs/traces pipeline and tooling. |
