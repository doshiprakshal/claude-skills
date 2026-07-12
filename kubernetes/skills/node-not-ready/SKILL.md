---
name: node-not-ready
description: Diagnose why a Kubernetes node shows NotReady — kubelet down, network partition to the control plane, resource pressure conditions, container runtime failure, CNI failure, or an underlying cloud instance problem — using node conditions and events as evidence. Triggers on "node is NotReady", "why is this node not ready", "node down", "kubelet not responding".
user-invocable: true
---

# Node Not Ready Investigation

Diagnose why a node shows `NotReady`, using the node's own reported Conditions as the primary evidence — Kubernetes nodes self-report fairly specific reasons, so this is mostly about reading them correctly and checking the layer they point to.

## When to use

- A node shows `NotReady` in `kubectl get nodes`.
- The user asks why a node went down or stopped responding.

**Out of scope**:
- Pods stuck Pending as a downstream effect of a NotReady node (fewer nodes = less capacity) → `pending-pods`/`failedscheduling` for the pod-level symptom; this skill addresses the node itself.

## Inputs

- `kubectl describe node <name>` — Conditions section (Ready, MemoryPressure, DiskPressure, PIDPressure, NetworkUnavailable) with reasons/messages/timestamps.
- Node events.
- kubelet logs, if accessible (`journalctl -u kubelet` via node access, or a log aggregator).
- Cloud provider console/API status for the underlying instance, if accessible.
- Whether other nodes are also affected (isolated single-node issue vs. cluster-wide problem).

## Diagnostic workflow

### 1. Gather evidence

Get the full Conditions section — the `Ready` condition's `reason` and `message` fields usually name the proximate cause directly (e.g., "kubelet stopped posting node status", "container runtime is down", "CNI plugin not initialized"). Check whether other nodes are affected too.

### 2. Work through the root cause catalog

- **kubelet not running or crashed** — `Ready` condition reason mentions kubelet not posting status; if node access/logs are available, check for a crashed/stopped kubelet process.
- **Network partition between node and control plane** — node was previously healthy, condition transitioned to Unknown/NotReady without other explanation, and the node is otherwise reachable via other means (SSH/cloud console) — suggests the node can't reach the API server specifically, not that the node itself is down.
- **Node resource exhaustion** — `MemoryPressure`, `DiskPressure`, or `PIDPressure` condition is `True`. This is a distinct, well-labeled signal — confirm directly from the condition rather than inferring it.
- **Container runtime failure** (containerd/CRI-O crashed or hung) — condition/message references the runtime specifically (e.g., "container runtime is down"); pods on the node would also be failing to create/start.
- **CNI plugin failure** — `NetworkUnavailable` condition is `True`, or kubelet logs reference CNI init failures; node may otherwise look healthy but can't network pods correctly.
- **Node clock skew** — less common but real; causes certificate/auth failures between kubelet and API server. Check node time against control plane if suspected (symptoms often include odd certificate-validity errors in kubelet logs).
- **Underlying cloud instance problem** (host hardware failure, spot instance reclaimed/interrupted) — check the cloud provider's console/API for instance status/health events; a spot interruption notice is a distinct, confirmable signal.
- **kubelet certificate expired** — kubelet logs show certificate validation failures specifically; distinguishable from a generic network partition by the specific TLS/cert error text.

### 3. Identify the root cause

State which layer is actually failing (kubelet process, network path to control plane, resource exhaustion, runtime, CNI, underlying infrastructure) based on the specific condition/message/log evidence — not just "the node is down."

### 4. Recommend the fix

Specific to the layer: restart kubelet/runtime, address resource pressure (evict/scale), replace the underlying instance if it's a hardware/cloud-level failure, renew a certificate, or investigate the network path if it's a control-plane connectivity issue.

### 5. Verify

State what to check after the fix (node's `Ready` condition returns to `True`, condition message clears, pods can schedule onto it again).

## Report format

1. **Symptom summary** — node name, current conditions and their reasons/messages, whether other nodes are affected.
2. **Evidence collected** — condition details, relevant logs, cloud instance status if checked.
3. **Root cause** — the specific layer and cause confirmed.
4. **Recommended fix**.
5. **How to verify**.

## Notes

- The node's own Conditions are almost always the fastest and most specific signal — read the `reason`/`message` fields verbatim before escalating to log-diving.
- Distinguish "this node has a problem" from "this node can't be reached from here" — a network partition can make a perfectly healthy node look NotReady from the control plane's perspective, while the node itself (and its running pods) may be fine.
- If multiple nodes are NotReady simultaneously, treat that as a strong signal toward a shared-cause explanation (control plane issue, network partition affecting a zone, a botched fleet-wide config change) rather than diagnosing each node independently.
