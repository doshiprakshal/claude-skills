# RBAC Audit

A cluster-wide audit of every Role/ClusterRole/RoleBinding/ClusterRoleBinding, building an effective-permissions view per subject and finding overly broad grants and unused bindings.

See `SKILL.md` for the full workflow.

## How to invoke

- "Audit our RBAC."
- "Who has cluster-admin in this cluster?"
- "Review all our roles and bindings."

## Example

### Input

Cluster-wide RBAC enumeration finds: `ClusterRoleBinding` granting `cluster-admin` to ServiceAccount `ci-deployer` in namespace `ci`; a `RoleBinding` granting `edit` to ServiceAccount `log-shipper-sa` in `monitoring` (no pods reference `log-shipper-sa` anymore); no audit logs available.

### Output (abbreviated)

> **Permissions inventory** *(excerpt)*
>
> | Subject | Binding | Effective grant |
> |---|---|---|
> | SA `ci-deployer` (ns `ci`) | ClusterRoleBinding → `cluster-admin` | Full cluster control |
> | SA `log-shipper-sa` (ns `monitoring`) | RoleBinding → `edit` (ns `monitoring`) | Create/update/delete most resources in `monitoring` |
>
> **High-privilege/wildcard grants**
> - `ci-deployer` → `cluster-admin`, cluster-wide. **High** — a CI deploy pipeline typically needs to create/update workloads in specific namespaces, not full cluster control (including RBAC itself, secrets cluster-wide, etc.). Recommend scoping to a custom Role covering only the resource types and namespaces the pipeline actually deploys to.
>
> **Unused-binding candidates**
> - `log-shipper-sa` — no pod in the cluster currently references this ServiceAccount. **Likely** unused, not Confirmed (no audit logs available to verify zero recent API activity). Recommend confirming with the monitoring team before removal — could be a leftover from a decommissioned log shipper, or intentionally kept for a manual/emergency use.
>
> **Overall RBAC verdict**
> One clearly over-broad grant (`ci-deployer` → `cluster-admin`) is the highest-priority fix. One likely-unused binding should be confirmed with its owning team before removal. No audit logs were available, so usage-based findings are Likely rather than Confirmed — adding audit logging would sharpen future reviews.

This example is illustrative — a real audit depends entirely on the actual RBAC objects discovered in the target cluster.
