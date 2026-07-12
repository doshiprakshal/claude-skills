# Runbook Generator

Generates a service-specific incident-response runbook from its actual Kubernetes configuration and dependencies — likely failure modes grounded in real config, key diagnostic commands, rollback procedure, and escalation path.

See `SKILL.md` for the full workflow.

## How to invoke

- "Generate a runbook for `checkout-api`."
- "Create on-call docs for this service."
- "Write an incident response doc for this workload before it goes on-call."

## Example

### Input

`checkout-api` manifest: memory limit `256Mi` (tight relative to a JVM app with `-Xmx200m`, leaving little non-heap headroom); no PDB; depends on `postgres.data.svc` and an external payments API referenced via env var, no visible retry config; deployed via ArgoCD.

### Output (abbreviated)

> **Service overview & dependencies**
> `checkout-api` — a JVM service deployed via ArgoCD (app `checkout-api` in the `platform` ArgoCD project). Depends on `postgres.data.svc` (internal) and an external payments API (via `PAYMENTS_API_URL` env var, no retry/circuit-breaker config visible).
>
> **Likely failure modes**
> - **OOMKilled** — memory limit is 256Mi with a JVM heap flag of `-Xmx200m`, leaving only ~56Mi for non-heap memory (metaspace, thread stacks, direct buffers) — tighter than typical. If paged for this service, check for `OOMKilled` first via `kubectl describe pod` and run the `oomkilled` skill.
> - **Brief unavailability during node maintenance** — no PodDisruptionBudget is configured, so a node drain or Cluster Autoscaler scale-down could evict all replicas without the usual voluntary-disruption protection. Run `pdb-review` before any planned maintenance affecting this service.
> - **Cascading failure from the payments API** — no retry/circuit-breaker configuration is visible around the external payments API call. If this service is unhealthy, check whether the payments API itself is degraded before assuming the problem is local.
>
> **Key commands/dashboards**
> - `kubectl describe pod -l app=checkout-api -n platform` — check current pod status/events first.
> - `kubectl logs -l app=checkout-api -n platform --previous` — crash logs if restarting.
> - *(Dashboard link: not provided — add your Grafana/metrics dashboard URL here.)*
>
> **Rollback procedure**
> Deployed via ArgoCD — roll back by syncing the app to the previous Git revision (`argocd app rollback checkout-api <previous-revision-id>`), not a manual `kubectl rollout undo`, since ArgoCD will otherwise resync back to the current Git state.
>
> **Escalation path**
> *(Not provided — add the on-call rotation/escalation contact for this service here.)*

This example is illustrative — a real runbook depends entirely on the actual configuration and dependencies discovered for the target workload, and should be filled in with real dashboard links and escalation contacts.
