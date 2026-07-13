# Helm Security Review

Reviews a chart's packaging and supply-chain security — secrets in values files, chart provenance/signing, hook Job RBAC scope, untrusted/unpinned chart sources, and encrypted-values tooling usage.

See `SKILL.md` for the full workflow.

## How to invoke

- "Helm chart security review."
- "Are there secrets in our values files?"
- "Is our chart signed? Helm supply chain security check."

## Example

### Input

Chart pulled from an internal registry with no version pin (`version: "*"` in a downstream Chart.yaml dependency). No `.prov` file distributed with releases. A `pre-install` hook Job creates a database schema and runs under a ServiceAccount bound to `cluster-admin`. `values-staging.yaml` has a plaintext `smtp.password`.

### Output (abbreviated)

> **Findings**
>
> - **Plaintext SMTP credential in `values-staging.yaml`** — `[Blocker]` — plaintext password committed to the repo. Move to an external secret reference or an encrypted-values mechanism (SOPS/`helm-secrets`).
> - **Pre-install hook bound to `cluster-admin`** — `[Blocker]` — a schema-creation Job needs database access, not cluster-wide control. If this hook or its image is ever compromised, it has full cluster control. Scope its ServiceAccount to only what it needs (likely nothing cluster-scoped at all).
> - **No chart signing/provenance** — `[Medium]` — chart releases aren't signed, so there's no cryptographic guarantee that what gets installed matches what was published. Recommend `helm package --sign` and distributing `.prov` files, with `--verify` used on install for anything security-sensitive.
> - **Unpinned dependency version** — `[Medium]` — a downstream dependency uses `version: "*"`, meaning the actual chart content pulled in can change between builds with no explicit review. Pin to a specific version.
>
> **Overall verdict**
> Two Blocker findings (plaintext credential, over-privileged hook) need fixing before this chart is trusted for anything beyond a sandbox. Run `kubernetes/security-review` against the rendered manifests for pod-level hardening once these are addressed.

This example is illustrative — a real review depends entirely on the actual chart and values discovered for the target chart.
