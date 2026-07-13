---
name: kubernetes-security
description: Review Kubernetes cluster-level, platform security hardening — API server flags, etcd encryption at rest, audit log policy, kubelet authn/authz, secrets encryption — distinct from workload/manifest-level pod security and RBAC depth. Triggers on "review our kubernetes cluster security hardening", "is our api server configured securely", "review our etcd encryption and audit logging setup", "audit our cluster platform security".
user-invocable: true
---

# Kubernetes Security

Review Kubernetes cluster/platform-level security hardening — the control-plane and cluster-infrastructure security configuration, as distinct from workload-level manifest security.

## When to use

- Reviewing cluster-level security hardening (API server, etcd, kubelet, audit policy).

**Out of scope**:
- Workload/manifest-level pod security (security context, privilege, capabilities) → `kubernetes/security-review`
- RBAC permission design → `kubernetes/rbac-audit`
- NetworkPolicy design → `kubernetes/networkpolicy-audit`
- Admission controller policy content → `admission-controller-review`
- Container image/build-level security → `container-security`, `dockerfile-review`

## Inputs

- Control-plane configuration (API server flags, etcd configuration) if self-managed, or the managed-K8s provider's security configuration if using EKS/GKE/AKS.
- Audit log policy configuration.
- Secrets-at-rest encryption configuration.
- Kubelet authentication/authorization configuration.

## Workflow

### 1. Discover

Gather control-plane configuration (or managed-provider security settings), audit policy, and secrets encryption configuration.

### 2. Checks

- **etcd encryption at rest** — Secrets (and ideally other sensitive resources) are encrypted at rest in etcd, not stored in plaintext — a commonly missed default in self-managed clusters.
- **Audit log policy** — audit logging is enabled with a policy capturing security-relevant events (not just metadata-level, and not disabled entirely) with appropriate retention.
- **API server hardening** — anonymous authentication disabled, insecure port disabled, appropriate authorization mode (RBAC, not AlwaysAllow), and admission controllers enabled (cross-reference `admission-controller-review` for policy content depth).
- **Kubelet security** — kubelet authentication/authorization enabled (not anonymous), read-only port disabled.
- **Secrets management** — whether secrets are managed via native (etcd-backed) Secrets or an external secrets manager/CSI driver, and whether that choice matches the sensitivity of what's stored (cross-reference `encryption-review` for broader encryption posture).
- **Managed-provider specific settings** — for EKS/GKE/AKS, provider-specific hardening settings (e.g., EKS control plane logging, private API endpoint) are enabled appropriately.

### 3. Report

Findings grouped by etcd Encryption, Audit Policy, API Server Hardening, Kubelet Security, Secrets Management, each with severity, routed to the relevant workload-level skill where a finding is actually about manifest/workload configuration rather than cluster platform configuration.

## Notes

- This skill is scoped to cluster/platform-level configuration specifically — if a finding turns out to be about a specific workload's pod security context or RBAC binding, route it to `kubernetes/security-review` or `kubernetes/rbac-audit` rather than reporting it here, to avoid duplicating those skills' depth.
- Managed Kubernetes (EKS/GKE/AKS) shifts some of these controls to the provider — always confirm what's provider-managed vs. customer-configurable before flagging a gap as an action item.
