# Production Readiness Review

Reviews an entire Kubernetes application — not a single workload in isolation — for production readiness. Discovers manifests (raw YAML, Helm, or Kustomize), builds a resource inventory, validates how resources actually relate to each other, then evaluates readiness using both deterministic checks and engineering judgment. Ends with one application-level launch decision.

See `SKILL.md` for the full workflow this skill follows.

## How to invoke

Point Claude at a repo, directory, chart, or pasted manifests and ask something like:

- "Is this app production ready?"
- "Review my k8s manifests for prod."
- "Run a production readiness review on `./deploy`."
- "Am I ready to deploy this to production?"

## Example

### Input

A small app: one `Deployment`, one `Service`, one `HorizontalPodAutoscaler`, no `PodDisruptionBudget`.

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: payments-api
spec:
  replicas: 1
  selector:
    matchLabels: { app: payments }
  template:
    metadata:
      labels: { app: payments }
    spec:
      containers:
        - name: payments-api
          image: registry.internal/payments-api:latest
          ports:
            - containerPort: 8080
          resources:
            requests: { cpu: 100m, memory: 128Mi }
---
# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: payments-api-svc
spec:
  selector: { app: payments-api }   # mismatched — Deployment labels are "payments"
  ports:
    - port: 80
      targetPort: 8080
---
# hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: payments-api-hpa
spec:
  scaleTargetRef: { apiVersion: apps/v1, kind: Deployment, name: payments-api }
  minReplicas: 1
  maxReplicas: 5
  metrics:
    - type: Resource
      resource: { name: cpu, target: { type: Utilization, averageUtilization: 70 } }
```

### Output (abbreviated)

```markdown
## Resources discovered
Deployments: 1
Services: 1
HPAs: 1
PDBs: 0

## Resource relationship validation
- Service `payments-api-svc` selector `app=payments-api` — no workload has this label (Deployment uses `app=payments`) — **Failed**
- HPA `payments-api-hpa` scaleTargetRef → Deployment `payments-api` — exists — **Passed**
- HPA target has resource requests set — **Passed** (cpu request present; scaling will work)
- PDB selector matches workload — **N/A** (no PDB defined)

## Findings

### PRR-001 — Service selector doesn't match any pod  [Blocker]
**Finding:** `payments-api-svc` selects `app=payments-api`, but the Deployment's pods are labeled `app=payments`.
**Why it matters:** The Service has zero endpoints — it's not routing traffic to anything right now.
**Evidence:** `service.yaml` selector vs. `deployment.yaml` template labels.
**Recommended fix:** Align the selector to `app: payments` (or relabel the pods) — pick one and make both sides match.

### PRR-002 — Image tag is `latest`  [Blocker]
**Finding:** Container image is `registry.internal/payments-api:latest`.
**Why it matters:** Rollouts become non-reproducible and rollback to a known-good image isn't possible.
**Evidence:** `deployment.yaml` container image.
**Recommended fix:** Pin to a specific tag or digest.

### PRR-003 — Single replica with an HPA that allows scaling to 1  [Medium — context-dependent]
**Finding:** `minReplicas: 1` means the app can run on a single pod with no redundancy.
**Why it matters:** Any node failure or rollout causes a brief full outage; depends on whether "payments-api" is actually latency/availability critical.
**Evidence:** `hpa.yaml` minReplicas, no PDB present.
**Recommended fix:** If this service is user-facing/critical, raise `minReplicas` to 2 and add a PDB. Flagged as context-dependent — confirm criticality before treating as a blocker.

### PRR-004 — No readiness probe  [High]
**Finding:** Container defines no `readinessProbe`.
**Why it matters:** Kubernetes will route traffic to the pod before the app is actually ready to serve, causing request failures during startup/rollout.
**Evidence:** `deployment.yaml` container spec.
**Recommended fix:** Add a `readinessProbe` (HTTP/TCP/exec) matching how the app signals readiness.

## Cannot verify
- Whether `payments-api` exposes a metrics endpoint (no scrape annotation/ServiceMonitor found — can't confirm without runtime access)
- Actual traffic pattern / criticality of this service (affects severity of PRR-003)

## Launch Decision

❌ Not ready

**Must fix before launch:** PRR-001, PRR-002
**Validate before launch (context-dependent):** PRR-003
**Can improve later:** PRR-004
```

This example is illustrative — a real review depends entirely on what's actually discovered in the target application.
