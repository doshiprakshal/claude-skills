---
name: resource-optimization
description: Right-size Kubernetes workloads' CPU/memory requests and limits by comparing current configuration against actual observed usage (p50/p95/p99), recommending concrete new values backed by data — not just flagging missing requests/limits. Triggers on "right-size my workloads", "are our resource requests correct", "optimize kubernetes resource usage", "why is this pod throttling", "our nodes are under-packed", "resource optimization review".
user-invocable: true
---

# Kubernetes Resource Optimization

Right-size workloads' CPU/memory requests and limits based on real observed usage, not just static config sanity. This is ongoing tuning against actual data — distinct from `production-readiness-review`'s one-time "are requests/limits set at all" check.

## When to use

- A periodic capacity/rightsizing pass, often prompted by a cost review or node-pressure incidents.
- The user asks why a pod is throttling, OOMKilling, or why nodes seem under-packed.
- Following up on VPA/Goldilocks-style recommendations to validate or refine them.

**Out of scope** — defer instead:
- Whether requests/limits exist at all → `production-readiness-review`
- Cluster-wide cost/spend analysis → `cost-optimization`
- HPA configuration itself → `autoscaling-review`
- Node pool/instance-type selection → `cost-optimization` / `architecture-review`

## Inputs

- Manifest set with current requests/limits per container.
- Historical usage data if available — metrics-server/Prometheus percentiles (p50/p95/p99 CPU and memory) over a representative window (7–30 days is typical; shorter windows are less reliable).
- `VerticalPodAutoscaler` recommendations if one is deployed in `Recommender` mode.
- Node capacity/allocatable info, if bin-packing matters to the recommendation.
- Any stated SLOs affecting acceptable headroom.

If no usage data source is available, say so explicitly and scope the review down to static config sanity only (QoS class implications, obviously mismatched request:limit ratios) — do not invent usage numbers.

## Workflow

### 1. Discover and gather usage data

Find the manifests and, critically, ask for or locate a usage data source (metrics-server, Prometheus/Grafana, cloud provider monitoring) and a representative time window. This is one of the few skills in this domain where real data — not just static config — is essential to a correct recommendation.

### 2. Build the per-workload usage table

For each container: current CPU/memory request and limit, alongside observed p50/p95/p99 CPU and memory usage over the window. Note current QoS class (Guaranteed/Burstable/BestEffort) implied by the configuration.

### 3. Deterministic checks

Tagged **Passed** / **Failed** / **Cannot verify**:
- Requests and limits are present (cross-reference only — presence itself is `production-readiness-review`'s check; this skill focuses on whether the *values* are right).
- Usage data was actually available and covers a representative window (flag short/noisy windows rather than treating them as reliable).
- Visible CPU throttling (`container_cpu_cfsthrottled_seconds_total` or equivalent) or memory-related OOMKills in pod restart history, if the data source exposes them.

### 4. Reasoning checks

- Is the current request too low relative to observed p95/p99 usage — risking throttling or OOM under real load?
- Is the current request too high relative to usage — wasting capacity and hurting bin-packing?
- Is the limit-to-request ratio appropriate for this workload's burstiness (a spiky batch job needs a different ratio than a steady-state API)?
- Would a recommended change shift the workload's QoS class in a way that changes eviction behavior under node pressure — and is that shift acceptable given the workload's criticality?

Classify confidence:
- **Confirmed** — backed by usage data over a representative window.
- **Likely** — usage data exists but the window is short or noisy.
- **Context-dependent** — no usage data at all; recommendation (if any) is based on static config sanity only, and must be flagged as such rather than presented as data-backed.

### 5. Recommend

For each workload needing a change, recommend concrete new request/limit values with the specific percentile and window that justifies them. Never propose a number without citing the data behind it.

### 6. Severity assignment

- **Blocker** — actively OOMKilling or throttling badly enough to affect availability today.
- **High** — meaningful risk under realistic load — headroom is too thin relative to observed spikes.
- **Medium** — real waste (over-provisioned), not currently causing incidents.
- **Advisory** — minor rightsizing opportunity, low impact either way.

### 7. Report

1. **Per-workload table** — current request/limit vs. observed p50/p95/p99, with QoS class.
2. **Findings** — throttling/OOM incidents found, with evidence (metric name, value, window).
3. **Recommendations** — new request/limit values per workload, each citing the percentile/window behind it, tagged with confidence.
4. **Cannot verify** — workloads with no usage data available; scoped to static-only observations.
5. **Overall summary** — e.g., "6 of 14 workloads over-provisioned by >50% CPU; 2 under-provisioned and throttling today; 3 workloads have no usage data available."

## Notes

- Never recommend a number without the usage data behind it — if there's no data, say so and don't guess.
- Watch for QoS class side effects: moving a workload out of `Guaranteed` (by making request ≠ limit) changes its eviction priority under node pressure — call this out when a recommendation would cause it.
- Short or unrepresentative usage windows (e.g., a workload observed only during a quiet period) should lower confidence, not be treated as ground truth.
