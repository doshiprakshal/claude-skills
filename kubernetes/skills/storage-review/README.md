# Storage Review

Reviews Kubernetes persistent storage configuration — PVC/PV binding, StorageClass fit, access modes, reclaim policy, backup/snapshot strategy, and StatefulSet volume safety — to catch misconfigurations that risk data loss, performance mismatch, or scheduling failures from storage topology constraints.

See `SKILL.md` for the full workflow this skill follows.

## How to invoke

- "Review our persistent storage."
- "Will we lose data if this PVC is deleted?"
- "Is our storage class correct?"
- "Check our backup strategy for k8s."

## Example

### Input

```yaml
# statefulset.yaml (relevant excerpt)
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
spec:
  replicas: 1
  volumeClaimTemplates:
    - metadata:
        name: data
      spec:
        accessModes: [ReadWriteOnce]
        storageClassName: fast-ssd
        resources:
          requests: { storage: 100Gi }
---
# storageclass.yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: fast-ssd
provisioner: ebs.csi.aws.com
reclaimPolicy: Delete          # default reclaim policy is Delete
volumeBindingMode: Immediate
allowVolumeExpansion: false
```

No VolumeSnapshot or backup tooling found anywhere in the cluster. Live cluster access available: the resulting PVC (`data-postgres-0`) shows `Bound`, 38Gi actually used of 100Gi requested.

### Output (abbreviated)

> **Storage inventory**
>
> | PVC | StorageClass | Access Mode | Reclaim Policy | Size (used/requested) |
> |---|---|---|---|---|
> | `data-postgres-0` | `fast-ssd` | ReadWriteOnce | Delete | 38Gi / 100Gi |
>
> **Findings**
>
> - **`reclaimPolicy: Delete` on the only copy of production Postgres data** &nbsp;`[Blocker]` &nbsp;*(Confirmed)* — the StorageClass is set to `Delete`, meaning deleting the PVC (or the StatefulSet with default cascade behavior in some workflows) permanently deletes the underlying volume. No VolumeSnapshot or external backup tooling was found anywhere in the cluster. Fix: change `reclaimPolicy` to `Retain` at minimum, and add a real backup strategy (e.g., a scheduled `VolumeSnapshot` or a Postgres-native backup tool like `pgBackRest`) — right now, a single accidental `kubectl delete pvc` is unrecoverable.
> - **No volume expansion support** &nbsp;`[Medium]` &nbsp;*(Context-dependent)* — `allowVolumeExpansion: false`, and current usage (38Gi/100Gi) has headroom today, but growth beyond 100Gi would require a manual volume migration rather than a simple resize. Whether this matters depends on the database's expected growth rate, which wasn't provided.
> - **`volumeBindingMode: Immediate` in a single-AZ context** &nbsp;*(Passed — not a finding)* — this cluster appears to be single-zone based on the node inventory, so `Immediate` binding mode doesn't carry the cross-zone scheduling risk it would in a multi-zone cluster. No action needed here.
>
> **Cannot verify**
> - The database's expected data growth rate — affects how urgent the volume-expansion gap actually is.
>
> **Overall verdict**
>
> ❌ Not safe as configured — the only copy of this StatefulSet's data has no backup and is set to be deleted along with the PVC. This is the highest-priority fix of the three findings; the reclaim policy and expansion settings are secondary once real backups exist.

This example is illustrative — a real review depends entirely on the manifests and live cluster state actually available for the target workload.
