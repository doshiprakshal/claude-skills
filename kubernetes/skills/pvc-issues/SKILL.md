---
name: pvc-issues
description: Diagnose live PVC problems — stuck Pending binding, multi-attach errors preventing mount, volume full at the application level, or access-mode/zone mismatches — using PVC/PV status and CSI driver evidence. Triggers on "PVC is stuck pending", "volume won't mount", "multi-attach error", "why is this pvc not binding", "pvc issues".
user-invocable: true
---

# PVC Issues Investigation

Diagnose a live, specific PVC/volume problem — stuck binding, mount failure, or a full volume — using PVC/PV status, StorageClass config, and CSI driver evidence. Distinct from `storage-review`'s proactive audit of storage configuration in general; this is live incident diagnosis for one specific PVC right now.

## When to use

- A PVC is stuck `Pending` and not binding.
- A pod can't mount its volume (stuck in `ContainerCreating` with a volume-related event).
- The user reports a volume is full or a multi-attach error.

**Out of scope**:
- Proactive review of reclaim policy, access mode fit, and backup strategy in general (not a live incident) → `storage-review`
- The pod itself being Pending for reasons unrelated to storage → `pending-pods`

## Inputs

- `kubectl describe pvc <name>` — status, events.
- `kubectl describe pv <name>` (if bound) — capacity, node affinity/zone, reclaim policy.
- The referencing pod's events (mount-specific failures show here, not always on the PVC itself).
- StorageClass definition (provisioner, parameters).
- CSI driver pod status (`kubectl get pods -n <csi-namespace>`), if accessible.
- Actual disk usage inside the pod (`df -h` via exec), if a "volume full" symptom is reported.

## Diagnostic workflow

### 1. Gather evidence

Get PVC and (if it exists) PV status and events first — most binding/provisioning failures report a specific reason there. If the PVC is Bound but the pod still won't start, check the pod's own events for mount-specific errors instead.

### 2. Work through the root cause catalog

- **PVC stuck Pending — no StorageClass matches** — `storageClassName` on the PVC doesn't correspond to any StorageClass in the cluster (typo, or it was never created). Confirm by listing StorageClasses and comparing names exactly.
- **PVC stuck Pending — provisioner not responding** — StorageClass exists and is correctly named, but the CSI provisioner pod is down/crashing. Confirm by checking CSI driver pod status.
- **PVC stuck Pending — no available PV (static provisioning)** — cluster uses static (pre-created) PVs rather than dynamic provisioning, and no PV matches this PVC's request (size, access mode, storage class, or label selector). Confirm by listing available (unbound) PVs and comparing against the PVC's requirements.
- **PVC stuck Pending — zone mismatch** — the pod's scheduling constraints put it in a zone where the provisioner can't create a volume matching an already-bound-elsewhere PV's zone affinity, or (with `WaitForFirstConsumer`) the pod itself hasn't been scheduled yet, which is actually expected behavior, not a failure — confirm the binding mode before treating this as a bug.
- **PVC bound but pod can't mount — multi-attach error** — the PVC's access mode is `ReadWriteOnce` and it's already attached to a different node than the one this pod was scheduled to (common during a rescheduled pod when the old pod's node hasn't released the volume yet). Confirm via the pod's events showing a multi-attach error explicitly.
- **PVC bound but pod can't mount — CSI driver/node plugin issue** — the CSI node plugin (the per-node DaemonSet component) isn't running or is failing on the specific node the pod landed on. Confirm by checking CSI node-plugin pod status on that specific node.
- **Volume full at the application level** — the PVC/PV is `Bound` and mounted fine, but the application reports disk-full errors. Confirm via `df -h` inside the pod showing actual usage near 100% of the PVC's requested size — this is an application/capacity issue, not a Kubernetes binding issue; the fix is either cleanup or a resize (if `allowVolumeExpansion` is supported).
- **Access mode mismatch** — the PVC requests an access mode (e.g., RWX) the provisioner doesn't actually support, and either fails to provision or silently behaves unexpectedly. Confirm against the provisioner's documented access-mode support.

### 3. Identify the root cause

State the specific stage (binding vs. mounting vs. application-level full) and the specific cause confirmed by the evidence.

### 4. Recommend the fix

Specific to the cause — fix the StorageClass reference, wait out `WaitForFirstConsumer` correctly rather than "fixing" a non-issue, resolve the multi-attach by ensuring the old pod fully terminated, restart/fix the CSI driver, or resize/clean up the volume.

### 5. Verify

State what to check after the fix (PVC transitions to `Bound`, pod transitions to `Running`, `df -h` shows expected free space).

## Report format

1. **Symptom summary** — PVC name, status, pod's mount-related events if relevant.
2. **Evidence collected** — PVC/PV status, StorageClass, CSI driver state, disk usage if applicable.
3. **Root cause**.
4. **Recommended fix**.
5. **How to verify**.

## Notes

- `WaitForFirstConsumer` binding mode means a PVC staying `Pending` until its pod is scheduled is expected, correct behavior — don't misdiagnose this as a failure.
- A multi-attach error during a normal pod reschedule (old pod terminating, new pod starting) is often transient and self-resolves within a short window — check whether the old pod has actually finished terminating before treating this as a persistent problem.
- If the symptom is "volume full," check whether `allowVolumeExpansion` is even supported before recommending a resize as the fix.
