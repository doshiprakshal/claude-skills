---
name: architecture-review
description: Review a Kubernetes platform's overall architecture — cluster topology, multi-tenancy model, service communication, scaling strategy, and disaster-recovery posture — to judge whether the system's shape is right for its stated scale and reliability goals, not whether individual manifests are correct. Triggers on "review our kubernetes architecture", "is our cluster architecture sound", "architecture review for our k8s platform", "should we split into multiple clusters", "review our multi-tenancy model".
user-invocable: true
---

# Kubernetes Architecture Review

Review how a Kubernetes-based platform is architected at the structural level — cluster topology, tenancy model, service communication, scaling strategy, disaster recovery — the way a Staff/Principal SRE or Platform Architect would in a design review or ADR review. This answers "is this the right shape of system for what it needs to do," not "is this manifest correct" (that's `production-readiness-review`).

## When to use

- Reviewing a proposed or existing platform architecture before committing to it or scaling it further.
- Evaluating an Architecture Decision Record (ADR) or platform health check.
- The user asks whether their cluster topology, tenancy model, or scaling/DR strategy is sound.

**Out of scope** — defer to the specialist skill instead:
- Per-workload manifest correctness and operational readiness → `production-readiness-review`
- YAML/schema validity → `manifest-validation`
- RBAC least-privilege audit, image scanning, secrets handling specifics → `security-review`
- Line-item cost analysis → `cost-optimization`
- HPA/VPA metric tuning details → `autoscaling-review`
- Affinity/scheduling specifics for individual workloads → `scheduling-review`
- NetworkPolicy rule-level correctness → `networking-review`
- StorageClass/PVC specifics → `storage-review`

This skill sits above those: it asks whether the overall shape is right and defers implementation-level correctness to them.

## Inputs

Gather (by discovery first, asking only for what can't be inferred):

- Cluster topology: cluster count, regions/zones, cloud provider(s), managed vs. self-hosted control plane.
- Multi-tenancy model: how teams/workloads are isolated (namespace-per-team, cluster-per-env, shared cluster).
- Full manifest/Helm/Kustomize set across the platform — same discovery approach as `production-readiness-review` (raw YAML, rendered Helm, rendered Kustomize), but aggregated across the whole platform rather than one application.
- Ingress/egress architecture: ingress controller(s), service mesh (if any), API gateway, DNS strategy.
- Stated or inferable scale trajectory and peak load.
- Reliability requirements: SLA/SLO, DR expectations (RTO/RPO), multi-region needs.
- CI/CD and GitOps setup — how code reaches the cluster.
- Existing ADRs/architecture docs, if any.

## Workflow

### Phase 0 — Discover

Inspect the repo/cluster context given. Find cluster/infra-as-code definitions (Terraform, eksctl, cluster API manifests), GitOps app definitions (ArgoCD `Application`/Flux `Kustomization` CRs), and the full manifest set across namespaces/teams. Do not ask the user for this before attempting discovery — only ask when something genuinely can't be found and its absence would change a finding.

### Phase 1 — Build the platform inventory

Summarize before analyzing:
- Clusters (count, region/zone spread, managed vs. self-hosted)
- Namespaces/tenants and what isolates them
- Shared platform services (ingress controllers, service mesh, cert-manager, external-dns, monitoring stack) and their replica counts
- Autoscaling mechanisms in use (HPA/VPA/KEDA/Cluster Autoscaler/Karpenter) and where
- DR mechanisms visible (backup tooling, multi-region setup, etcd backup config for self-managed control planes)
- Deployment pipeline (GitOps controller present, or imperative kubectl/Helm from CI)

### Phase 2 — Deterministic checks

Objective, verifiable facts, tagged **Passed** / **Failed** / **Cannot verify**:
- Declared tenancy boundaries exist as actual RBAC/NetworkPolicy config (not just namespace names implying isolation).
- A cluster/node-pool autoscaling mechanism exists given HPAs that could exceed current node capacity.
- Multiple AZs are actually in use by node pools, not just claimed.
- PDBs/topology spread constraints exist as a systemic, platform-wide pattern (this skill checks the pattern across the platform; per-workload gaps are `production-readiness-review`'s job).
- A GitOps controller (ArgoCD/Flux) is present, vs. purely imperative deploys with no reconciliation.
- Shared platform services (ingress, cert-manager, external-dns) run more than one replica.
- etcd backups are configured for self-managed clusters, if applicable and visible.

### Phase 3 — Reasoning checks

This is where engineering judgment replaces checklist matching. Reason through:
- Does the tenancy model match the org's actual trust boundaries — is soft multi-tenancy (shared cluster, namespace isolation) being used where hard isolation (separate clusters/node pools) is actually required?
- Does cluster count/topology match real blast-radius and compliance needs, or is it needlessly fragmented or needlessly consolidated?
- Does a service mesh (if present) solve a real problem here, or add operational overhead without a corresponding benefit given the team's actual traffic patterns and operational maturity?
- Does "we have backups" actually mean a restore has been tested? Does a single-region "HA" setup survive a full regional outage, matching the stated RTO/RPO?
- Will the scaling architecture hold under the *stated growth trajectory*, not just current load?
- Is there genuine environment parity (dev → staging → prod), or does production quietly drift from what's tested elsewhere?
- Are shared platform services still architected for the platform's current scale, or were they sized for a much smaller original deployment and never revisited?
- Does the architecture match the team's actual operational maturity — e.g., a mesh nobody on the team can debug is a liability, not an asset, regardless of its theoretical benefits.

For every reasoning-based finding, classify confidence honestly:
- **Confirmed** — directly observed in the inventory/config.
- **Likely** — strongly implied by available evidence but not fully confirmed (e.g., no evidence a backup restore was ever tested → "DR is likely untested," not "DR is broken").
- **Context-dependent** — correctness depends on information not provided (team size, compliance regime, growth forecast). State the assumption you're making explicitly, and ask only if the answer would change the verdict.

Never assume a pattern is wrong just because it deviates from a textbook default — e.g., a single cluster is not automatically wrong, a shared namespace is not automatically wrong. Judge against this platform's actual stated (or reasonably inferred) requirements.

### Phase 4 — Severity assignment

Assign one severity per finding, calibrated to architectural blast radius (not per-workload blast radius — that scale belongs to `production-readiness-review`):
- **Blocker** — the architecture cannot meet a stated hard requirement today (e.g., claimed multi-region DR doesn't actually exist).
- **High** — works today but won't hold under stated growth or a plausible failure mode (zone loss, team/traffic scaling).
- **Medium** — workable, but creates ongoing operational friction or cost.
- **Advisory** — a valid alternative exists; no urgency.

Give every finding a stable ID (`ARCH-001`, `ARCH-002`, ...).

### Phase 5 — Report

Produce, in this order:

1. **Platform inventory** — clusters, tenants/namespaces, shared services, autoscaling mechanisms, DR mechanisms, deployment pipeline.
2. **Findings by theme** — group under Tenancy & Isolation, Networking & Service Communication, Scaling & Capacity, Disaster Recovery, Delivery Pipeline. Each finding: ID, title, severity, confidence, evidence (what it's based on — an observed config, a stated requirement, or an explicitly flagged assumption), why it matters, and recommended direction. Architectural findings often imply a migration/roadmap item, not a one-line fix — say so when that's the case.
3. **Prioritized recommendations** — a sequenced list (not just severity-sorted; note real dependencies, e.g., "fix the DR story before further scaling the tenant count").
4. **Overall architecture verdict** — one summary judgment for the whole platform, e.g., "Sound for current scale, at risk beyond 3x current traffic" or "Tenancy isolation is name-only — treat as shared-trust until namespace RBAC/NetworkPolicy gaps are closed."

## Notes

- Every finding must cite its source — an observed config, a stated requirement, or an explicitly flagged assumption. Never assert a finding without a traceable basis.
- Don't apply generic best-practice defaults blindly (service mesh, multi-cluster, multi-region are not universally "better") — judge fit against this platform's actual scale, team maturity, and stated requirements.
- The goal is a decision-ready output: the user should be able to take this straight into an ADR or roadmap discussion without re-deriving the reasoning themselves — prioritize clarity on "what to fix first and why" over an exhaustive checklist dump.
- If asked to re-review after changes, keep finding IDs stable so progress is trackable.
