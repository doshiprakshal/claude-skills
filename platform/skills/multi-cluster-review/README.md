# Multi-Cluster Review

Reviews multi-cluster Kubernetes architecture and fleet management — topology rationale, configuration consistency, workload placement, and cross-cluster failover.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our multi-cluster architecture."
- "How should we manage configuration consistency across our clusters?"
- "Assess our cross-cluster failover strategy."

## Example

### Input

Fleet has 8 clusters: one per (region × environment) combination, i.e., 2 regions × 4 environments (dev/staging/prod/sandbox). Baseline RBAC and network policy config is applied manually by platform engineers running scripts per-cluster; a recent audit found 2 of the 8 clusters missing a network policy update applied to the other 6 three months ago. No documented or tested cross-region failover process exists for production workloads.

### Output (abbreviated)

> **Findings**
>
> - **Manual per-cluster config propagation has already drifted** — `[High]` — 2 of 8 clusters are confirmed missing a 3-month-old network policy update, demonstrating the manual process doesn't reliably keep the fleet consistent. Recommend adopting a GitOps-based fleet configuration tool (e.g., a cluster-fleet management addon) that applies baseline config declaratively and can detect/alert on drift, rather than relying on manual script runs.
> - **No tested cross-region failover for production** — `[High]` — with 2 production regions but no tested failover process, an actual regional incident would require improvising a failover path under pressure rather than executing a known-working procedure. Recommend a controlled failover test.
> - **Topology rationale (region × environment)** — reasonable and deliberate; no finding here.
>
> **Overall verdict**: the configuration drift is a confirmed, already-occurred problem and should be fixed first via a fleet-management tool; the untested failover capability is a latent risk that should be validated before it's needed during a real incident.

This example is illustrative — a real review depends entirely on the actual cluster fleet topology and management approach discovered.
