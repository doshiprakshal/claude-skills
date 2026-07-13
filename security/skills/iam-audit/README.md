# IAM Audit

Audits machine/service identity and access management posture across platforms — least privilege, credential lifecycle, and cross-account/cross-cloud trust.

See `SKILL.md` for the full workflow.

## How to invoke

- "Audit our IAM posture across clouds."
- "Are we following least privilege across our platforms?"
- "Cross-cloud IAM audit."

## Example

### Input

Org uses AWS and GCP. An AWS IAM role used by a GCP-hosted CI pipeline has a trust policy allowing assumption from any principal in the GCP project's default service account pool, not a specific pipeline identity. Several AWS access keys (not roles) are in use for legacy scripts, last rotated over a year ago with no rotation policy.

### Output (abbreviated)

> **Findings**
>
> - **Overly broad cross-cloud trust relationship** — `[Blocker]` — the AWS role trusts any principal in the GCP project's default service account pool rather than a specific, narrowly-scoped identity, meaning any workload in that GCP project (not just the intended CI pipeline) could assume this AWS role. Scope the trust policy to the specific service account/workload identity used by the pipeline.
> - **Long-lived, unrotated AWS access keys** — `[High]` — legacy scripts use static access keys unrotated for over a year, with no rotation policy in place. Migrate to short-lived credentials (IAM roles/OIDC federation) where possible; if static keys must remain, establish a rotation policy and enforce it.
> - **Recommend platform-specific follow-up**: for the specific AWS permissions attached to the affected role, use `aws/iam-security` for a permission-by-permission least-privilege review once the trust relationship itself is scoped down.
>
> **Overall verdict**: the cross-cloud trust relationship is the most severe finding — it undermines least-privilege work on the AWS side regardless of how tightly the role's own permissions are scoped, since the wrong identities can currently assume it in the first place.

This example is illustrative — a real audit depends entirely on the actual identities and trust relationships discovered across the target platforms.
