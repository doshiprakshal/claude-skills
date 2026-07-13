---
name: admission-controller-review
description: Review Kubernetes admission control policy (OPA/Gatekeeper, Kyverno, Pod Security Admission) — policy coverage, enforcement mode, and whether policies actually block the intended violations, distinct from the underlying pod security or RBAC standards being enforced. Triggers on "review our opa gatekeeper policies", "are our kyverno policies actually enforcing what we think", "review our pod security admission configuration", "audit our admission controller coverage".
user-invocable: true
---

# Admission Controller Review

Review Kubernetes admission control configuration — policy engine setup, enforcement mode, and whether policies actually catch the violations they're intended to prevent.

## When to use

- Reviewing OPA/Gatekeeper, Kyverno, or Pod Security Admission configuration and policy coverage.

**Out of scope**:
- What the underlying security standard should require (pod security context specifics) → `kubernetes/security-review`
- RBAC permission design → `kubernetes/rbac-audit`
- Cluster platform-level hardening (API server, etcd) → `kubernetes-security`

## Inputs

- Admission controller/policy engine configuration and installed policies.
- Enforcement mode per policy (enforce/deny vs. audit/dry-run/warn).
- Namespace/workload scope the policies apply to.

## Workflow

### 1. Discover

Gather the policy engine in use and its installed policy set, with enforcement mode per policy.

### 2. Checks

- **Enforcement mode** — policies intended to block violations are actually in enforce/deny mode, not audit-only/dry-run — a policy left in audit mode indefinitely provides visibility but no actual prevention, and this is a common "we meant to turn it on" gap.
- **Coverage completeness** — policies cover the intended violation classes (privileged containers, missing resource limits, disallowed host paths, etc.) — check for namespaces/workloads exempted from policy scope and confirm the exemptions are intentional and narrow, not a broad default exclusion.
- **Policy correctness** — spot-check that a policy intended to block a specific pattern actually does, by reasoning through (or testing against) a manifest that should be rejected — a policy with a logic gap can silently fail to catch what it's meant to.
- **Bypass paths** — check for ways the policy can be bypassed (e.g., a namespace label exemption that's more broadly applied than intended, or a policy that only applies to `Deployment` but not `Pod`/`DaemonSet`/`StatefulSet` directly).
- **Fail-open vs. fail-closed behavior** — if the policy engine itself becomes unavailable, whether admission fails open (allows everything through) or closed (blocks everything) — fail-open silently disables all enforcement during an outage, which is often worse than intended.

### 3. Report

Findings grouped by Enforcement Mode, Coverage Completeness, Policy Correctness, Bypass Paths, Fail-Open/Closed Behavior, each with severity.

## Notes

- A policy in audit-only mode is easy to mistake for "we have this covered" — always report enforcement mode explicitly and prominently, since the gap between audit and enforce is the most consequential and common finding.
- Fail-open behavior during a policy-engine outage is a frequently overlooked but significant risk — explicitly check and report this even if not asked, since it determines whether an infrastructure incident silently becomes a security-policy gap too.
