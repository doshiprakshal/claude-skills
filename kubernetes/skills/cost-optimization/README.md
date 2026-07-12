# Cost Optimization

Analyzes Kubernetes cluster/platform spend across compute commitment mix (on-demand/spot/reserved), storage, and network egress to find waste and recommend concrete, prioritized savings with impact estimates. Distinct from `resource-optimization` (per-workload CPU/memory rightsizing) — this is cluster/platform-level spend.

See `SKILL.md` for the full workflow this skill follows.

## How to invoke

- "Reduce our kubernetes costs."
- "Cost optimization review."
- "Are we wasting money on this cluster?"
- "Should we use spot instances?"

## Example

### Input

A cluster with: one node pool, 12 nodes, all `on-demand` (m5.2xlarge); 6 stateless, horizontally-scaled Deployments (all tolerate restarts, all have PDBs and 3+ replicas); 2 unattached PVCs from deleted workloads (200Gi total, `gp3` tier); a LoadBalancer Service with no active endpoints (leftover from a decommissioned app); cluster-wide average node CPU utilization of 28%.

### Output (abbreviated)

> **Cost inventory**
>
> | Category | Current state |
> |---|---|
> | Compute | 12x m5.2xlarge, 100% on-demand |
> | Node utilization | ~28% average CPU |
> | Storage | 2 orphaned PVCs, 200Gi `gp3` |
> | Network | No cost-allocation tags found — team-level breakdown unavailable |
> | Idle resources | 1 orphaned LoadBalancer |
>
> **Findings**
>
> - **Orphaned LoadBalancer** — `[High impact]` *(Confirmed)* — a `LoadBalancer` Service with zero backing endpoints is still provisioning a cloud load balancer. Evidence: Service has no matching ready pods. Est. savings: ~$18/month (typical ALB/NLB base cost) — delete it.
> - **Orphaned PVCs** — `[High impact]` *(Confirmed)* — 200Gi of `gp3` storage with no referencing pod or PVC-consuming workload. Est. savings: ~$16/month at `gp3` list pricing — confirm no longer needed, then delete.
> - **100% on-demand for stateless, replicated workloads** — `[Medium impact]` *(Likely)* — all 6 Deployments are stateless, run 3+ replicas, and have PDBs, suggesting strong spot-interruption tolerance. Est. savings: ~40-60% of the affected compute spend at typical spot discount rates — flagged as an estimate since actual spot pricing varies by AZ/time; migration requires validating the workloads handle `SIGTERM`/rescheduling gracefully first.
> - **Node pool utilization is low (28%)** — `[Medium impact]` *(Context-dependent)* — bin-packing looks loose; could indicate over-provisioned node count or headroom intentionally kept for burst capacity. Depends on whether the team has a stated burst-capacity policy — flagged rather than assumed wasteful.
>
> **Cannot verify**
> - No cost-allocation tags found, so a per-team/namespace spend breakdown isn't available — recommend adding labels for future reviews.
>
> **Prioritized recommendations**
> 1. Delete the orphaned LoadBalancer (High impact, zero effort, zero risk).
> 2. Confirm and delete the orphaned PVCs (High impact, zero effort, low risk — verify no longer needed first).
> 3. Migrate eligible stateless workloads to spot (Medium impact, moderate effort — validate graceful shutdown first).
> 4. Investigate node pool sizing vs. the 28% utilization (Medium impact, needs a stated burst policy to judge correctly).
>
> **Overall summary**
>
> ~$34/month in confirmed orphaned-resource waste (zero-risk to fix), plus a likely 40-60% compute savings opportunity on ~half the node pool if spot migration is validated. No cost-allocation tagging currently in place.

This example is illustrative — a real review depends entirely on the billing/utilization data actually available for the target cluster.
