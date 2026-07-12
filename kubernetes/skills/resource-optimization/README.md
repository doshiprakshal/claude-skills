# Resource Optimization

Right-sizes Kubernetes workloads' CPU/memory requests and limits by comparing current configuration against actual observed usage (p50/p95/p99), recommending concrete new values backed by data — not just flagging missing requests/limits (that's `production-readiness-review`).

See `SKILL.md` for the full workflow this skill follows.

## How to invoke

- "Right-size my workloads."
- "Are our resource requests correct?"
- "Why is this pod throttling?"
- "Our nodes are under-packed."

## Example

### Input

Three workloads with current config, plus 14 days of Prometheus usage data:

| Workload | Request (CPU/Mem) | Limit (CPU/Mem) | p50 usage | p95 usage | p99 usage |
|---|---|---|---|---|---|
| `api` | 500m / 512Mi | 500m / 512Mi | 480m / 490Mi | 620m / 505Mi | 690m / 510Mi |
| `worker` | 2000m / 4Gi | 4000m / 8Gi | 150m / 300Mi | 220m / 340Mi | 260m / 360Mi |
| `batch-job` | 100m / 256Mi | 200m / 512Mi | 90m / 240Mi | 1800m / 1.9Gi | 2100m / 2.1Gi |

### Output (abbreviated)

> **Per-workload table** — *(shown above as Input; included in the real report too)*
>
> **Findings**
>
> - `api`: CPU limit equals request (500m) — QoS is `Guaranteed` on CPU, but p95/p99 usage (620–690m) already exceeds the limit. This workload is being **throttled today** — confirmed via `container_cpu_cfsthrottled_seconds_total` > 0 over the window.
> - `worker`: request (2000m CPU / 4Gi mem) is far above p99 usage (260m / 360Mi) — roughly 8x over-provisioned on CPU, 10x on memory.
> - `batch-job`: p50 usage is low (90m) but p99 spikes to 2100m/2.1Gi — current limit (200m/512Mi) is far below its own p99, meaning it OOMKills or gets heavily throttled during its actual peak phase.
>
> **Recommendations**
>
> - **`api`** — raise limit to ~800m CPU / 550Mi memory (headroom above p99 of 690m/510Mi). *(Confirmed — 14-day window)*
> - **`worker`** — lower request to ~300m CPU / 400Mi memory, limit to ~500m CPU / 500Mi memory (headroom above p99 of 260m/360Mi). *(Confirmed — 14-day window)*
> - **`batch-job`** — raise both request and limit substantially: request ~400m CPU / 512Mi memory, limit ~2500m CPU / 2.5Gi memory, since its usage is genuinely spiky rather than steady — a flat request near p50 would keep it starved during its real workload phase. *(Confirmed — 14-day window)*
>
> **Cannot verify**
> - None in this example — usage data was available for all three workloads over a representative 14-day window.
>
> **Overall summary**
>
> 1 of 3 workloads (`api`) is actively throttling today — Blocker. `worker` is over-provisioned by roughly 8–10x — Medium (waste, not risk). `batch-job` is under-provisioned relative to its own peak — High (risks OOM/throttling during real load, masked by a low p50).

This example is illustrative — a real review depends entirely on the usage data actually available for the target workloads.
