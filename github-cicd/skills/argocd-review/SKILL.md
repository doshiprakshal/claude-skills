---
name: argocd-review
description: Review ArgoCD Application/AppProject configuration — auto-sync and prune safety, sync wave/hook ordering, RBAC scope, and app-of-apps structure. Triggers on "review our argocd setup", "is auto-sync with prune safe here", "argocd rbac review", "argocd app-of-apps structure review".
user-invocable: true
---

# ArgoCD Review

Review ArgoCD's GitOps configuration — Application/AppProject resources, sync policy safety, and access control.

## When to use

- Reviewing ArgoCD Application configuration before enabling auto-sync/prune.
- The user asks whether their ArgoCD RBAC or app structure is sound.

**Out of scope**:
- The Kubernetes manifests/Helm charts ArgoCD deploys → the relevant `kubernetes`/`helm` domain skill
- Live rollout monitoring of a specific sync → `kubernetes/deployment-rollout-review`

## Inputs

- ArgoCD `Application` and `AppProject` resources.
- RBAC policy (`argocd-rbac-cm`).
- Sync policy settings (automated sync, prune, self-heal) per Application.

## Workflow

### 1. Discover

Gather Application/AppProject definitions and RBAC config.

### 2. Checks

- **Auto-sync + prune safety** — `automated: { prune: true }` enabled only where the team genuinely wants Git to be the sole source of truth with automatic deletion of anything removed from Git — accidental prune of a manually-created-but-needed resource is a real risk if this is enabled without understanding the implication.
- **Sync wave/hook ordering** — `PreSync`/`PostSync` hooks and sync waves correctly sequence dependent resources (e.g., CRDs before the resources that use them).
- **AppProject scoping** — `AppProject` restricts which repos/clusters/namespaces/resource kinds an Application within it can touch, rather than every Application having unrestricted access via the default project.
- **RBAC policy** — `argocd-rbac-cm` grants scoped roles (read-only for most, sync/admin restricted to specific teams/projects) rather than broad admin access by default.
- **App-of-apps structure** — if used, the parent/child Application structure is clear and doesn't create circular or unclear ownership of resources across apps.
- **Self-heal implications** — `selfHeal: true` combined with prune means manual `kubectl` changes get silently reverted — confirm this is understood/intended, since it can be confusing during an active incident if someone manually patches a resource expecting it to stick.

### 3. Report

Findings grouped by Auto-Sync/Prune Safety, Sync Ordering, Project Scoping, RBAC, App Structure, Self-Heal, each with severity and fix.

## Notes

- `selfHeal: true` reverting a manual incident-time fix is a real, non-obvious gotcha worth flagging explicitly — it can turn a "temporary manual mitigation" into a confusing repeated failure if the on-call engineer doesn't know ArgoCD will revert it.
- Default `AppProject` (unrestricted) is a common gap when teams start with ArgoCD and never revisit project scoping as more Applications are added.
