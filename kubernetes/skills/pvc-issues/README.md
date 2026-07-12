# PVC Issues Investigation

Diagnoses a live, specific PVC/volume problem — stuck binding, mount failure, or a full volume — using PVC/PV status, StorageClass config, and CSI driver evidence.

See `SKILL.md` for the full root-cause catalog and workflow.

## How to invoke

- "This PVC is stuck Pending."
- "Volume won't mount — multi-attach error."
- "Why is this PVC not binding?"

## Example

### Input

```
$ kubectl describe pvc data-postgres-0
...
Status: Pending
Events:
  Type     Reason              Message
  ----     ------              -------
  Warning  ProvisioningFailed  storageclass.storage.k8s.io "fast-sdd" not found
```

The StatefulSet's `volumeClaimTemplates` references `storageClassName: fast-sdd`. Listing actual StorageClasses shows `fast-ssd` (correct spelling) exists, but `fast-sdd` does not.

### Output (abbreviated)

> **Symptom summary**
> `data-postgres-0` — stuck `Pending`, event: "storageclass.storage.k8s.io \"fast-sdd\" not found."
>
> **Evidence collected**
> - PVC references `storageClassName: fast-sdd`.
> - Cluster has a StorageClass named `fast-ssd`, not `fast-sdd` — a transposition typo.
>
> **Root cause**
> The StatefulSet's `volumeClaimTemplates` has a typo in `storageClassName` (`fast-sdd` instead of `fast-ssd`), so no matching StorageClass exists and dynamic provisioning can never start.
>
> **Recommended fix**
> Correct the `storageClassName` to `fast-ssd` in the StatefulSet manifest. Note: since `volumeClaimTemplates` are immutable after creation, this requires deleting the incorrectly-created PVC (`data-postgres-0`) after fixing the manifest, so it can be recreated with the correct StorageClass reference — the StatefulSet controller will regenerate it.
>
> **How to verify**
> After the fix and PVC recreation, `kubectl get pvc` should show `Bound` within a few seconds (assuming the `fast-ssd` provisioner is healthy), and the StatefulSet pod should proceed past `Pending`.

This example is illustrative — a real investigation depends entirely on the actual PVC/PV status and evidence for the target volume.
