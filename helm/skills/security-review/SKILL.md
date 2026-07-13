---
name: security-review
description: Review a Helm chart's packaging and supply-chain security — secrets in values files, chart provenance/signing, hook Job RBAC scope, untrusted/unpinned chart sources, and encrypted-values tooling usage. Complements kubernetes/security-review, which covers the rendered manifests. Triggers on "helm chart security review", "are there secrets in our values files", "is our chart signed", "helm supply chain security".
user-invocable: true
---

# Helm Security Review

Review a chart's packaging and supply-chain security — the concerns that exist because this is distributed as a *chart*, not just the resulting Kubernetes manifests (render the chart and run `kubernetes/security-review` for pod/RBAC/network hardening of the output itself).

## When to use

- Reviewing a chart before publishing or before trusting a third-party chart.
- The user asks whether secrets are safely handled in values files, or whether the chart's supply chain is trustworthy.

**Out of scope**:
- Pod/container hardening, RBAC-vs-function fit, network exposure of the *rendered* manifests → `kubernetes/security-review`
- Production packaging concerns broader than security → `production-review`

## Inputs

- The chart directory, including all values files.
- `Chart.yaml` (for provenance/signing metadata if present).
- The chart's source repository/registry configuration.
- Any hook-defined Jobs and their ServiceAccount/RBAC.

## Workflow

### 1. Discover

Gather all values files, hook definitions, and the chart's declared source.

### 2. Checks

- **Secrets in values files** — scan every values file (not just the default) for plaintext credentials, API keys, or private key material.
- **Chart provenance/signing** — is the chart signed (`helm package --sign`, a `.prov` file distributed alongside it), and is `helm verify`/`--verify` used on install? Flag if a chart handling sensitive workloads has no signing/verification story at all.
- **Untrusted/unpinned chart source** — is the chart (or any of its dependencies) pulled from a repo/OCI registry with no explicit version pin, or from a source with no clear ownership/trust basis?
- **Hook Job RBAC scope** — any `pre-install`/`post-upgrade`/etc. hook Jobs reviewed for their ServiceAccount's permissions — do they have more access than the hook's actual task requires (e.g., a migration Job with cluster-wide RBAC when it only needs to talk to a database)?
- **Encrypted-values tooling** — if the team's convention is to use `helm-secrets`/SOPS/Vault for sensitive values, confirm it's actually applied consistently (a `.sops.yaml` present but one values file left unencrypted defeats the purpose) — or flag the absence of any such mechanism if secrets are otherwise found in values.
- **RBAC objects rendered by the chart** — templates that create Roles/ClusterRoles/Bindings reviewed for whether they grant only what the chart's own components need.

### 3. Report

Findings grouped by Secrets Handling, Chart Provenance, Source Trust, Hook Permissions, RBAC, each with severity and fix, cross-referencing `kubernetes/security-review` for the rendered-manifest-level deep dive.

## Notes

- Don't duplicate `kubernetes/security-review`'s rendered-manifest checks — point to it explicitly for pod hardening/RBAC-vs-function fit on the output.
- A values file "looking" encrypted (e.g., a `sops`-managed file) is worth confirming is actually decryptable/valid, not just present — a broken encryption setup can silently ship garbage values.
