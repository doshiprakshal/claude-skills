---
name: secret-detection
description: Deterministically scan Terraform files, tfvars, and state for hardcoded secrets and credentials — provider credentials, API keys, private keys, and passwords committed in plaintext. Purely mechanical, no judgment calls, like kubernetes/manifest-validation. Triggers on "scan for secrets in our terraform code", "are there hardcoded credentials in our terraform", "terraform secret detection", "check tfvars for leaked secrets".
user-invocable: true
---

# Terraform Secret Detection

Deterministically scan `.tf`/`.tfvars` files and state for hardcoded secrets — a mechanical pattern-matching pass, not a judgment call. Distinct from `security-audit` (broader infrastructure exposure) and `state-analysis` (state file health in general) — this skill's only job is finding plaintext credential material wherever it's committed.

## When to use

- Before committing/publishing Terraform code.
- The user asks whether secrets are hardcoded anywhere in their Terraform codebase.

**Out of scope**:
- Broader infrastructure security exposure → `security-audit`
- General state file health → `state-analysis` (this skill's state-scanning is specifically for secret content)
- IAM policy design → `iam-review`

## Inputs

- All `.tf` and `.tfvars` files.
- State content, if accessible (secrets can appear here even if not in source, since Terraform stores resolved attribute values).

## Workflow

### 1. Scan

Check every file for patterns matching known credential shapes: cloud provider access keys (AWS `AKIA...`, etc.), private key blocks (`-----BEGIN PRIVATE KEY-----`), high-entropy strings assigned to variables/attributes named suggestively (`password`, `secret`, `token`, `api_key`, `credential`), and hardcoded values in `provider` blocks that should instead come from environment variables or a credentials file.

### 2. Distinguish real findings from false positives

- A variable *named* `password` with no default and no hardcoded value (properly required from the caller) is not a finding.
- A variable with `sensitive = true` still counts as a finding if it has a hardcoded default value — sensitivity only affects CLI output, not whether the value is committed to source.
- Placeholder-looking values (`"changeme"`, `"REPLACE_ME"`) are still findings — a placeholder that looks obviously fake still often gets deployed as-is by mistake, and is worth flagging as a lower-confidence-but-real risk.

### 3. Report

1. **Per-file findings** — file, line, the specific credential-shaped content found (redact the actual value in the report — reference "found a value matching AWS access key pattern," don't reprint the actual key).
2. **Severity** — Error (a high-confidence real credential) / Warning (placeholder-looking or low-confidence pattern match worth a human look).
3. **Recommended fix** — move to a `Secret`/secrets manager/environment variable, and note that if a *real* credential was found, it should be rotated, not just removed from code (a leaked credential remains valid until rotated, regardless of whether it's later deleted from the repo).

## Notes

- If a real (not placeholder) credential is found, always note that removing it from the file doesn't invalidate it — rotation is required, and git history retains the old value regardless of the current file state.
- This is a mechanical scan — don't reason about whether a found secret is "probably fine to leave" — flag every match and let the human judge context.
