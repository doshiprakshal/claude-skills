---
name: policy-review
description: Review a Sentinel/OPA/Checkov policy-as-code setup for Terraform — policy coverage against actual resource types in use, policy correctness, and whether policies actually gate applies or are advisory-only. Triggers on "review our terraform policy as code setup", "are our sentinel policies working", "checkov policy review", "do our opa policies actually block bad applies".
user-invocable: true
---

# Terraform Policy Review

Review a policy-as-code setup (Sentinel, OPA/Conftest, Checkov, or similar) used to gate Terraform changes — distinct from `compliance-review` (which checks the infrastructure itself against a framework) — this skill reviews the *policy tooling* meant to enforce standards automatically.

## When to use

- Reviewing whether policy-as-code is actually enforcing what the team believes it enforces.
- The user asks whether their Sentinel/OPA/Checkov setup is correctly gating applies.

**Out of scope**:
- Whether the infrastructure itself meets a compliance framework → `compliance-review`
- The infrastructure's security posture directly → `security-audit`/`iam-review`

## Inputs

- All policy definitions (Sentinel policies, OPA/Rego rules, Checkov custom checks or config).
- How policies are wired into the CI/CD pipeline (advisory/soft-mandatory/hard-mandatory enforcement level).
- Recent policy check results/logs, if available.

## Workflow

### 1. Discover

Gather all policy definitions and how they're invoked in the pipeline.

### 2. Checks

- **Enforcement level** — are policies actually blocking (hard-mandatory) an apply on failure, or just advisory/logged with no gate? A policy set with no enforcement teeth provides false confidence.
- **Coverage** — do policies actually cover the resource types and risk categories the team cares about (e.g., is there a policy checking for public S3 buckets if that's a known concern), or are there large gaps between what the team believes is covered and what's actually written?
- **Policy correctness** — do policies actually implement the check they claim to (a policy intended to block public S3 buckets that has a logic bug and never actually triggers is worse than no policy, since it creates false confidence)?
- **Policy test coverage** — do the policies themselves have tests (Sentinel test cases, OPA/Rego unit tests) confirming they catch what they're supposed to and don't false-positive on legitimate configs?
- **Bypass paths** — is there a way to skip policy checks (an override flag, an exemption list) that's overused or under-audited?

### 3. Report

Findings grouped by Enforcement Level, Coverage, Correctness, Test Coverage, Bypass Paths, each with severity and specific fix.

## Notes

- A policy that exists but doesn't actually gate anything (advisory-only, or logically broken) is a more dangerous finding than a missing policy — it creates false confidence that a risk is covered when it isn't. Flag these as high severity.
- If possible, verify policy correctness by reasoning through what config would and wouldn't trigger it, not just reading the policy's stated intent/comments.
