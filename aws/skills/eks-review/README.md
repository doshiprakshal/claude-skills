# EKS Review

Reviews AWS-specific EKS concerns — control plane version support window, node group configuration, IAM Roles for Service Accounts (IRSA) setup, and managed add-on currency.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our EKS cluster."
- "Is our EKS version supported?"
- "EKS IRSA review."

## Example

### Input

Cluster running EKS 1.24 (past standard support, now in extended support at extra cost). IRSA role for a `payments` service account has trust policy condition `"oidc:sub": "system:serviceaccount:payments:*"` (wildcard matching any service account in the namespace, not just the intended one).

### Output (abbreviated)

> **Findings**
>
> - **Cluster on extended support (1.24)** — `[High]` — this version is past AWS's standard EKS support window, incurring extended support fees and missing the latest security patches available on supported versions. Plan an upgrade (see `kubernetes/upgrade-planner` for the workload-manifest-compatibility side).
> - **IRSA trust policy uses a wildcard service account match** — `[High]` — the trust condition `system:serviceaccount:payments:*` allows *any* service account created in the `payments` namespace to assume this IAM role, not just the intended one. If another team or a future service account is created in that namespace, it silently gains this role's AWS permissions. Scope the condition to the exact service account: `system:serviceaccount:payments:payments-api`.
>
> **Overall verdict**
> The IRSA wildcard is the more urgent fix — it's a live privilege-escalation path today, not a future risk like the version support window. Fix both, starting with IRSA.

This example is illustrative — a real review depends entirely on the actual EKS configuration discovered for the target cluster.
