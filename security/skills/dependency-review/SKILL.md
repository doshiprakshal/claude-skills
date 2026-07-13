---
name: dependency-review
description: Review application source-code dependencies (npm, pip, maven, go modules, etc.) for known vulnerabilities, license risk, and maintenance health, distinct from container image layer scanning. Triggers on "review our dependencies for vulnerabilities", "check our package dependencies for license issues", "is this dependency actively maintained", "audit our dependency tree for security risk".
user-invocable: true
---

# Dependency Review

Review application source-code dependencies for known vulnerabilities, license risk, and maintenance health.

## When to use

- Reviewing a project's package/module dependencies for security or license risk.

**Out of scope**:
- Container image layer vulnerability scanning → `image-scan-review`
- Build provenance/attestation and supply-chain integrity beyond dependency content itself → `supply-chain-security`

## Inputs

- The dependency manifest/lockfile (package.json/lock, requirements.txt, go.mod, pom.xml, etc.).
- Known vulnerability databases for the ecosystem in question.

## Workflow

### 1. Enumerate the full dependency tree

Include transitive dependencies, not just direct ones — a vulnerability in a transitive dependency is just as exploitable and is a commonly missed category since it doesn't appear in the direct manifest.

### 2. Check for known vulnerabilities

Cross-reference each dependency version against known vulnerability databases for its ecosystem; note whether a fixed version is available and how large the version jump to remediate is (a patch-level fix is lower-risk to adopt than a major-version jump).

### 3. Check license compatibility

Flag dependencies with licenses incompatible with the project's own licensing/distribution model (e.g., a copyleft license in a proprietary product) — a distinct risk category from vulnerabilities, but often reviewed together.

### 4. Assess maintenance health

Dependencies with no recent releases, an archived/abandoned upstream repo, or a single-maintainer bus-factor risk are a forward-looking risk even without a currently known vulnerability — flag as advisory.

### 5. Report

Findings grouped by Known Vulnerabilities (with fix availability), License Risk, Maintenance Health, each with severity, prioritized by exploitability/exposure similar to the reasoning in `vulnerability-analysis`.

## Notes

- Always include transitive dependencies in scope — direct-dependency-only scans systematically miss a large share of real exposure, since most dependency trees are dominated by transitive packages.
- When a vulnerability fix requires a major version bump, note the increased adoption risk (breaking changes) explicitly rather than treating "a fix exists" as equivalent effort regardless of version distance.
