---
name: storage-review
description: Review Kubernetes persistent storage configuration — PVC/PV binding, StorageClass fit, access modes, reclaim policy, backup/snapshot strategy, and StatefulSet volume safety — to catch misconfigurations that risk data loss, performance mismatch, or scheduling failures from storage topology constraints. Triggers on "review our persistent storage", "will we lose data if this pvc is deleted", "is our storage class correct", "review statefulset volumes", "check our backup strategy for k8s", "storage review".
user-invocable: true
---

# Kubernetes Storage Review

Review how persistent storage is configured for Kubernetes workloads — PVC/PV binding, StorageClass fit, access modes, reclaim policy, backup/snapshot strategy, and StatefulSet volume safety. Deeper than the brief storage mention in `production-readiness-review`'s Phase 5 — this is the dedicated deep-dive, catching configurations that look fine until a specific failure mode (node loss, scale-down, accidental delete) exposes the gap.

## When to use

- Reviewing a stateful workload before launch.
- Investigating a storage incident (PVC stuck Pending, volume attach/detach hang, unexpected data loss on delete).
- A periodic storage hygiene pass.

**Out of scope** — defer instead:
- Basic PVC/StorageClass existence checks at the app level → `production-readiness-review` (this skill supersedes that check with depth)
- Cluster-wide CSI driver/provisioner standardization decisions → `architecture-review`
- Cost of storage tier choices → `cost-optimization` (this skill can flag a mismatched tier for that skill to act on)

## Inputs

- PVC/PV manifests.
- StorageClass definitions: provisioner, parameters, `reclaimPolicy`, `volumeBindingMode`, `allowVolumeExpansion`.
- StatefulSet `volumeClaimTemplates`.
- VolumeSnapshot/VolumeSnapshotClass config, if a backup/snapshot strategy is in use.
- Live cluster storage state if available: PVC binding status, PV zone, actual usage vs. capacity.
- Any stated durability/performance requirements (RPO, IOPS/throughput).

## Workflow

### 1. Discover

Gather PVC/PV/StorageClass/VolumeSnapshot manifests and StatefulSet `volumeClaimTemplates`. Note any stated durability/performance requirements. If live cluster access is available, pull PVC binding status and usage-vs-capacity data — some findings here are only trustworthy with live verification.

### 2. Build the storage inventory

PVCs with their StorageClass, access mode, reclaim policy, and size; StatefulSets with their `volumeClaimTemplates`; snapshot/backup configuration if any.

### 3. Deterministic checks

Tagged **Passed** / **Failed** / **Cannot verify**:
- Referenced StorageClass actually exists.
- Requested `accessModes` are supported by the StorageClass's provisioner (e.g., RWX requested against a provisioner that only supports RWO).
- `allowVolumeExpansion` is set if future growth is expected — flag its absence rather than requiring it universally.
- `reclaimPolicy` is explicitly set rather than relying on an unexamined StorageClass default.
- PVC is actually `Bound`, not stuck `Pending`, if live cluster access is available.
- StatefulSet `volumeClaimTemplates` are present and produce one PVC per expected replica.

### 4. Reasoning checks

- Is `reclaimPolicy: Delete` actually acceptable given this data's stated or apparent criticality, or should it be `Retain`?
- Does the access mode choice create a real constraint — an unnecessary RWX requirement limiting provisioner choice, or RWO used where multiple pods genuinely need concurrent write access?
- Will `volumeBindingMode: Immediate` cause scheduling conflicts given the cluster's zone topology and the workload's scheduling constraints (cross-reference `scheduling-review` findings where relevant), or would `WaitForFirstConsumer` avoid the risk?
- Is the backup/snapshot strategy (if any) actually adequate for the stated RPO, and is there evidence a restore has ever been tested — an untested snapshot is unverified insurance, not a guarantee.
- Does the storage performance tier match the workload's real I/O profile, or is it a default that risks becoming a bottleneck under load?

Classify confidence:
- **Confirmed** — directly observed misconfiguration (PVC stuck Pending, `reclaimPolicy: Delete` explicit on critical-looking data).
- **Likely** — a backup mechanism exists but no evidence of a tested restore — "likely unverified," not "confirmed broken."
- **Context-dependent** — whether the access mode/performance tier is right depends on actual I/O characteristics or data criticality not fully known. State the assumption; ask only if it changes the verdict.

### 5. Severity assignment

- **Blocker** — reclaim policy risks real data loss on a routine operation (e.g., `Delete` on critical data with no tested backup), or a PVC is stuck Pending blocking the workload entirely.
- **High** — real risk under a plausible scenario (untested backup/restore, a binding mode likely to cause future scheduling conflicts).
- **Medium** — real inefficiency (performance tier mismatch) without an active incident.
- **Advisory** — a valid stronger alternative exists; no urgency.

### 6. Report

1. **Storage inventory** — PVCs with StorageClass/accessMode/reclaimPolicy/size; StatefulSets with their volume templates; snapshot/backup config if any.
2. **Findings** — grouped by Reclaim Policy & Data Safety, Access Mode & Provisioner Fit, Binding & Topology, Backup & Recovery, Performance Tier Fit. Each finding: title, severity, confidence, evidence (config field, cross-referenced with live binding/usage data where available), why it matters, recommended fix.
3. **Cannot verify** — anything needing live cluster access not available.
4. **Overall verdict** — one summary, e.g., "`postgres-data` PVC has `reclaimPolicy: Delete` with no evidence of a tested backup restore — accidental StatefulSet deletion would be unrecoverable. `logs` PVC is over-provisioned at 500Gi against ~40Gi actual usage."

## Notes

- The most valuable findings here name a specific failure mode, not a generic best practice — "this PVC would be unrecoverable if X happens" beats "add a backup."
- A snapshot/backup mechanism existing is not the same as data being recoverable — always distinguish "backup configured" from "restore verified."
- Don't flag `Immediate` binding mode as wrong in a single-zone cluster — the risk it creates is specific to multi-zone topologies; judge against the actual cluster layout.
