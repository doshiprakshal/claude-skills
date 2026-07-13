---
name: version-compatibility
description: Check a Helm chart's compatibility against a target Kubernetes cluster version — Chart.yaml's kubeVersion constraint, every templated apiVersion checked against the target cluster's supported/removed APIs, and any bundled CRD version requirements. Triggers on "is this chart compatible with kubernetes 1.30", "check helm chart kubernetes version compatibility", "will this chart work on our cluster version".
user-invocable: true
---

# Helm Chart Version Compatibility

Check whether a specific chart is compatible with a target Kubernetes cluster version — extending `kubernetes/manifest-validation`'s deprecation logic to the chart level, plus the chart's own declared `kubeVersion` constraint and any bundled CRD requirements.

## When to use

- Before installing a chart on a specific cluster version.
- Planning a cluster upgrade and needing to know whether currently-installed charts will still work (pairs with `kubernetes/upgrade-planner` for the cluster-wide version).

**Out of scope**:
- Full cluster-wide upgrade planning across many manifests → `kubernetes/upgrade-planner`
- Chart's own version/dependency pinning discipline unrelated to Kubernetes compatibility → `dependency-review`

## Inputs

- The chart (`Chart.yaml`, `templates/`, `crds/`).
- Target Kubernetes cluster version.
- Values combination to render with (API usage can vary based on conditionally-rendered templates).

## Workflow

### 1. Discover

Gather the chart and render it with the intended values combination against the target version context if `helm template --kube-version` is available (this makes Helm's own built-in `Capabilities.KubeVersion`-gated logic render correctly for the target).

### 2. Checks

- **`kubeVersion` constraint** — does `Chart.yaml`'s `kubeVersion` field (if set) actually permit the target cluster version? Flag if unset entirely (no guardrail at all) or if it's set but doesn't match reality (looser or stricter than what the templates actually require).
- **Templated `apiVersion`s** — for every rendered resource, check its `apiVersion` against the target cluster version's removal/deprecation status (same logic as `kubernetes/manifest-validation`, applied here to the chart's rendered output specifically).
- **Bundled CRD versions** — if the chart ships CRDs in `crds/`, check whether those CRD versions are compatible with the target cluster, and note that Helm won't auto-upgrade them on a future chart upgrade (cross-reference `upgrade-risk-analysis` for that angle).
- **Helm capabilities-gated logic** — if the chart uses `{{ if .Capabilities.KubeVersion... }}`-style conditionals, confirm they resolve correctly for the target version and don't silently omit something needed.

### 3. Report

1. **Compatibility verdict** — Compatible / Compatible with warnings / Incompatible.
2. **Findings** — each apiVersion issue or kubeVersion mismatch, with the exact resource/field and the version it breaks at.

## Notes

- Always render with the values combination actually intended for use — conditional templates can use different API versions depending on values, so a generic "does this chart support version X" check without specifying values can miss a real issue.
- If `kubeVersion` isn't set at all, that's a finding in itself — it means nothing stops someone from installing the chart on an incompatible cluster and getting a confusing failure instead of a clear rejection.
