---
name: production-readiness-review
description: Review an entire Kubernetes application — not a single workload — for production readiness. Discovers all manifests (raw YAML, Helm charts/rendered output, Kustomize), builds a resource inventory, validates relationships between Services, Ingresses, HPAs, PDBs, RBAC, ConfigMaps, Secrets, PVCs, and NetworkPolicies, then evaluates readiness using both deterministic checks and engineering judgment. Produces one application-level launch decision. Triggers on "is this app production ready", "review my k8s app for prod", "production readiness review", "am I ready to deploy this to production", "k8s production checklist", "prod readiness check".
user-invocable: true
---

# Kubernetes Production Readiness Review

Review an entire application's Kubernetes footprint for production readiness — not one workload in isolation. Discover every manifest, understand how the resources relate to each other, then judge readiness the way a senior engineer would: distinguishing facts from risk, risk from best practice, and always saying so explicitly when you can't verify something rather than guessing.

## When to use

- Before an application's first deploy to a production cluster/namespace.
- When the user points you at a repo, directory, chart, or set of manifests and asks if it's "ready for prod".
- As a pre-merge check on a full application's k8s manifests (multiple workloads + their supporting resources).

Do not use this for deep security auditing (see `security-review`), broader cluster/topology architecture concerns (see `architecture-review`), or YAML/schema correctness (see `manifest-validation`) — this skill assumes manifests are syntactically valid and focuses on whether the *application as a whole* is safe to run in production.

## Workflow

Work through the phases below in order. Do not ask the user for manifests before attempting discovery — only ask when something is genuinely missing and its absence would change the verdict.

### Phase 0 — Discover

1. Figure out what you're looking at:
   - **Raw manifests** — YAML files, typically under `k8s/`, `deploy/`, `manifests/`, or similar.
   - **Helm chart** — `Chart.yaml` present. If only templates + `values.yaml` exist (not rendered), render it first: `helm template <release-name> <chart-path> -f <values-file>`. Do not try to reason about `{{ .Values.* }}` template syntax directly — you need the rendered output.
   - **Kustomize** — `kustomization.yaml` present. Render with `kubectl kustomize <dir>` (or `kustomize build <dir>`) before reviewing.
   - If given a repo path with no obvious location, search common directories and file extensions (`*.yaml`, `*.yml`, `Chart.yaml`, `kustomization.yaml`) before asking the user where to look.
2. Parse every discovered/rendered resource into an inventory grouped by `kind`.
3. If Helm/Kustomize can't be rendered (tool unavailable, values file missing), say so explicitly and ask for either the rendered manifests or the missing input — don't guess at templated values.

### Phase 1 — Build the inventory

Count resources by kind across the whole application. This is reported to the user before any findings (see Report format) so they know what was actually reviewed.

### Phase 2 — Resource relationship validation

This is the core differentiator of this skill: validate how resources actually connect, not just whether each one individually looks fine in isolation. For each relationship below, mark **Passed**, **Failed**, or **Cannot verify**:

- Service `selector` matches labels on some Deployment/StatefulSet pod template.
- Service `targetPort` exists on the container it's meant to route to.
- Ingress backend references a Service that exists.
- Ingress backend port exists on that Service.
- HPA `scaleTargetRef` points to a Deployment/StatefulSet that exists.
- HPA's target workload has resource requests set (resource-based HPA scaling silently does nothing without them — this is a common, easy-to-miss break).
- PDB `selector` matches an existing workload's labels (a PDB that matches nothing protects nothing).
- ConfigMap references (`envFrom`, `env.valueFrom`, volume mounts) resolve to ConfigMaps present in the manifest set.
- Secret references resolve to Secrets present in the manifest set, or to a recognizable external-secret mechanism (e.g., `ExternalSecret`, `SealedSecret`, Vault annotations) — if neither, flag as Failed, not Cannot verify.
- PVC references (`volumeClaimTemplates`, pod volumes) resolve to a PVC/StorageClass that exists.
- ServiceAccount referenced by a workload exists (or is the implicit `default` — flag as advisory, not a failure).
- RoleBinding/ClusterRoleBinding subjects reference ServiceAccounts that actually exist.
- NetworkPolicies, if present, permit the traffic implied by the discovered Services/Ingresses (e.g., ingress-controller namespace can actually reach the app; intra-app service-to-service calls aren't accidentally blocked).

### Phase 3 — Deterministic checks

Objective, unambiguous, per-workload facts — no judgment calls here, just true/false, tagged **Passed** / **Failed** / **Cannot verify**:

- Readiness probe present.
- Liveness probe present.
- Image tag is `latest` or absent.
- Resource requests present.
- Resource limits present (track missing-requests and missing-limits separately — they have different implications).
- Deprecated/removed API versions in use (e.g., `extensions/v1beta1`, pre-1.25 `policy/v1beta1` PolicyDisruptionBudget, etc.) — check against the target cluster version if known.
- PodDisruptionBudget missing for a multi-replica workload.
- `replicas: 1` present (record as fact only — severity is decided in Phase 4 based on context, not automatically).
- Plaintext-looking credentials in env vars (obvious secret material not sourced from a Secret).

### Phase 4 — Engineering reasoning

This is where judgment replaces checklist matching — it's what makes the review valuable rather than a linter. Using the full inventory and the facts from Phases 2–3, reason about questions like:

- Is the rollout strategy (`maxUnavailable`/`maxSurge`) actually risky given this workload's replica count and apparent traffic role?
- Is the HPA configuration (min/max replicas, target metric) sane for what this workload appears to be (e.g., `min: 1, max: 2` on something named `payments-api` deserves scrutiny)?
- Is anti-affinity/topology spread sufficient given replica count and any visible node-pool/zone assumptions?
- Could the deployment strategy cause real downtime (e.g., single replica + `RollingUpdate` with `maxUnavailable: 1` implies a full outage window on every rollout)?
- Is the scaling strategy internally consistent (e.g., an HPA exists, but the PDB still allows all replicas to be evicted simultaneously)?
- Do scheduling choices (`nodeSelector`, tolerations, affinity) quietly reduce resilience (e.g., pinned to a single zone/node pool)?
- For stateful workloads: is the `StorageClass`/`accessModes`/retention policy consistent with the durability the workload actually needs? Is volume expansion supported if growth is likely?
- Do init containers encode ordering dependencies (DB migrations, config prefetch) that could fail silently, race, or aren't idempotent/lock-protected?
- Is the gap between readiness and liveness probe behavior wide enough to avoid restart loops during slow dependency startup, without masking real hangs?

For every reasoning-based finding, classify it honestly as one of:

- **Confirmed issue** — the manifests/inventory show this is definitely a problem, independent of context.
- **Context-dependent risk** — depends on information you don't have (traffic pattern, criticality, team convention). Ask the user only if the answer would change the verdict; otherwise, state the assumption you're making and flag it as context-dependent.
- **Best practice** — not wrong, but a stronger option exists; no near-term risk.

Never auto-classify severity purely from a checklist match (e.g., "single replica ⇒ Blocker" is wrong by default) — decide severity from what the workload actually appears to be and what the inventory shows around it (Is there a PDB? Multiple replicas of something else fronting it? Is it a batch Job vs. a user-facing API?).

### Phase 5 — Deployment safety, storage, and maintainability

Check across the whole application, not per-workload:

**Deployment safety** — `maxUnavailable`/`maxSurge` sanity, rollback path (Deployment revision history / Helm release history available), startup ordering across dependent workloads, database/schema migration risk (auto-run migration Jobs/init containers without idempotency or locking), init container dependency chains.

**Storage** — PVC binding status/assumptions, StatefulSet-specific safety (ordinal identity, volume-per-replica correctness), `StorageClass` assumptions (does it exist, does it support what's being asked of it), `accessModes` correctness for the access pattern, volume expansion support, retention/reclaim policy on deletion.

**Maintainability** — deprecated APIs anywhere in the manifest set, Kubernetes version compatibility if the target cluster version is known, naming/label consistency (`app.kubernetes.io/*` conventions) across resources, ownership/documentation signals (owner annotations, README), environment separation (hardcoded namespace/hostnames/values that would break if reused across environments).

### Phase 6 — Severity assignment

Assign exactly one severity to every confirmed or context-dependent finding:

- **Blocker** — will cause an outage, data loss, or leaves the application unreachable/broken at deploy time.
- **High** — significant operational risk under realistic conditions (node failure, traffic spike, slow dependency) — not certain to fail immediately, but likely to under normal production stress.
- **Medium** — a real gap, but with limited blast radius or an easy operational mitigation in the short term.
- **Advisory** — best practice / maintainability improvement; no near-term operational risk.

Give every finding a stable ID (`PRR-001`, `PRR-002`, ...) so the user can track resolution across a re-review.

## Report format

Produce, in this order:

**1. Resources discovered**
```
Deployments: 3
StatefulSets: 1
Services: 4
Ingress: 2
HPAs: 2
PDBs: 1
ServiceAccounts: 2
Secrets: 6
ConfigMaps: 4
PVCs: 2
NetworkPolicies: 3
```

**2. Resource relationship validation** — one line per relationship checked, tagged Passed / Failed / Cannot verify, with the specific evidence (e.g., "Service `api` selector `app=api` — no workload has this label — Failed").

**3. Findings** — every deterministic and reasoning finding, in this format:
```
### PRR-001 — <short title>  [Blocker | High | Medium | Advisory]
**Finding:** <what's wrong>
**Why it matters:** <production impact if unaddressed>
**Evidence:** <file / resource / field this came from>
**Recommended fix:** <concrete fix>
```

**4. Cannot verify** — a distinct list of anything needing runtime or external information (metrics endpoint reachability, log format, real traffic pattern, expected shutdown duration under load, whether a referenced Secret is populated externally, etc.). Never count these as failures.

**5. Launch decision** — one verdict for the whole application, not per workload:
```
## Launch Decision

✅ Ready | ⚠️ Ready with follow-ups | ❌ Not ready

**Must fix before launch:** PRR-001, PRR-004
**Validate before launch (context-dependent):** PRR-006
**Can improve later:** PRR-011, PRR-012
```

## Notes

- Never apply a blanket rule (CPU limits, HPA, `preStop`, `startupProbe`, PDB, etc. are not unconditionally required) — evaluate whether each is appropriate for this specific workload's apparent role and traffic pattern, and say explicitly when something is fine as-is despite not matching a "best practice" default.
- If you cannot discover any manifests at all (empty input, no path given), ask — but only after attempting discovery first.
- Keep finding IDs stable across a conversation if the user asks for a re-review after fixes, so they can track exactly what's resolved.
