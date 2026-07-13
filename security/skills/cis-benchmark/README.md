# CIS Benchmark

Assesses a system against the relevant CIS Benchmark, mapping specific numbered controls to pass/fail with prioritized remediation.

See `SKILL.md` for the full workflow.

## How to invoke

- "Run a CIS benchmark assessment on this cluster."
- "How do we score against the CIS Kubernetes Benchmark?"
- "CIS hardening assessment for this Linux host."

## Example

### Input

Target: CIS Kubernetes Benchmark v1.8, Level 1 profile, self-managed cluster. Findings: API server anonymous auth is enabled (control 1.2.1, fail). Audit logging is not configured (control 1.2.22, fail). A Level 2 control requiring a specific audit log max-age setting is not applicable since audit logging isn't enabled at all yet.

### Output (abbreviated)

> **Score**: 47 of 52 applicable Level 1 controls passing (90%)
>
> **Prioritized failures**:
> - **1.2.1 — Anonymous auth enabled** — `[Level 1, High priority]` — direct security consequence: unauthenticated requests are treated as `system:anonymous`. Set `--anonymous-auth=false`.
> - **1.2.22 — Audit logging not configured** — `[Level 1, High priority]` — no audit trail exists. Configure an audit policy per benchmark guidance.
>
> **Not applicable**:
> - Level 2 audit log max-age control — marked N/A since audit logging itself isn't yet configured (control 1.2.22 above); will become applicable once that's remediated.
>
> **Overall verdict**: the 90% pass rate looks strong in isolation, but both failing controls have direct, severe security consequences (unauthenticated access risk, no audit trail) — prioritize these two over pursuing additional Level 2 controls, which are lower-impact by comparison.

This example is illustrative — a real assessment depends entirely on the actual system configuration and applicable benchmark version.
