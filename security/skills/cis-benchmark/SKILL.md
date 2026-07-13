---
name: cis-benchmark
description: Assess a system (Linux host, Kubernetes cluster, cloud account) against the relevant CIS Benchmark, mapping specific controls to pass/fail with remediation, distinct from broader compliance-framework mapping. Triggers on "run a cis benchmark assessment", "how do we score against the cis kubernetes benchmark", "check our compliance with the cis benchmark for this platform", "cis hardening assessment".
user-invocable: true
---

# CIS Benchmark

Assess a system against the relevant CIS Benchmark, mapping specific numbered controls to pass/fail status with remediation guidance.

## When to use

- A specific CIS Benchmark assessment (Linux, Kubernetes, a cloud provider, Docker) is requested.

**Out of scope**:
- Broader multi-framework regulatory compliance mapping (SOC2, PCI-DSS, HIPAA) → `compliance-audit`
- General security review not scoped to the CIS control set specifically → the relevant domain/platform skill

## Inputs

- The target system and the specific CIS Benchmark version/profile applicable (e.g., CIS Kubernetes Benchmark v1.8, CIS Amazon Linux 2 Benchmark, Level 1 vs. Level 2 profile).
- Access to the system's actual configuration to check against each control.

## Workflow

### 1. Identify the applicable benchmark and profile

Confirm the specific benchmark and version matching the target system, and which profile level (Level 1: baseline, Level 2: defense-in-depth, often with more operational tradeoffs) is the assessment target — a Level 2 gap is not necessarily as urgent as a Level 1 gap.

### 2. Assess each control

Check the system's actual configuration against each applicable control, recording pass/fail/not-applicable (some controls don't apply to every deployment topology — state why when marking not-applicable rather than silently skipping).

### 3. Prioritize failures

Not all CIS control failures carry equal risk — prioritize failures with direct security consequence (e.g., anonymous auth enabled) above lower-impact hardening gaps (e.g., a specific audit log format preference), even though both count as "failures" in a strict scoring sense.

### 4. Report

A scored summary (X of Y controls passing), the full list of failed controls with their CIS control ID, severity/priority, and specific remediation, and any controls marked not-applicable with justification.

## Notes

- A raw pass-rate percentage can be misleading — a system passing 95% of controls but failing one severe Level 1 control (e.g., anonymous authentication) is in worse shape than the percentage suggests; always lead with prioritized failures, not just the score.
- CIS Benchmarks are versioned and platform-specific — confirm the assessment is against the correct version for the target system rather than assuming the most recent version applies, since some environments intentionally track an older version for stability.
