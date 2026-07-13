---
name: secrets-review
description: Deterministically scan CI/CD pipeline configuration and logs for hardcoded secrets, secrets echoed into logs, and overly broad secret scope across jobs/environments. Purely mechanical, no judgment calls. Triggers on "scan our pipeline for exposed secrets", "are secrets leaking into ci logs", "ci/cd secrets review", "check our pipeline for hardcoded credentials".
user-invocable: true
---

# CI/CD Secrets Review

A mechanical scan of CI/CD configuration for hardcoded secrets, log-exposed secrets, and overly broad secret scope. The pipeline-config counterpart to `terraform/secret-detection` — same deterministic, no-judgment-calls approach, applied to CI/CD YAML and logs.

## When to use

- Before committing pipeline configuration changes.
- The user asks whether secrets are exposed anywhere in their CI/CD setup.

**Out of scope**:
- Broader pipeline security patterns (identity, supply chain) → `pipeline-security`
- Application code secret scanning → out of scope for this pipeline-focused skill

## Inputs

- All pipeline configuration files (workflow YAML, Jenkinsfile, etc.).
- Recent pipeline run logs, if accessible.
- Secret/variable scope configuration (which jobs/environments/branches can access which secrets).

## Workflow

### 1. Scan configuration

Check every pipeline config file for credential-shaped values hardcoded directly (not referenced via the platform's secret mechanism).

### 2. Scan logs for accidental exposure

If log access is available, check for secrets appearing in plaintext in job output — a common cause is a command that echoes an environment variable, a verbose/debug flag printing full request headers including auth tokens, or a secret interpolated into a shell command that gets logged before masking applies.

### 3. Check secret scope

For each secret, check whether it's scoped to only the jobs/environments/branches that need it, or broadly available to every job in the pipeline (or, worse, to untrusted fork-PR-triggered jobs).

### 4. Report

1. **Per-finding table** — file/log location, what was found (referenced generically, not reprinting the actual secret value), severity.
2. **Recommended fix** — move to the platform's secret mechanism, fix the logging leak, narrow the scope. If a real (not placeholder) credential was found exposed, note that rotation is required regardless of whether the exposure is fixed going forward.

## Notes

- Never reprint the actual secret value in the report — reference it generically ("a value matching an AWS access key pattern was found").
- If a real credential is found exposed in logs (not just config), treat it as already compromised — logs are often retained and may be accessible to more people than the pipeline config itself. Rotation is required, not optional.
