# Manifest Validation

Validates Kubernetes manifests for syntactic and schema correctness — YAML parse errors, missing/wrong fields, deprecated API versions, duplicate resource identities, naming violations. Purely mechanical: no judgment calls, no severity gradient beyond Error/Warning. Runs before any judgment-based review (`production-readiness-review`, `architecture-review`) is worth doing.

See `SKILL.md` for the full workflow this skill follows.

## How to invoke

- "Validate my k8s manifests."
- "Check this YAML for errors."
- "Will this apiVersion break on our next cluster upgrade?"
- "Lint my kubernetes yaml."

## Example

### Input

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: worker
spec:
  replica: 3           # typo — should be "replicas"
  selector:
    matchLabels: { app: worker }
  template:
    metadata:
      labels: { app: worker }
    spec:
      containers:
        - name: worker
          image: registry.internal/worker:2.3.1
---
# pdb.yaml
apiVersion: policy/v1beta1     # removed in Kubernetes 1.25+
kind: PodDisruptionBudget
metadata:
  name: worker-pdb
spec:
  minAvailable: 1
  selector:
    matchLabels: { app: worker }
---
# duplicate.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: worker           # same kind+namespace+name as deployment.yaml — silently overwrites it
spec:
  replicas: 1
  selector:
    matchLabels: { app: worker-v2 }
  template:
    metadata:
      labels: { app: worker-v2 }
    spec:
      containers:
        - name: worker
          image: registry.internal/worker:2.3.1
```

Target cluster version given: `1.28`.

### Output (abbreviated)

> **Per-resource table**
>
> | File | Kind | Name | Status |
> |---|---|---|---|
> | deployment.yaml | Deployment | worker | **Invalid** |
> | pdb.yaml | PodDisruptionBudget | worker-pdb | **Invalid** |
> | duplicate.yaml | Deployment | worker | **Invalid** (duplicate identity) |
>
> **Errors**
>
> - `deployment.yaml`, `Deployment/worker`, field `spec.replica` — not a valid field on `Deployment.spec` (did you mean `replicas`?). Fix: rename to `replicas`.
> - `pdb.yaml`, `PodDisruptionBudget/worker-pdb`, `apiVersion: policy/v1beta1` — **removed** in the target cluster version `1.28` (removed in 1.25). Fix: change to `policy/v1`.
> - `duplicate.yaml` and `deployment.yaml` both define `Deployment` `worker` in the same namespace — the second definition silently overwrites the first on apply. Fix: rename one of them or remove the duplicate.
>
> **Warnings**
>
> *(none — the one deprecated API found is already past removal, reported as an Error above, not a Warning)*
>
> **Cannot verify**
>
> - None — target cluster version (`1.28`) was provided, so all deprecation checks were fully evaluated.
>
> **Overall verdict**
>
> ❌ Invalid — 3 errors, 0 warnings.

This example is illustrative — a real validation run depends entirely on what's actually discovered in the target manifests.
