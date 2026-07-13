---
name: gpu-cluster-optimization
description: Optimize GPU cluster utilization and scheduling — allocation efficiency, fragmentation, queueing behavior, and multi-tenancy/sharing strategy, distinct from any single model-serving framework's configuration. Triggers on "optimize our gpu cluster utilization", "why are our gpus underutilized", "review our gpu scheduling and allocation strategy", "should we share gpus across workloads".
user-invocable: true
---

# GPU Cluster Optimization

Optimize GPU cluster utilization and scheduling — allocation efficiency, fragmentation, and multi-tenancy strategy.

## When to use

- GPU utilization is low or unclear, or scheduling/allocation strategy needs review.

**Out of scope**:
- A specific serving framework's own batching/throughput tuning → `model-serving-review`, `vllm-review`, `tensorrt-llm-review`
- Kubernetes-level autoscaling mechanics generally (as opposed to GPU-specific scheduling) → `kubernetes/autoscaling-review`

## Inputs

- GPU utilization metrics (per-GPU, over time) across the cluster.
- Current allocation/scheduling mechanism (static assignment, Kubernetes device plugin, MIG partitioning, a scheduler like Slurm/Ray).
- Workload mix (training vs. inference, batch vs. real-time, model sizes).

## Workflow

### 1. Discover

Gather GPU utilization metrics per device and the current allocation/scheduling approach.

### 2. Checks

- **Utilization vs. allocation gap** — GPUs allocated to a workload but sitting mostly idle (low actual compute utilization despite being reserved) — a common pattern with static allocation to bursty or low-traffic workloads, representing paid-for-but-unused capacity.
- **Fragmentation** — memory or compute fragmentation across GPUs prevents scheduling a workload that would otherwise fit if resources were consolidated — common with rigid, whole-GPU-only allocation for workloads that don't need a full GPU.
- **Sharing/partitioning opportunity** — for workloads that don't need a full GPU's compute/memory (e.g., smaller inference workloads), check whether GPU sharing mechanisms (MIG, time-slicing, or an inference-serving framework's own multi-model support) are used where appropriate, rather than defaulting every workload to whole-GPU allocation.
- **Queueing behavior** — for shared/scheduled clusters, check queue wait times and whether scheduling policy (priority, fair-share) matches actual business priority — a low-priority batch job blocking a latency-sensitive inference workload's access to GPUs is a common misconfiguration.
- **Right-sizing per workload** — workloads are matched to appropriately-sized GPU types (not defaulting every workload to the largest/most expensive GPU available regardless of actual need).

### 3. Report

Findings grouped by Utilization Gap, Fragmentation, Sharing Opportunity, Queueing/Priority, Right-Sizing, each with severity and estimated efficiency/cost impact.

## Notes

- Low utilization is often a scheduling/allocation problem, not a workload problem — always check whether static over-allocation or fragmentation is the actual cause before concluding a workload simply doesn't need much GPU.
- GPU sharing mechanisms (MIG, time-slicing) trade some isolation/performance predictability for utilization efficiency — recommend them for workloads where that tradeoff is acceptable (many smaller inference workloads), not universally.
