---
name: cost-optimization
description: Analyze Terraform-defined infrastructure for cost waste — oversized instance types relative to declared workload, missing reserved/spot opportunities, orphaned resources still in state, and storage tier mismatches — with estimated savings per finding. Triggers on "terraform cost optimization", "reduce our infrastructure costs", "review our terraform for cost waste", "are we overprovisioned".
user-invocable: true
---

# Terraform Cost Optimization

Analyze infrastructure defined in Terraform for cost waste — instance sizing, commitment mix, orphaned resources, and storage tier fit — with estimated savings per finding, similar in spirit to `kubernetes/cost-optimization` but at the cloud-resource level Terraform manages directly.

## When to use

- A cost review or FinOps initiative covering Terraform-managed infrastructure.
- The user asks whether they're overprovisioned or wasting spend.

**Out of scope**:
- Kubernetes workload-level cost (once workloads run on top of Terraform-provisioned infra) → `kubernetes/cost-optimization`
- Performance implications of sizing choices → `performance-review`

## Inputs

- All `.tf` files defining compute, storage, and networking resources.
- Terraform state or plan output, to see actual current resource configuration (not just what's in code, which may have drifted — cross-reference `drift-analysis` if relevant).
- Usage/billing data, if available.

## Workflow

### 1. Discover

Gather compute, storage, and networking resource definitions and, if available, actual usage/billing data.

### 2. Checks

- **Oversized instance types** — instance/machine types declared far larger than what the resource's apparent role or (if available) observed utilization suggests.
- **Commitment mix** — compute running 100% on-demand with no reserved instances/savings plans/committed-use discounts for stable, long-running baseline workloads; conversely, reserved commitments sized against workloads that have since shrunk.
- **Orphaned resources in state** — resources still tracked in state with no apparent active reference/purpose (e.g., an old load balancer, an unattached volume) — flag for confirmation before removal.
- **Storage tier mismatches** — storage class/tier (e.g., premium SSD) used for data with an access pattern that doesn't need it; missing lifecycle policies on object storage that could tier down or expire old data.
- **Idle/unused resources** — NAT gateways, load balancers, or managed databases provisioned but with no evident traffic/usage.

### 3. Report

Findings with estimated savings (explicitly marked as estimates, citing the pricing basis), grouped by Compute Sizing, Commitment Mix, Orphaned Resources, Storage Tiering. Prioritized by savings-to-effort ratio.

## Notes

- Every savings estimate must cite its pricing basis and be marked as an estimate — never present a number as guaranteed without real billing data.
- Orphaned-resource findings are the highest-confidence, lowest-risk wins — surface those first.
