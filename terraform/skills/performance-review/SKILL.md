---
name: performance-review
description: Review Terraform-managed infrastructure for performance bottlenecks — undersized compute/database resources, missing autoscaling/read-replica configuration, and network topology choices adding avoidable latency. Distinct from cost-optimization (spend) and architecture-review (topology/isolation). Triggers on "terraform performance review", "why is our infrastructure slow", "review our terraform for performance bottlenecks", "are we undersized".
user-invocable: true
---

# Terraform Performance Review

Review infrastructure defined in Terraform for performance bottlenecks — sizing, scaling configuration, and topology-induced latency. Distinct from `cost-optimization` (which looks at the same resources from a spend angle) and `architecture-review` (topology/isolation, not performance specifically).

## When to use

- Investigating or preventing infrastructure-level performance issues.
- The user asks whether their resources are undersized or their topology adds unnecessary latency.

**Out of scope**:
- Cost implications of sizing choices → `cost-optimization`
- Application-level performance (code, queries) — out of scope entirely for this Terraform-focused skill

## Inputs

- Compute/database/cache resource definitions and their sizing.
- Autoscaling configuration (or absence of it) for scalable resources.
- Network topology (region/AZ placement of dependent resources relative to each other).
- Usage/performance metrics, if available.

## Workflow

### 1. Discover

Gather sizing, scaling config, and topology for compute/database/network resources.

### 2. Checks

- **Undersized resources relative to stated/observed load** — instance types, database instance classes, or cache node sizes that look too small for their apparent role, especially if usage data shows sustained high utilization.
- **Missing autoscaling/read replicas** — a resource capable of scaling (ASG, database read replicas) with no scaling configuration at all, relying on a single fixed-size instance for variable load.
- **Cross-AZ/cross-region latency from topology choices** — dependent resources (app tier, database, cache) placed in different AZs/regions from each other with no clear reason, adding avoidable network latency to every request.
- **Missing caching layer** — a database taking direct load that a cache (Redis/Memcached/CDN) could offload, if the workload's access pattern suggests it would help.
- **Connection pooling/limits** — database connection limits or pool sizing that could bottleneck under real concurrency.

### 3. Report

Findings grouped by Sizing, Scaling, Topology Latency, Caching, Connection Limits, each with severity and specific fix.

## Notes

- Don't recommend a specific new instance size without usage data backing it — flag the concern and recommend gathering utilization data if none is available, rather than guessing a number.
- Cross-AZ placement is sometimes intentional for availability, trading a small latency cost for resilience — weigh this tradeoff explicitly rather than assuming co-location is always better.
