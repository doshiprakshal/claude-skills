# GPU Cluster Optimization

Optimizes GPU cluster utilization and scheduling — allocation-vs-utilization gaps, fragmentation, sharing opportunities, and queueing/priority behavior.

See `SKILL.md` for the full workflow.

## How to invoke

- "Optimize our GPU cluster utilization."
- "Why are our GPUs underutilized?"
- "Should we share GPUs across workloads?"

## Example

### Input

Cluster has 20 GPUs, each statically assigned whole to one of 20 different small inference workloads. Utilization metrics show most workloads use under 20% of their assigned GPU's compute and memory. A batch training job queued with default priority is currently blocking a latency-sensitive inference workload from getting a GPU during a scheduled retraining window.

### Output (abbreviated)

> **Findings**
>
> - **Severe utilization gap: whole-GPU static allocation to low-utilization workloads** — `[High]` — 20 GPUs allocated whole to workloads using under 20% each represents substantial paid-for-but-unused capacity. Recommend GPU sharing (MIG partitioning or time-slicing) for these smaller inference workloads, potentially consolidating them onto a fraction of the current GPU count.
> - **Priority misconfiguration: batch job blocking latency-sensitive inference** — `[High]` — the batch training job and inference workload have equal default priority, allowing a non-urgent batch job to starve a latency-sensitive one. Configure priority/fair-share scheduling so inference workloads preempt or are prioritized over batch training jobs sharing the same pool.
>
> **Overall verdict**: consolidating the low-utilization inference workloads via GPU sharing is the highest-leverage change — at ~20% utilization each, this cluster likely has capacity to serve the same workloads on a meaningfully smaller GPU footprint, directly reducing cost. Fix the priority misconfiguration in parallel since it's an active reliability risk for the latency-sensitive workload.

This example is illustrative — a real optimization depends entirely on the actual utilization data and workload mix discovered.
