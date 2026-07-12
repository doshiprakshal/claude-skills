---
name: manifest-validation
description: Validate Kubernetes manifests for syntactic and schema correctness — YAML parse errors, missing required fields, fields that don't match the resource's schema, deprecated/removed API versions, duplicate resource identities, and naming-convention violations. Purely mechanical, no judgment calls. Triggers on "validate my k8s manifests", "check this yaml for errors", "will this apiVersion break on upgrade", "lint my kubernetes yaml", "is this manifest schema valid".
user-invocable: true
---

# Kubernetes Manifest Validation

Validate Kubernetes manifests for syntactic and schema correctness before any judgment-based review is worth running. This is the mechanical pre-flight check an engineer normally runs via `kubectl apply --dry-run`, `kubeconform`, or a CI linter — not an assessment of whether the configuration is a *good* choice.

## When to use

- Before `production-readiness-review` or `architecture-review` — confirm the manifests are valid first; those skills assume validity and focus on judgment.
- The user pastes YAML or points at manifests and asks if they're valid, will apply cleanly, or will break on a cluster upgrade.
- As a fast CI-style check on a PR touching Kubernetes manifests.

**Out of scope** — defer instead:
- Whether a valid config is a *good* one → `production-readiness-review`, `architecture-review`
- Security posture → `security-review`
- Cross-resource relationship checks (Service selector matches pod labels, Ingress backend exists, etc.) → `production-readiness-review`'s relationship-validation phase

This skill only validates each resource against its own schema — not cross-resource semantics, not judgment.

## Inputs

- Manifest files/paths or pasted YAML (raw, rendered Helm, or rendered Kustomize — same discovery convention as the other kubernetes skills: render Helm/Kustomize templates before validating, don't validate unrendered template syntax as if it were plain YAML).
- Target Kubernetes cluster version, if known — required for accurate deprecation/removal checks. If not given, ask only if the user cares about upgrade-safety checks; otherwise proceed and mark version-dependent checks as "Cannot verify without a target version."
- Any CRDs in play, if custom resources are present, so their OpenAPI schema can be checked too.

## Workflow

### 1. Discover and render

Detect raw manifests, Helm charts (render with `helm template`), or Kustomize overlays (render with `kubectl kustomize`/`kustomize build`) — same approach as `production-readiness-review`. Validate the rendered output, never unrendered template syntax.

### 2. Parse

Parse every YAML document. Report parse errors (bad indentation, duplicate keys, invalid scalar types, broken multi-doc `---` separators) with file and line number.

### 3. Schema validation

For every resource that parses successfully:
- Confirm required top-level fields are present: `apiVersion`, `kind`, `metadata.name` (and `metadata.namespace` where the kind is namespaced).
- Validate every field against the OpenAPI schema for that `apiVersion`/`kind` — catch typos (`replica` vs. `replicas`), fields that don't exist on that resource, and wrong types (string where an int is expected, etc.).
- If a cluster is reachable, prefer `kubectl apply --dry-run=server` — it validates against the live API server's schema (including installed CRDs) and is the most accurate source of truth. Otherwise, validate against static schema knowledge for the declared `apiVersion`.
- For custom resources, validate against the CRD's OpenAPI schema if the CRD definition is available; if not, mark as "Cannot verify — CRD schema not available."

### 4. Deprecation / removal check

If a target cluster version is known, check every `apiVersion` against that version's deprecation/removal status (e.g., `policy/v1beta1` PodDisruptionBudget removed in 1.25, `extensions/v1beta1` removed in 1.16, etc.). Flag:
- **Removed** in the target version → Error.
- **Deprecated** but still functional in the target version → Warning, noting the version it will actually break in.

If no target version is given, run the check against the latest stable Kubernetes release and note the assumption, or mark as "Cannot verify without a target version" if the user cares about a specific older/newer cluster.

### 5. Duplicate identity check

Flag any resource where `kind` + `namespace` + `name` is defined more than once across the manifest set — the second definition silently overwrites the first on apply, which is rarely intentional.

### 6. Naming/label convention check

Confirm `metadata.name`, label keys/values, and selector values conform to Kubernetes naming rules (DNS-1123 subdomain/label rules, 63-character limits on label values, etc.).

### 7. Report

Produce:

1. **Per-resource table** — file, kind, name, status (Valid / Invalid / Warning).
2. **Errors** — one entry per issue: file, resource, field/line, what's wrong, how to fix it. No interpretation needed — every error should be immediately actionable.
3. **Warnings** — deprecated-but-still-working APIs, with the version they'll actually break in.
4. **Cannot verify** — anything that needs information not provided (no target cluster version, no CRD schema available).
5. **Overall verdict** — `Valid` or `Invalid — N errors, M warnings`.

## Notes

- Every check here is deterministic — pass or fail, no judgment gradient. If you find yourself wanting to say "this is technically valid but a bad idea," that finding belongs in `production-readiness-review` or `architecture-review`, not here.
- Don't validate unrendered Helm/Kustomize template syntax as if it were final YAML — render first.
- Zero false positives is the bar: only report something as an error if it would genuinely fail to apply or misbehave, not because it looks unusual.
