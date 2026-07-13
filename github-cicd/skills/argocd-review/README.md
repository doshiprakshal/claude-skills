# ArgoCD Review

Reviews ArgoCD Application/AppProject configuration — auto-sync and prune safety, sync wave/hook ordering, RBAC scope, and app-of-apps structure.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our ArgoCD setup."
- "Is auto-sync with prune safe here?"
- "ArgoCD RBAC review."

## Example

### Input

`payments-api` Application has `automated: { prune: true, selfHeal: true }`, uses the `default` AppProject (unrestricted), and `argocd-rbac-cm` grants every authenticated user the built-in `role:admin`.

### Output (abbreviated)

> **Findings**
>
> - **Every authenticated user has admin RBAC** — `[Blocker]` — `argocd-rbac-cm` grants `role:admin` broadly, meaning any authenticated user can sync, delete, or modify any Application, including production ones. Scope RBAC to specific roles (read-only for most users, sync/admin restricted to the teams that own each project).
> - **`default` AppProject provides no isolation** — `[High]` — `payments-api` uses the unrestricted default project, meaning nothing stops this Application (or any other) from being pointed at a different repo/cluster/namespace than intended. Create a dedicated AppProject scoping `payments-api` to its actual repo and target namespace.
> - **`selfHeal: true` will revert manual incident fixes** — `[Medium — informational]` — worth explicitly confirming the on-call team knows that any manual `kubectl edit`/`patch` during an incident will be automatically reverted by ArgoCD within its sync interval. Document this clearly in runbooks so it doesn't cause confusion during a live incident.
>
> **Overall verdict**
> The broad admin RBAC grant is the most urgent — it means access control on this ArgoCD instance is effectively nonexistent today. Fix that first, then scope the AppProject.

This example is illustrative — a real review depends entirely on the actual ArgoCD configuration discovered for the target instance.
