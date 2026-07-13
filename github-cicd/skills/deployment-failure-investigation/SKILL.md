---
name: deployment-failure-investigation
description: Diagnose why a specific CI/CD deployment failed — distinguishing build failure, test failure, and deploy-step failure using pipeline logs and exit codes, working through a root-cause catalog with evidence. Triggers on "why did this deployment fail", "our pipeline failed, help me debug it", "deployment failure investigation", "diagnose this failed ci run".
user-invocable: true
---

# Deployment Failure Investigation

Diagnose why a specific CI/CD pipeline run failed — the CI/CD equivalent of the `kubernetes` domain's Investigate skills, working from pipeline logs and exit codes to a confirmed root cause.

## When to use

- A specific pipeline run failed and the cause isn't immediately obvious.
- The user wants a systematic diagnosis rather than a guess.

**Out of scope**:
- Broad pipeline structural review (not a specific failure) → the relevant tool-specific review skill
- Rollback execution once a bad deploy is confirmed → `rollback-readiness`

## Inputs

- The failed pipeline run's full logs.
- The specific stage/step that failed and its exit code.
- What changed in this run relative to the last successful one (code diff, dependency version, environment).

## Workflow

### 1. Gather evidence

Identify exactly which stage failed (build, test, or deploy) and the exact error/exit code — this immediately narrows the investigation category.

### 2. Work through the root cause catalog by failure category

- **Build failure** — compilation/dependency-resolution error (check for a recent dependency version bump, a lockfile mismatch, or a genuine code error); missing/misconfigured build environment (a required tool/SDK version not matching what the code expects).
- **Test failure** — a genuine regression in the code under test (check the diff for a plausible cause); a flaky test (check the test's history — does it fail intermittently across unrelated runs?); an environment-dependent test failure (relies on state/timing/external service not consistently available in CI).
- **Deploy-step failure** — authentication/authorization failure against the target environment (expired/rotated credentials, changed IAM/RBAC); target environment unreachable (network/DNS issue from the CI runner); a resource conflict (the target already in a state the deploy step didn't expect, e.g., a lock held by a concurrent run); a genuine application-level deploy rejection (failed health check post-deploy, a schema migration conflict).

### 3. Identify the confirmed root cause

State which category and specific cause the evidence supports, ruling out alternatives explicitly.

### 4. Recommend the fix

Specific to the cause.

### 5. Verify

What to check after the fix (the same pipeline stage should succeed on retry; if flaky-test-related, note whether the fix addresses the flakiness itself or just this instance).

## Report format

1. **Symptom summary** — pipeline/run ID, failed stage, exact error.
2. **Evidence collected**.
3. **Root cause analysis** — category and specific cause, alternatives ruled out.
4. **Root cause**.
5. **Recommended fix**.
6. **How to verify**.

## Notes

- Always check whether the same step has failed intermittently before (flaky vs. a genuine new break) — this changes both the diagnosis and the fix.
- "What changed since the last successful run" is usually the fastest path to a root cause — check the diff, dependency lockfile changes, and any environment/credential changes together, not just the code diff alone.
