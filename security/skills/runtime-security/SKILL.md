---
name: runtime-security
description: Review runtime threat detection and enforcement — anomalous process/syscall behavior monitoring (e.g., Falco-style rules), runtime policy enforcement, and alert tuning, distinct from static image/Dockerfile review or build-time posture. Triggers on "review our runtime security monitoring setup", "are our falco rules tuned correctly", "review our runtime threat detection coverage", "why is our runtime security tool generating so many false positives".
user-invocable: true
---

# Runtime Security

Review runtime threat detection and enforcement — whether anomalous behavior at runtime is actually detected, with rules tuned for real signal over noise.

## When to use

- Reviewing runtime security monitoring/enforcement tooling (Falco, runtime EDR-style container security tools) configuration or coverage.
- The user has a runtime security tool producing excessive false positives.

**Out of scope**:
- Build-time/static image security posture → `container-security`, `image-scan-review`
- Admission-time policy enforcement (blocking before deployment) → `admission-controller-review`

## Inputs

- Runtime security tool configuration (rule set, alerting).
- Recent alert history, including known false positives if the user is dealing with alert fatigue.
- Coverage scope (which workloads/nodes are actually monitored).

## Workflow

### 1. Assess coverage

Confirm runtime monitoring is actually deployed across all workloads/nodes in scope, not just a subset — a partially-deployed runtime security tool creates false confidence about coverage that doesn't exist.

### 2. Assess rule relevance and tuning

Review the active rule set for relevance to the actual threat model (e.g., rules detecting shell spawned in a container are high-value for most workloads; an overly generic rule set copied wholesale from defaults may generate excessive noise for this specific environment's normal behavior).

### 3. Diagnose false-positive sources

For alert-fatigue complaints, identify which specific rules are the dominant noise source and whether they're miscalibrated for this environment's legitimate behavior (e.g., a "shell spawned" rule firing on a legitimate debug/exec workflow that the team actually uses) — recommend tuning (scoping the rule, adding an exception) rather than disabling the rule wholesale, which would create a coverage gap.

### 4. Assess response integration

Check whether runtime alerts actually reach responders (integrated with alerting/incident tooling) and, if enforcement mode is available, whether blocking (not just alerting) is used where appropriate for high-confidence detections.

### 5. Report

Findings on Coverage, Rule Relevance/Tuning, False-Positive Sources, Response Integration, each with severity and recommendation.

## Notes

- When addressing alert fatigue, prefer narrowing/tuning a noisy rule over disabling it — outright disabling trades a noise problem for a coverage gap, which is usually the worse tradeoff.
- Partial deployment coverage is a common, easy-to-overlook gap — always explicitly verify monitoring is active fleet-wide, not just assume based on the tool being "set up."
