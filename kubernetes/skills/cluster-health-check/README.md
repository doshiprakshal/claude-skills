# Cluster Health Check

A fast, live triage of overall cluster health — node readiness, core add-on status, resource pressure, and warning-event spikes — routing anything abnormal to the right specialist investigation. Not a deep audit.

See `SKILL.md` for the full workflow.

## How to invoke

- "Is the cluster healthy?"
- "Quick cluster health check."
- "Is anything broken right now?"

## Example

### Input

Live cluster access. 10 nodes, all `Ready`. `kube-system` shows CoreDNS (2/2 ready), CNI daemonset (10/10 ready), kube-proxy (10/10 ready), metrics-server (1/1 ready), Cluster Autoscaler (1/1 ready). Warning events in the last 20 minutes: 34 events, mostly `FailedScheduling` concentrated in the `batch` namespace.

### Output (abbreviated)

> **Category summary**
>
> | Category | Status |
> |---|---|
> | Control Plane | Healthy |
> | Nodes | Healthy — 10/10 Ready |
> | Core Add-ons | Healthy — CoreDNS, CNI, kube-proxy, metrics-server, autoscaler all Ready |
> | Workload Health | **Degraded** — 34 Warning events in 20 minutes, concentrated in `batch` |
>
> **Abnormalities found**
> - `batch` namespace accounts for the large majority of Warning events, almost all `FailedScheduling` — this looks like a real, concentrated scheduling problem rather than routine noise (routine noise is usually spread thin across namespaces, not concentrated like this).
>
> **Next steps**
> Run `pending-pods` (or `failedscheduling` directly, if the exact event message is already in hand) scoped to the `batch` namespace to identify the specific scheduling constraint causing the pileup — likely a resource-fit or quota issue given the concentration in one namespace.

This example is illustrative — a real check depends entirely on the actual live cluster state at the time it's run.
