---
name: image-scan-review
description: Interpret and triage container image vulnerability scan output (Trivy, Grype, Snyk, etc.) — distinguishing exploitable findings from noise, prioritizing by reachability, distinct from general container security posture or scan tooling setup. Triggers on "help me interpret this trivy scan output", "triage our container image scan results", "why does our image scan show so many vulnerabilities", "review this image vulnerability scan report".
user-invocable: true
---

# Image Scan Review

Interpret and triage container image vulnerability scan output, distinguishing genuinely actionable findings from noise.

## When to use

- Reviewing/triaging the output of a container image vulnerability scanner.
- The user is overwhelmed by a large scan finding count and needs prioritization.

**Out of scope**:
- General container security posture (privilege, provenance) beyond scan findings → `container-security`
- Dockerfile-level fixes for how the image is built → `dockerfile-review`
- Source-code/package dependency scanning (as opposed to a built image) → `dependency-review`

## Inputs

- The scan output (tool and findings list).
- Context on whether/how the image is deployed (base image layer vs. application layer, whether the vulnerable component is actually invoked).

## Workflow

### 1. Separate base-image findings from application-layer findings

Distinguish vulnerabilities in the base OS layer from those in application dependencies added on top — remediation paths differ (base image update vs. dependency update) and ownership may differ too (platform team vs. application team).

### 2. Assess reachability

A vulnerability in a package that's present in the image but never actually invoked by the application (e.g., an unused library bundled with the base image) carries lower real risk than one in an actively-used code path — note this distinction even though most scanners don't compute it automatically.

### 3. Check fix availability and distance

For each finding, note whether a fixed version is available and how large the version jump is — some findings have no fix available yet (in which case a compensating control or acceptance decision applies) and shouldn't be tracked identically to ones with a trivial patch-level fix available.

### 4. Deduplicate and prioritize

Many scan results have a large raw count dominated by a small number of underlying issues (e.g., one outdated base image accounting for dozens of individual CVEs) — group by root cause where possible so the actual remediation effort is clear (updating one base image, not addressing 40 individual findings).

### 5. Report

Findings grouped by root cause (e.g., by base image or by outdated package) with severity, fix availability, and a recommended remediation that addresses the group, not each CVE individually where a shared fix exists.

## Notes

- A large raw finding count is often just a small number of root causes (an outdated base image) reported as many individual CVEs — always look for this consolidation opportunity before presenting an overwhelming flat list.
- Findings with no available fix need a distinct disposition (compensating control, risk acceptance with review date, or image/dependency replacement) rather than sitting indefinitely in the same bucket as fixable findings.
