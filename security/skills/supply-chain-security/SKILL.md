---
name: supply-chain-security
description: Review software supply chain integrity — build provenance, artifact signing/attestation, SBOM completeness, and third-party build dependency trust, distinct from dependency vulnerability content or CI/CD pipeline configuration security. Triggers on "review our software supply chain security", "do we have provenance attestation for our builds", "review our sbom completeness", "audit our build pipeline for supply chain risk".
user-invocable: true
---

# Supply Chain Security

Review software supply chain integrity — whether build artifacts can be trusted as genuinely produced by the claimed process, from claimed source, with a known dependency composition.

## When to use

- Assessing build provenance, artifact signing, or SBOM (Software Bill of Materials) practices.

**Out of scope**:
- Vulnerability content of dependencies themselves → `dependency-review`, `image-scan-review`
- CI/CD pipeline configuration security (secrets handling, permission scoping within the pipeline) → `github-cicd/pipeline-security`
- Container registry access control → `container-security`

## Inputs

- The build process (CI/CD pipeline producing artifacts).
- Current provenance/signing practices, if any.
- SBOM generation practice, if any.

## Workflow

### 1. Assess provenance verifiability

Determine whether a build artifact's provenance (what source commit, what build process, what pipeline) can be cryptographically verified, not just asserted by convention (e.g., "we always build from CI so it should be fine") — unverifiable provenance means a compromised build step or a manually-uploaded artifact would be indistinguishable from a legitimate one.

### 2. Assess artifact signing

Check whether build artifacts (container images, packages, binaries) are signed, and whether deployment/consumption actually verifies the signature before use — signing without enforced verification provides no real protection.

### 3. Assess SBOM completeness

Check whether an SBOM is generated per build, capturing the full dependency tree (not just direct dependencies) — an SBOM is what enables fast, accurate impact assessment when a new dependency vulnerability is disclosed (cross-reference `dependency-review`/`vulnerability-analysis`).

### 4. Assess third-party build dependency trust

Review third-party actions/plugins/base images used in the build process itself for trustworthiness (pinned versions/digests rather than mutable references, from vetted sources) — a compromised build-time dependency can inject malicious content into an otherwise-legitimate build.

### 5. Report

Findings grouped by Provenance, Artifact Signing, SBOM Completeness, Build-Time Dependency Trust, each with severity and remediation, referencing SLSA framework levels if useful context for maturity framing.

## Notes

- Signing without enforced verification at deployment time is a common half-measure — always check both halves (is it signed, and is the signature actually checked before use) rather than treating signing alone as sufficient.
- SBOM value is realized at disclosure time (rapid "are we affected" answers) — a generated-but-never-referenced SBOM is a missed opportunity; note whether the org has a process for actually using it when a new CVE drops.
