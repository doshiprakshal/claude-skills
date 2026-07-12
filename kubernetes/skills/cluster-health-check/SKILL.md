---
name: cluster-health-check
description: Fast, live triage of overall cluster health — node readiness, core add-on status (CoreDNS, CNI, kube-proxy, metrics-server, autoscaler), resource pressure signals, and warning-event spikes — routing anything abnormal to the right specialist investigation. Not a deep audit. Triggers on "is the cluster healthy", "quick cluster health check", "cluster status check", "is anything broken right now".
user-invocable: true
---

# Cluster Health Check

A fast, live health sweep across the whole cluster — the kind of check an SRE runs at the start of an on-call shift or the first minute of an incident. This is explicitly a triage/routing skill, not a deep audit — anything abnormal gets pointed at the right specialist skill rather than diagnosed in depth here.

## When to use

- Start of an on-call shift, or the first step when responding to a vague "something's wrong" report.
- The user wants a quick "is anything broken" signal before deciding where to dig deeper.

**Out of scope** — this skill routes, it doesn't deep-dive:
- Root-causing a specific NotReady node → `node-not-ready`
- Root-causing Pending pods → `pending-pods`/`failedscheduling`
- Deep security/architecture/cost analysis → their respective skills

## Inputs

- Live cluster access (`kubectl`).
- Node list and conditions.
- `kube-system` pod statuses.
- Recent Warning-type events, cluster-wide.
- Control plane component status, if accessible (self-managed clusters).

## Workflow

### 1. Gather

Node conditions (`kubectl get nodes`, `kubectl describe node` for any not `Ready`), `kube-system` pod phase/readiness (CoreDNS, CNI daemonset, kube-proxy, metrics-server, cluster autoscaler), and a count of Warning events in the last 15-30 minutes cluster-wide.

### 2. Assess each category

- **Control plane** — responsive, no elevated error rate (if accessible to check).
- **Nodes** — every node `Ready`; note any `NotReady` or under resource-pressure conditions.
- **Core add-ons** — CoreDNS, CNI, kube-proxy, metrics-server, autoscaler all `Running`/`Ready`.
- **Workload health signal** — a rough scan for a high concentration of non-`Running` pods in any namespace, or an unusual spike in Warning events (distinguishing real signal from known-noisy, non-critical sources).

### 3. Route anything abnormal

For each abnormality found, name the specific skill that should investigate it further rather than diagnosing it here — e.g., a `NotReady` node → `node-not-ready`; a namespace full of `Pending` pods → `pending-pods`; a spike in `FailedScheduling` events → `failedscheduling`.

### 4. Report

A traffic-light summary per category (Healthy / Degraded / Critical), the specific abnormalities found, and which skill to run next for each.

## Report format

1. **Category summary** — Control Plane, Nodes, Core Add-ons, Workload Health — each Healthy/Degraded/Critical.
2. **Abnormalities found** — specific evidence for each (which node, which pod, which event).
3. **Next steps** — the specific skill to invoke for each abnormality that needs deeper investigation.

## Notes

- This is a one-minute triage, not an audit — resist the urge to root-cause everything here; name the abnormality and point to the right deeper skill instead.
- Distinguish a genuine anomaly from expected noise (e.g., a known flaky non-critical CronJob generating routine Warning events) — don't flag every Warning event as a crisis.
- If everything checks out, say so plainly and briefly — a clean bill of health doesn't need padding.
