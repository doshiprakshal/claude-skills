# Helm Rollback Planner

Plans a safe `helm rollback` to a previous release revision — release history inspection, CRD rollback limitations, hook behavior, and stateful data-migration risk.

See `SKILL.md` for the full workflow.

## How to invoke

- "Plan a Helm rollback for `orders-service`."
- "Is it safe to roll back this release?"
- "Will rolling back this release be safe given what's changed?"

## Example

### Input

```
$ helm history orders-service
REVISION  STATUS      CHART               DESCRIPTION
3         deployed    orders-service-4.0  Upgrade complete
2         superseded  orders-service-3.2  Upgrade complete
1         superseded  orders-service-3.0  Install complete
```

Revision 3 (current) bumped a CRD used for order-event schemas and ran a forward data migration adding a new required column. The team wants to roll back to revision 2 after finding a bug in the new version.

### Output (abbreviated)

> **Rollback target**
> Revision 2 (`orders-service-3.2`). Since then: a CRD schema bump (order-event CRD) and a forward database migration adding a required column.
>
> **Risks**
> - **CRD will not revert** — `[Blocker]` — Helm never downgrades CRDs on rollback. The order-event CRD will remain at the schema introduced in revision 3, even though the application code is rolling back to revision 2. If revision 2's code doesn't expect the newer CRD schema, this can cause the app to fail against a CRD it wasn't built for.
> - **Forward data migration not reversible by rollback** — `[Blocker]` — the new required column added in revision 3 stays in the database; rolling back the app to revision 2's code (which doesn't know about that column) can cause write failures or the app treating rows inconsistently depending on how it handles unexpected columns.
> - **Hooks** — no `pre-rollback`/`post-rollback` hooks defined; no additional risk from this angle.
>
> **Recommended approach**
> Do not roll back the Helm release alone — it will not undo the CRD or database changes. Either: (1) fix the bug forward on revision 3's codebase instead of rolling back, or (2) if rollback is truly necessary, coordinate a manual CRD revert and a database migration rollback with whoever owns the schema, before or alongside the Helm rollback — not as an afterthought.

This example is illustrative — a real plan depends entirely on the actual release history and changes for the target release.
