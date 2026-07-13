# Helm Upgrade Risk Analysis

Assesses the risk of a planned `helm upgrade` before running it — diffing rendered manifests, detecting StatefulSet-breaking changes, unmanaged CRD changes, breaking values schema changes, and hook behavior changes.

See `SKILL.md` for the full workflow.

## How to invoke

- "Is it safe to upgrade this Helm release from 4.2.0 to 5.0.0?"
- "What breaks if we bump this chart version?"
- "Assess this Helm upgrade before we run it."

## Example

### Input

Upgrading `postgres-ha` chart from `8.1.0` to `9.0.0`. Diff shows: `volumeClaimTemplates.spec.resources.requests.storage` changed in the StatefulSet template between versions; the new chart bundles an updated CRD for a backup operator; `values.yaml` schema in the new version renames `persistence.size` to `primary.persistence.size`, and the current release's values still use the old key.

### Output (abbreviated)

> **Change summary**
> - Resource shape: `StatefulSet.volumeClaimTemplates` storage size field changed.
> - CRDs: new chart bundles an updated backup-operator CRD.
> - Values schema: `persistence.size` renamed to `primary.persistence.size`.
>
> **Risk findings**
> - **StatefulSet `volumeClaimTemplates` change** — `[Blocker]` — this field is immutable after creation; Kubernetes will reject the in-place update, and Helm will report a failed upgrade (or, depending on tooling, prompt for a destructive replace). Do not proceed without a plan for either a manual PVC migration or accepting a delete+recreate with a backup/restore step.
> - **CRD update not applied automatically** — `[High]` — Helm's `crds/` directory is install-only. The new backup-operator CRD version will **not** be applied by `helm upgrade`. If the new chart version's templates assume the updated CRD schema, resources may fail to reconcile until the CRD is manually applied first (`kubectl apply -f <chart>/crds/`).
> - **Values key renamed, current values not migrated** — `[Blocker]` — the current release still sets `persistence.size`, which the new chart no longer reads (it now reads `primary.persistence.size`). Without updating the values, the new chart would silently fall back to its own default persistence size, likely far smaller than intended. Run `values-migration` before proceeding.
>
> **Recommended approach**
> Hold this upgrade. Three blocking issues need resolution first: (1) plan the StatefulSet volume migration, (2) manually apply the updated CRD before or during the upgrade window, (3) migrate values to the new schema. Do not run `helm upgrade` as-is.

This example is illustrative — a real analysis depends entirely on the actual chart diff for the target upgrade.
