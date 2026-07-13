# Admission Controller Review

Reviews Kubernetes admission control configuration — enforcement mode, policy coverage, correctness, bypass paths, and fail-open/closed behavior.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our OPA Gatekeeper policies."
- "Are our Kyverno policies actually enforcing what we think?"
- "Audit our admission controller coverage."

## Example

### Input

Gatekeeper is installed with a constraint template blocking privileged containers. The constraint's `enforcementAction` is set to `dryrun`. A separate constraint blocking containers without resource limits applies only to the `default` namespace, not cluster-wide. Gatekeeper's `failurePolicy` is set to `Ignore`.

### Output (abbreviated)

> **Findings**
>
> - **Privileged-container policy is in dry-run mode, not enforced** — `[Blocker]` — despite the policy existing and presumably being trusted as "we block privileged containers," `enforcementAction: dryrun` means violations are logged but never actually blocked. Any privileged pod can currently be deployed. Change to `deny` once confirmed safe against current workloads.
> - **Resource-limits policy scoped only to `default` namespace** — `[High]` — likely an incomplete rollout rather than an intentional exemption; workloads in every other namespace can be deployed without resource limits, undermining the policy's intended coverage. Confirm intent and expand scope if unintentional.
> - **`failurePolicy: Ignore` means admission fails open if Gatekeeper is unavailable** — `[High]` — during a Gatekeeper outage, all admission requests are allowed through with no policy enforcement at all, silently disabling every policy simultaneously. Consider `Fail` (fail-closed) for policies where enforcement is critical, weighed against the availability risk of blocking all deployments during a Gatekeeper outage.
>
> **Overall verdict**: the dry-run privileged-container policy is the most severe finding — it creates false confidence that a critical control is active when it currently blocks nothing.

This example is illustrative — a real review depends entirely on the actual policy engine configuration and installed policies.
