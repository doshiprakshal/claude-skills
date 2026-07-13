---
name: multi-cluster-review
description: Review multi-cluster Kubernetes architecture and management strategy — cluster topology rationale, fleet-wide configuration consistency, and cross-cluster workload placement/failover, distinct from single-cluster operational review. Triggers on "review our multi-cluster architecture", "how should we manage configuration consistency across our clusters", "review our cluster fleet topology", "assess our cross-cluster failover strategy".
user-invocable: true
---

# Multi-Cluster Review

Review multi-cluster Kubernetes architecture and fleet management strategy — cluster topology, cross-cluster consistency, and workload placement/failover.

## When to use

- Reviewing why/how multiple clusters are organized, or fleet-wide configuration management.

**Out of scope**:
- Single-cluster health/configuration → `kubernetes/cluster-health-check`, `kubernetes/architecture-review`
- Specific service networking across clusters at the CNI/mesh level → `networking/kubernetes-networking`, `networking/service-mesh-review`

## Inputs

- The cluster fleet's topology (how many clusters, by what dimension: environment, region, team, tenancy).
- Fleet-wide configuration management approach (how baseline config/policy is kept consistent across clusters).
- Cross-cluster workload placement and failover strategy, if any.

## Workflow

### 1. Assess topology rationale

Confirm the cluster-splitting dimension (per-environment, per-region, per-team, per-tenant, or some combination) is deliberate and matches actual isolation/blast-radius needs — a proliferation of clusters without a clear rationale increases operational burden without a corresponding isolation benefit; conversely, too few clusters can under-isolate workloads that need stronger separation.

### 2. Assess fleet-wide configuration consistency

Check how baseline configuration (RBAC, network policy defaults, admission policy, monitoring agents) is propagated and kept consistent across the fleet — a manual, per-cluster configuration process drifts over time (cross-reference `security/kubernetes-security` and `security/admission-controller-review` for what should be consistently enforced); a GitOps/fleet-management tool applying consistent baseline config is the more scalable pattern.

### 3. Assess workload placement strategy

If workloads can run in multiple clusters, check whether placement decisions (which cluster, capacity-based or policy-based) are deliberate and whether the mechanism actually works as intended, not just theoretically available.

### 4. Assess cross-cluster failover

If failover between clusters is a stated capability, verify it's actually been tested (not just architecturally possible) and that DNS/traffic-routing mechanisms for failover are understood and reliable.

### 5. Report

Findings on Topology Rationale, Fleet Configuration Consistency, Workload Placement, Cross-Cluster Failover, each with severity.

## Notes

- Fleet-wide configuration drift is the most common real-world multi-cluster problem — a security or policy baseline correctly applied to the first cluster silently failing to propagate to a newly-added cluster is a frequent, easy-to-miss gap; always check the propagation mechanism, not just the intended baseline.
- An untested cross-cluster failover capability should be treated as unverified, not as a working safety net — recommend an explicit failover test (similar reasoning to disaster-recovery testing) before relying on it.
