---
name: production-review
description: Review a Helm chart and its values for production readiness — Helm-packaging-specific concerns like environment values separation, secrets not committed to values files, hook safety, and dependency pinning — complementing (not duplicating) a rendered-manifest review. Triggers on "is this helm chart production ready", "review our chart for prod", "helm production readiness review".
user-invocable: true
---

# Helm Production Review

Review a Helm chart's production readiness from the packaging/release-management angle — not the rendered Kubernetes manifests themselves (render the chart and run the `kubernetes` domain's `production-readiness-review` for that), but the Helm-specific concerns that only exist because this is a chart: values file separation, hook safety, dependency pinning, and whether the chart is actually safe to parameterize per environment.

## When to use

- Before a chart's first production install.
- The user asks whether a chart is production-ready.

**Out of scope**:
- Deep rendered-manifest correctness (probes, resource limits, replica counts, relationship validation) → render the chart with `helm template` and run `production-readiness-review` from the `kubernetes` domain
- Chart authoring conventions in general (not production-specific) → `chart-best-practices`
- Deep security posture → `security-review` (this skill's Helm-specific security angle) and `kubernetes/security-review` (rendered-manifest angle)

## Inputs

- The chart (`Chart.yaml`, `templates/`, `values.yaml`).
- All environment-specific values files (e.g., `values-prod.yaml`, `values-staging.yaml`), if they exist.
- Target Kubernetes cluster version, if known.

## Workflow

### 1. Discover

Gather the chart and every values file in the reviewed scope. Render with `helm template` using the production values combination specifically.

### 2. Checks

- **Values file separation** — does a distinct production values file (or equivalent override mechanism) exist, or is production configured via ad hoc `--set` flags at install time with no committed record of what was actually deployed?
- **No secrets in values files** — scan values files for anything that looks like a credential, API key, or private key committed in plaintext.
- **Hook safety** — review any `helm.sh/hook` annotated resources (pre-install, post-upgrade, pre-delete Jobs, etc.): do they have resource limits, are they idempotent (safe to re-run if a hook fails partway), could a failing/hanging hook block the whole release indefinitely?
- **Dependency pinning** — `Chart.yaml` dependencies pinned to specific/range versions appropriately, not left unconstrained.
- **`kubeVersion` constraint** — set and matches the intended target cluster(s).
- **No dev-only leakage into prod values** — check the prod values combination for debug flags, verbose logging, insecure ports/protocols, or `NodePort`-style dev conveniences that shouldn't reach production.
- **Templated, not hardcoded, resource config** — resource requests/limits, replica counts, and similar tunables are exposed as values rather than hardcoded in templates, so they can actually be adjusted per environment without editing the chart itself.

### 3. Report

1. **Findings** — each with evidence, severity (Blocker/High/Medium/Advisory), and recommended fix.
2. **Reminder** — explicitly note that this review covers Helm packaging concerns only, and recommend running `kubernetes/production-readiness-review` against the rendered prod-values output for the full manifest-level check.

## Notes

- Don't re-derive the rendered-manifest checks already owned by `kubernetes/production-readiness-review` — point to it explicitly rather than duplicating.
- A chart with no separate prod values file isn't automatically wrong (small teams sometimes intentionally use one values file with environment-specific overrides via `-f`), but the absence of any committed record of what was actually deployed to prod is a real gap worth flagging.
