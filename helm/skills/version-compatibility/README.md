# Helm Chart Version Compatibility

Checks whether a chart is compatible with a target Kubernetes cluster version — `kubeVersion` constraint, every templated `apiVersion` against the target's supported/removed APIs, and bundled CRD requirements.

See `SKILL.md` for the full workflow.

## How to invoke

- "Is this chart compatible with Kubernetes 1.30?"
- "Check Helm chart Kubernetes version compatibility."
- "Will this chart work on our cluster version?"

## Example

### Input

Chart has no `kubeVersion` field set in `Chart.yaml`. Rendered output (with production values) includes a `PodDisruptionBudget` using `policy/v1beta1`. Target cluster version: `1.28`.

### Output (abbreviated)

> **Compatibility verdict**
> ❌ Incompatible with Kubernetes 1.28.
>
> **Findings**
> - **No `kubeVersion` constraint set** — `[Medium]` — nothing in the chart itself prevents installing on an unsupported cluster version; the failure users would hit is a confusing API rejection rather than a clear Helm-level error. Recommend adding `kubeVersion: ">=1.25.0"` (or whatever the actual floor is) once the issue below is fixed.
> - **`PodDisruptionBudget` uses `policy/v1beta1`** — `[Blocker]` — this API was removed in Kubernetes 1.25. The target cluster (1.28) will reject this resource outright; `helm install`/`upgrade` will fail on this resource specifically.
>
> **Recommended fix**
> Update the PDB template to `policy/v1`, then add a `kubeVersion` constraint reflecting the chart's actual minimum supported version to prevent this class of surprise in the future.

This example is illustrative — a real check depends entirely on the actual chart and target version.
