---
name: security-review
description: Audit a Kubernetes workload or platform's security posture — pod/container hardening, RBAC least-privilege, secrets handling, network exposure, image provenance, and policy enforcement — and prioritize findings by real exploitability and blast radius, not a blanket CIS-benchmark diff. Triggers on "security review my k8s app", "audit our RBAC", "is this deployment secure", "check our kubernetes security posture", "review pod security context", "security audit before onboarding to shared cluster".
user-invocable: true
---

# Kubernetes Security Review

Audit a workload's or platform's Kubernetes security posture — the way a security/AppSec engineer would before trusting it in a shared or production environment. Go deeper than the surface-level secret-hardcoding check in `production-readiness-review`: this skill reasons about actual exploitability and blast radius, not just deviation from a hardening checklist.

## When to use

- Before onboarding a workload to a shared or production cluster.
- Feeding a compliance audit (SOC2, PCI, HIPAA) that requires specific controls.
- The user asks whether a workload/RBAC setup/network policy configuration is secure.

**Out of scope** — defer instead:
- Operational production-readiness → `production-readiness-review`
- Cluster/tenancy architecture → `architecture-review`
- Manifest schema validity → `manifest-validation`
- Cost of security tooling → `cost-optimization`

## Inputs

- Manifest/Helm/Kustomize set (same discovery convention as the other kubernetes skills).
- RBAC objects in scope: Roles, ClusterRoles, RoleBindings, ClusterRoleBindings, ServiceAccounts.
- NetworkPolicies, if any.
- Pod Security admission config, or OPA Gatekeeper/Kyverno policies, if visible.
- Image registry/provenance info — where images come from, whether scanning/signing is wired into CI.
- Secrets management approach (native `Secret`, external-secrets, Vault, sealed-secrets).
- Any stated compliance requirements implying specific controls.

## Workflow

### 1. Discover

Gather manifests, RBAC objects, NetworkPolicies, and any visible admission-control policy (PodSecurity admission labels on namespaces, Gatekeeper `ConstraintTemplate`/`Constraint`, Kyverno `Policy`/`ClusterPolicy`). Don't ask for these before attempting discovery — only ask when genuinely missing and it would change a finding.

### 2. Build the security posture inventory

Summarize before analyzing: ServiceAccounts in use and what they're bound to; RBAC bindings (Role/ClusterRole × RoleBinding/ClusterRoleBinding pairs) and their effective permissions; NetworkPolicies present (or absent) per namespace; admission-control policies enforcing anything; image sources and whether scanning/signing is evident; secrets management mechanism in use.

### 3. Deterministic checks

Objective, tagged **Passed** / **Failed** / **Cannot verify**:
- `securityContext`: `runAsNonRoot: true`, `allowPrivilegeEscalation: false`, `readOnlyRootFilesystem: true`, capabilities dropped (at minimum `ALL` dropped then re-added only as needed), no `privileged: true`.
- No `hostPath`, `hostNetwork`, `hostPID`, or `hostIPC` without explicit justification.
- ServiceAccount token auto-mount (`automountServiceAccountToken`) disabled where the workload doesn't call the Kubernetes API.
- No RBAC binding grants wildcard (`*`) verbs or resources at cluster scope.
- A NetworkPolicy exists per namespace (note specifically whether a default-deny baseline is present).
- No Secret values are referenced as plaintext env values in a manifest (vs. mounted from a `Secret`/external-secrets source).
- Image tag is not `latest` (cross-reference with `production-readiness-review`; relevant here for provenance/reproducibility of what was scanned).

### 4. Reasoning checks

Judgment-based, using the inventory and deterministic facts:
- Does the RBAC actually granted match what the workload's function needs, or is it broader than necessary (e.g., a `get`-only reporting job with `create`/`delete` on `pods`)?
- Is network exposure scoped to the workload's real communication pattern, or wide open by default?
- Is the absence of image scanning/signing an acceptable risk given the stated compliance requirements — or a gap that would fail an audit?
- Is a broad ServiceAccount binding dangerous given the namespace's actual trust boundary (e.g., cluster-admin-equivalent access sitting in a shared, lower-trust namespace)?
- If no admission controller enforces the hardening checks above, are they just convention with no teeth — call this out explicitly, since a "compliant-looking" manifest today can drift out of compliance with no enforcement catching it.

Classify confidence honestly:
- **Confirmed** — directly observed (e.g., a ClusterRoleBinding granting `cluster-admin` to a workload's ServiceAccount).
- **Likely** — strongly implied but not fully confirmed (e.g., RBAC looks broader than needed, but the workload's actual runtime behavior isn't visible).
- **Context-dependent** — depends on information not provided (what the app's code actually does, actual compliance scope). State the assumption; ask only if it would change the verdict.

### 5. Severity assignment

- **Blocker** — realistic path to node/cluster compromise or data exposure today (e.g., privileged container with hostPath to `/`, or cluster-admin bound to an internet-facing workload's ServiceAccount).
- **High** — significant risk under a plausible attack scenario (e.g., overly broad RBAC that an attacker could pivot through after compromising the app).
- **Medium** — a real gap with limited blast radius (e.g., missing NetworkPolicy in a namespace with otherwise limited east-west exposure).
- **Advisory** — hardening opportunity, no near-term risk (e.g., could drop an unused Linux capability that isn't actually exploitable here).

Give every finding a stable ID (`SEC-001`, `SEC-002`, ...).

### 6. Report

1. **Security posture inventory** — ServiceAccounts, RBAC bindings, NetworkPolicies per namespace, admission-control policies, image sources, secrets mechanism.
2. **Findings by theme** — Container/Pod Hardening, RBAC & Identity, Network Exposure, Secrets Management, Supply Chain/Image Provenance, Policy Enforcement. Each finding: ID, title, severity, confidence, evidence, why it matters (specific exploit path or exposure, not generic "best practice"), recommended fix.
3. **Cannot verify** — anything needing runtime/external info (actual app behavior for RBAC-necessity judgments, whether CI actually runs image scanning, whether Secrets are populated by an external manager).
4. **Prioritized remediation list** — sequenced by real exploitability/impact, not just severity label.
5. **Overall security verdict** — one summary judgment, e.g., "No path to node compromise found; RBAC over-provisioned for 2 ServiceAccounts; network policy absent — currently relies on namespace isolation alone."

## Notes

- Prioritize exploitability over checklist coverage — a hundred low-value CIS-benchmark deviations are less useful than five findings with a real attack path explained.
- Don't assume a control is enforced just because a policy object exists — confirm (or flag as unconfirmed) that an admission controller is actually validating against it.
- RBAC "excessive access" findings require knowing what the workload does; when that's not available, say so and mark the finding context-dependent rather than asserting excess with false confidence.
