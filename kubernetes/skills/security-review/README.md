# Security Review

Audits a Kubernetes workload or platform's security posture — pod/container hardening, RBAC least-privilege, secrets handling, network exposure, image provenance, and policy enforcement — and prioritizes findings by real exploitability and blast radius, not a blanket CIS-benchmark diff.

See `SKILL.md` for the full workflow this skill follows.

## How to invoke

- "Security review my k8s app."
- "Audit our RBAC."
- "Is this deployment secure?"
- "Security audit before onboarding to shared cluster."

## Example

### Input

A workload manifest plus its RBAC:

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: report-generator
spec:
  replicas: 1
  template:
    spec:
      serviceAccountName: report-generator-sa
      containers:
        - name: report-generator
          image: registry.internal/report-generator:1.4.0
          securityContext:
            privileged: true          # no obvious reason for this workload to need it
          env:
            - name: DB_PASSWORD
              value: "hunter2"        # plaintext credential
---
# rbac.yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: report-generator-binding
subjects:
  - kind: ServiceAccount
    name: report-generator-sa
    namespace: reporting
roleRef:
  kind: ClusterRole
  name: cluster-admin       # far broader than a reporting job needs
  apiGroup: rbac.authorization.k8s.io
```

No NetworkPolicy found in the `reporting` namespace. No admission controller (Gatekeeper/Kyverno) detected in the cluster.

### Output (abbreviated)

> **Security posture inventory**
>
> | Item | Value |
> |---|---|
> | ServiceAccounts | `report-generator-sa` |
> | RBAC bindings | `report-generator-sa` → `cluster-admin` (ClusterRoleBinding) |
> | NetworkPolicies | None in `reporting` namespace |
> | Admission control | None detected |
> | Secrets mechanism | Plaintext env value found |
>
> **Findings**
>
> **SEC-001 — ServiceAccount bound to cluster-admin** &nbsp;`[Blocker]` &nbsp;*(Confirmed)*
> - Finding: `report-generator-sa` is bound to the built-in `cluster-admin` ClusterRole.
> - Why it matters: if this workload is compromised (e.g., via a vulnerable dependency), the attacker gets full control of the entire cluster — every namespace, every secret, every RBAC object.
> - Evidence: `rbac.yaml` ClusterRoleBinding.
> - Recommended fix: replace with a namespaced Role granting only what a report generator needs (likely read-only on a few resource types) — `cluster-admin` is essentially never appropriate for an application workload.
>
> **SEC-002 — Plaintext database credential in env** &nbsp;`[Blocker]` &nbsp;*(Confirmed)*
> - Finding: `DB_PASSWORD` is set as a literal string in the container spec.
> - Why it matters: visible to anyone with read access to the Deployment (`kubectl get deployment -o yaml`), and stored in plaintext in Git/etcd.
> - Evidence: `deployment.yaml` env var.
> - Recommended fix: move to a `Secret` (or external-secrets/Vault if that's the platform standard) and reference via `valueFrom.secretKeyRef`.
>
> **SEC-003 — Privileged container with no apparent need** &nbsp;`[High]` &nbsp;*(Likely)*
> - Finding: `securityContext.privileged: true` is set.
> - Why it matters: privileged containers can access all host devices and effectively root the node if compromised — a report-generation workload is unlikely to need this.
> - Evidence: `deployment.yaml` securityContext.
> - Recommended fix: remove `privileged: true` unless there's a specific, confirmed hardware/device access requirement; if there is, document it and scope with capabilities instead.
>
> **SEC-004 — No NetworkPolicy in the namespace** &nbsp;`[Medium]` &nbsp;*(Confirmed)*
> - Finding: `reporting` namespace has no NetworkPolicy.
> - Why it matters: combined with SEC-001, a compromise here isn't network-contained either — full RBAC blast radius and full network reachability.
> - Evidence: no `NetworkPolicy` objects found.
> - Recommended fix: add a default-deny policy with explicit allow rules for what this workload actually needs to reach.
>
> **Cannot verify**
> - Whether `cluster-admin` access is actually exercised at runtime, or a leftover from initial setup (affects urgency, not the recommendation itself).
> - Whether CI runs image scanning on `report-generator:1.4.0` — no pipeline config was available to check.
>
> **Prioritized remediation list**
> 1. SEC-001 — replace cluster-admin binding (highest blast radius, no legitimate reason found)
> 2. SEC-002 — move credential to a Secret
> 3. SEC-003 — remove privileged mode unless justified
> 4. SEC-004 — add NetworkPolicy
>
> **Overall security verdict**
>
> ❌ Not ready for a shared cluster — a single compromise of this workload currently grants full cluster control (SEC-001) with no network containment (SEC-004). Fix SEC-001 and SEC-002 before this runs anywhere near production data.

This example is illustrative — a real review depends entirely on what's actually discovered in the target workload/platform.
