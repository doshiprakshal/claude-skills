# Terraform Multi-Cloud Review

Reviews a Terraform codebase spanning multiple cloud providers — consistency of approach, whether abstraction across providers is helping or hurting, and provider-specific pitfalls.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our multi-cloud Terraform setup."
- "Are we handling multiple providers well?"
- "Should we abstract across AWS and GCP?"

## Example

### Input

A shared `compute` module attempts to abstract EC2 and GCE behind one interface with a `provider = "aws" | "gcp"` variable. The module has grown to include 12 provider-specific conditional blocks (`count = var.provider == "aws" ? 1 : 0`) to handle differences in disk attachment, networking, and instance metadata between the two clouds.

### Output (abbreviated)

> **Findings**
>
> - **Abstraction is leaking heavily** — `[High]` — the shared `compute` module now has 12 separate conditional branches to handle AWS/GCP differences, which is close to the complexity of just writing two separate modules, but harder to read and reason about because both providers' logic is interleaved in every file. This is a common outcome of abstracting too early across genuinely different provider semantics (disk attachment and instance metadata work meaningfully differently between EC2 and GCE). Recommend splitting into two provider-specific modules (`compute-aws`, `compute-gcp`) with a much thinner shared interface (just the variables/outputs that are genuinely common), rather than one module trying to hide the differences.
> - **Inconsistent rigor across providers** — `[Medium]` — the AWS side has IAM least-privilege review already applied (per a past `iam-review`), but the GCP side's service account permissions haven't had an equivalent pass. Recommend applying the same review rigor to GCP IAM.
>
> **Overall verdict**
> The abstraction attempt is the central issue — it's adding complexity rather than reducing it at the current level of provider divergence. Splitting into two thinner, provider-specific modules would likely be both simpler and safer than continuing to extend the current shared module.

This example is illustrative — a real review depends entirely on the actual multi-cloud structure discovered for the target codebase.
