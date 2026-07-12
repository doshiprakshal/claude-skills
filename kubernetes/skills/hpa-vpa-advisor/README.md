# HPA/VPA Advisor

Recommends concrete HPA/VPA/KEDA configuration for workloads — including ones with no autoscaling yet — based on usage variance and traffic character, or explicitly recommends against autoscaling when it isn't warranted.

See `SKILL.md` for the full workflow.

## How to invoke

- "Should `worker` have an HPA?"
- "Recommend autoscaling config for our services."
- "What autoscaling settings should we use for `image-processor`?"

## Example

### Input

Three workloads, no autoscaling configured on any:
- `static-site-renderer` — 14-day usage graph shows nearly flat CPU (28-32% consistently, no meaningful variance).
- `checkout-api` — 14-day usage shows clear daily peaks (business hours, 3x trough-to-peak) correlated with customer traffic.
- `image-processor` — consumes from a queue; usage is zero most of the time, spikes heavily whenever a batch of images arrives.

### Output (abbreviated)

> **Per-workload recommendation table**
>
> | Workload | Recommendation | Confidence |
> |---|---|---|
> | `static-site-renderer` | No autoscaling — keep a fixed replica count | Confirmed (14-day data, flat usage) |
> | `checkout-api` | HPA, CPU-based, target 60% utilization, min 3 / max 10 | Confirmed (14-day data, clear 3x daily variance) |
> | `image-processor` | KEDA, queue-length scaler, scale-to-zero when idle | Confirmed (14-day data, clear idle-then-spike pattern) |
>
> **Rationale per recommendation**
> - `static-site-renderer`: usage sits in a narrow 28-32% band with no daily/weekly pattern — adding HPA here would add operational complexity (another thing to monitor, another failure mode) without any real benefit. A fixed replica count matched to the observed steady load is simpler and equally effective.
> - `checkout-api`: clear, repeating 3x peak-to-trough daily pattern correlated with business hours — CPU-based HPA fits well; bounds set with headroom above the observed peak.
> - `image-processor`: usage is genuinely event-driven (zero between batches, sharp spikes on arrival) — CPU-based HPA would react too slowly and doesn't capture "queue has work" as a signal. KEDA's queue-length scaler (with scale-to-zero) matches the actual trigger directly, at the cost of a cold-start delay on the first item of each batch — worth confirming that's acceptable for this workload's latency tolerance.
>
> **Confidence**
> All three recommendations are Confirmed — backed by a full 14-day usage window covering multiple traffic cycles for each workload.

This example is illustrative — a real recommendation depends entirely on the actual usage data available for the target workloads.
