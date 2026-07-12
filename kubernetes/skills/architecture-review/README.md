# Architecture Review

Reviews a Kubernetes platform's overall architecture — cluster topology, multi-tenancy model, service communication, scaling strategy, and disaster-recovery posture — to judge whether the system's shape is right for its stated scale and reliability goals. Not whether individual manifests are correct (that's `production-readiness-review`); this is whiteboard-level design review.

See `SKILL.md` for the full workflow this skill follows.

## How to invoke

- "Review our kubernetes architecture."
- "Is our cluster topology sound for where we're headed?"
- "Should we split into multiple clusters?"
- "Review our multi-tenancy model."

## Example

### Input

A platform description: one EKS cluster in `us-east-1`, two namespaces (`team-a`, `team-b`) each running several Deployments, no NetworkPolicies in either namespace, an Istio mesh installed in permissive mTLS mode, ArgoCD managing deployments from a single `main` branch with no staging environment, and a stated requirement of "must survive a full region outage with under 1 hour of downtime (RTO)."

### Output (abbreviated)

> **Platform inventory**
>
> | Item | Value |
> |---|---|
> | Clusters | 1 (`us-east-1` only) |
> | Namespaces/tenants | 2 (`team-a`, `team-b`) — shared cluster |
> | Shared services | Istio (permissive mTLS), ArgoCD (single `main` branch) |
> | Autoscaling | Cluster Autoscaler present; HPA on 4 of 11 Deployments |
> | DR mechanism | None visible — single region, no cross-region replication found |
>
> **Findings**
>
> **ARCH-001 — No disaster recovery path for a stated 1-hour RTO** &nbsp;`[Blocker]` &nbsp;*(Confirmed)*
> - Finding: the platform runs in a single region (`us-east-1`) with no cross-region cluster, replication, or failover mechanism found.
> - Why it matters: a full region outage would exceed the stated 1-hour RTO by an unbounded margin — there is currently no path to recover in another region at all.
> - Evidence: cluster inventory shows one cluster, one region; no multi-region Terraform/cluster config found.
> - Recommended direction: this is a roadmap item, not a config fix — decide between active-passive (standby cluster + data replication) and active-active, sized to the 1-hour RTO.
>
> **ARCH-002 — Tenancy isolation is name-only** &nbsp;`[High]` &nbsp;*(Confirmed)*
> - Finding: `team-a` and `team-b` share a cluster with no NetworkPolicies in either namespace.
> - Why it matters: either team's compromised or misbehaving workload can reach the other's services with no network-layer boundary — the namespace split provides organizational, not security, isolation.
> - Evidence: no `NetworkPolicy` objects found in either namespace.
> - Recommended direction: add default-deny NetworkPolicies per namespace with explicit allow-lists, or escalate to `security-review` for the RBAC side of this gap too.
>
> **ARCH-003 — Istio running in permissive mTLS platform-wide** &nbsp;`[Medium]` &nbsp;*(Context-dependent)*
> - Finding: mesh-wide `PeerAuthentication` is set to `PERMISSIVE`.
> - Why it matters: permissive mode accepts both plaintext and mTLS traffic, so any workload can bypass encryption — this often starts as a migration step but is left in place indefinitely.
> - Evidence: `PeerAuthentication` resource, mesh-wide scope.
> - Recommended direction: confirm whether this is an intentional in-progress migration; if not, move to `STRICT` mode namespace-by-namespace.
>
> **ARCH-004 — No staging environment before production**  &nbsp;`[Medium]` &nbsp;*(Confirmed)*
> - Finding: ArgoCD deploys directly from `main` to what appears to be the only environment.
> - Why it matters: there's no environment parity check before changes reach production — every merge is a direct production change.
> - Evidence: single ArgoCD `Application` targeting one cluster/namespace set, no staging `Application` found.
> - Recommended direction: introduce at least one pre-production environment fed by the same GitOps pipeline before merging to `main` promotes further.
>
> **Prioritized recommendations**
>
> 1. Define and build a DR strategy for the 1-hour RTO (ARCH-001) — sequence this before any further tenant onboarding, since more tenants increase what's at risk in an outage.
> 2. Close the tenancy isolation gap (ARCH-002) — independent of DR work, can proceed in parallel.
> 3. Resolve the mTLS mode question (ARCH-003) once isolation work clarifies the real trust boundary.
> 4. Add a staging environment (ARCH-004) — lower urgency, but do this before the DR failover path is built so the failover path itself can be tested safely.
>
> **Overall architecture verdict**
>
> ⚠️ Not sound for the stated reliability requirement — the platform has no way to meet a 1-hour regional RTO today, and tenancy isolation is weaker than the namespace split implies. Scaling strategy and delivery pipeline are workable for current scale but should be revisited alongside the DR work.

This example is illustrative — a real review depends entirely on what's actually discovered in the target platform.
