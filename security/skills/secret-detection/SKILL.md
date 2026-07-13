---
name: secret-detection
description: Scan a codebase, repository history, or configuration for exposed secrets — hardcoded credentials, API keys, tokens — using pattern and entropy-based detection, general-purpose across any language/platform, including git history. Triggers on "scan our repo for leaked secrets", "check our git history for exposed credentials", "do we have any hardcoded api keys in this codebase", "run a secrets scan across our repositories".
user-invocable: true
---

# Secret Detection

Scan a codebase, repository (including history), or configuration for exposed secrets, general-purpose across any language or platform.

## When to use

- Scanning for hardcoded/leaked secrets in source code, config files, or git history.

**Out of scope**:
- Terraform-state-specific secret exposure → `terraform/secret-detection`
- CI/CD pipeline secrets configuration/masking review → `github-cicd/secrets-review`
- How secrets are managed/stored/rotated once legitimately provisioned → `encryption-review` for at-rest protection, or the platform's secrets-manager configuration

## Inputs

- The codebase/repository to scan (including whether git history should be included, not just current HEAD).
- Any known false-positive patterns (e.g., clearly-fake example credentials in documentation) to calibrate detection.

## Workflow

### 1. Scan current state and history separately

Scan the current working tree for hardcoded secrets, and separately scan git history — a secret removed from the current HEAD but still present in a prior commit is still exposed to anyone with repo access and needs separate remediation (history rewrite or credential rotation), not just a file edit.

### 2. Apply pattern and entropy detection

Use known credential patterns (cloud provider key formats, common token formats) combined with high-entropy string detection to catch both recognizable and generic-looking secrets.

### 3. Triage findings

Distinguish real exposed secrets from false positives (example/placeholder credentials in documentation, test fixtures using obviously fake values) — flag ambiguous cases for human confirmation rather than silently dropping them.

### 4. Recommend remediation per finding

For a confirmed real secret: rotate the credential immediately (the exposure already happened; removing it from the repo doesn't undo that), then remove from current files and consider history rewrite if the exposure window/access scope warrants it.

### 5. Report

Findings: file/commit location, secret type, confirmed vs. suspected, and remediation steps (rotate + remove, with history-rewrite recommendation if warranted).

## Notes

- **Rotation always comes before removal** — if a secret was ever committed, assume it's been seen by anyone with repo/clone access (including in history, forks, or CI logs), and rotating the actual credential is the only complete remediation; deleting the file or even rewriting history doesn't undo a prior exposure.
- Git history scanning is easy to skip but often where the most severe, forgotten exposures live — always include it explicitly rather than only scanning current HEAD.
