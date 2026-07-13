---
name: pipeline-security
description: Review CI/CD pipeline security broadly, across whichever tools are in use — least-privilege service identities, untrusted-code execution risk, artifact integrity/provenance, and supply-chain exposure in the pipeline itself. Complements the tool-specific review skills with cross-tool security patterns. Triggers on "review our ci/cd pipeline security", "pipeline supply chain security review", "is our ci/cd least privilege", "pipeline security audit".
user-invocable: true
---

# Pipeline Security

Review CI/CD pipeline security at a level that applies across whichever specific tools are in use — the broader security posture, complementing the tool-specific reviews (`github-actions-review`, `jenkins-review`, etc.) which cover tool-specific mechanics in depth.

## When to use

- A cross-tool CI/CD security review.
- The user asks about least-privilege, supply chain, or untrusted-code execution risk broadly.

**Out of scope**:
- Tool-specific configuration mechanics → the relevant tool-specific skill (`github-actions-review`, `jenkins-review`, `gitlab-ci-review`, `circleci-review`, `azure-devops-review`)
- Mechanical secret scanning → `secrets-review`

## Inputs

- Pipeline identity/credential configuration (service accounts, OIDC federation, static credentials).
- Build artifact signing/provenance configuration, if any.
- Which pipelines execute code from untrusted sources (fork PRs, external contributors).

## Workflow

### 1. Discover

Gather how pipelines authenticate to deployment targets, whether any run untrusted code, and whether artifacts are signed/verified.

### 2. Checks

- **Least-privilege pipeline identities** — pipelines authenticate via short-lived, scoped credentials (OIDC federation to cloud providers, e.g., GitHub Actions → AWS via OIDC) rather than long-lived static credentials with broad permissions.
- **Untrusted code execution risk** — any pipeline that executes code from an untrusted source (fork PRs, external contributions) with access to secrets or deployment credentials (the cross-tool version of the `pull_request_target` risk pattern checked in `github-actions-review`).
- **Artifact integrity/provenance** — build artifacts (container images, packages) are signed and/or have provenance attestation (SLSA-style), and deployment pipelines verify this before deploying, rather than trusting an artifact by name/tag alone.
- **Dependency supply chain** — pipelines pull dependencies from trusted, pinned sources; no pipeline step installs and executes an unpinned, unreviewed third-party script/action/orb as part of the build.
- **Audit trail** — pipeline runs and their deployment actions are logged and attributable to a specific trigger (commit, actor), supporting later forensic investigation if needed.

### 3. Report

Findings grouped by Identity/Credentials, Untrusted Code Execution, Artifact Integrity, Dependency Supply Chain, Audit Trail, each with severity and fix, cross-referencing the relevant tool-specific skill for implementation-level fixes.

## Notes

- Long-lived static cloud credentials stored as CI secrets are a common, high-value target if a pipeline is ever compromised — OIDC federation with short-lived tokens substantially reduces this risk and should be recommended wherever the CI platform supports it.
- The untrusted-code-execution-with-secrets pattern is the single most impactful class of CI/CD vulnerability across virtually every tool — prioritize checking for it explicitly.
