# Namespace Audit

Audits a single namespace's hygiene — ResourceQuota/LimitRange presence, orphaned resources, and namespace-scoped RBAC.

See `SKILL.md` for the full workflow.

## How to invoke

- "Audit the `reporting` namespace."
- "Clean up this namespace."
- "What's using up this namespace?"

## Example

### Input

Namespace `reporting`: no `ResourceQuota`/`LimitRange`; 14 completed Jobs from 3+ months ago still present; 2 ConfigMaps with no referencing workload; one `RoleBinding` granting `edit` to the entire `engineering` group.

### Output (abbreviated)

> **Namespace inventory**
>
> | Item | Value |
> |---|---|
> | ResourceQuota | None |
> | LimitRange | None |
> | Completed Jobs (3+ months old) | 14 |
> | Orphaned ConfigMaps | 2 |
> | RoleBindings | 1 (`edit` → group `engineering`) |
>
> **Orphaned resources**
> - 14 completed `Job` objects from over 3 months ago with no ongoing purpose — safe to delete (`kubectl delete job` for each, or set a `ttlSecondsAfterFinished` going forward to prevent recurrence).
> - `report-template-v1`, `report-template-v2` ConfigMaps — no Deployment/Pod in the namespace references either; likely leftover from a past template migration.
>
> **Guardrail gaps**
> No `ResourceQuota` or `LimitRange` — any single workload deployed here could consume unbounded cluster resources with no ceiling.
>
> **RBAC summary**
> One `RoleBinding` grants `edit` (create/update/delete on most namespaced resources) to the entire `engineering` group. Whether this is appropriately scoped depends on how large/broad that group is — flagged as context-dependent; worth confirming whether `reporting` is meant to be broadly editable by all of engineering or should be scoped to a smaller team.
>
> **Overall hygiene verdict**
> Needs cleanup — no resource guardrails at all, plus 14 stale Jobs and 2 orphaned ConfigMaps accumulating. RBAC scope should be confirmed with the team but isn't necessarily wrong.

This example is illustrative — a real audit depends entirely on the actual resources found in the target namespace.
