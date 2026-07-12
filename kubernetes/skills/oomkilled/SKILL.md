---
name: oomkilled
description: Diagnose why a pod was OOMKilled by distinguishing a genuine memory leak from a limit set too low, a runtime/heap misconfiguration ignoring the container's cgroup limit, or node-level memory pressure — and recommend the right fix rather than reflexively raising the limit. Triggers on "why was this pod OOMKilled", "OOMKilled", "container out of memory", "pod exit code 137".
user-invocable: true
---

# OOMKilled Investigation

Diagnose why a container was killed for exceeding its memory limit (exit code 137, reason `OOMKilled`) — distinguishing a real leak from a limit that's simply too low, a runtime ignoring the container's cgroup memory limit, or node-level pressure evicting the pod for a different reason entirely.

## When to use

- A pod shows `OOMKilled` as its last termination reason, or exit code 137.
- The user asks why a container ran out of memory.

**Out of scope**:
- If the recommended fix is a data-backed right-sizing of requests/limits across many workloads, not just this one incident → `resource-optimization`
- If this looks like `CrashLoopBackOff` but the reason turns out to be something other than OOM → `crashloopbackoff`

## Inputs

- `kubectl describe pod <name>` — last state reason, exit code, restart count.
- Memory usage metrics leading up to the kill, if available (Prometheus/metrics-server history).
- Current memory request/limit on the container.
- The application's runtime (JVM, Node.js, Python, Go, etc.) and any runtime-level memory flags (e.g., `-Xmx`, `--max-old-space-size`).
- Whether other pods on the same node were also affected around the same time (distinguishes container-level cgroup OOM from node-level memory pressure eviction).

## Diagnostic workflow

### 1. Gather evidence

Confirm the exact signal: `describe pod` reason `OOMKilled` with exit code 137 is a container-level cgroup OOM (the kernel killed this specific container for exceeding *its* limit). This is different from a pod showing `Evicted` with a message about node memory pressure — that's the kubelet evicting the whole pod because the *node* is under pressure, a different problem with a different fix. Get usage-over-time data if available.

### 2. Work through the root cause catalog

- **Real memory leak** — usage climbs steadily over time (hours/days) until it hits the limit, rather than spiking suddenly. Confirmed by a usage graph showing a steady upward trend across restarts, not a sudden peak.
- **Limit set too low for legitimate peak usage** — usage is stable most of the time but has a legitimate, recurring peak (e.g., batch processing, cache warm-up) that exceeds the limit. Confirmed by usage graphs showing periodic spikes correlated with known workload phases (not a leak — usage resets to baseline after each restart or between spikes).
- **Runtime/heap settings ignoring the container's cgroup limit** — common in JVMs on older versions, or any runtime with a manually set heap flag higher than the container's memory limit. Confirmed by checking the runtime's configured heap/max-memory flag against the container's `resources.limits.memory` — if the flag is equal to or higher than the container limit (or the runtime doesn't respect cgroups at all), the runtime will use memory the container isn't allowed to have.
- **Node-level memory pressure, not a container-level OOM at all** — pod shows `Evicted` (not `OOMKilled`) and the node had a `MemoryPressure` condition around the same time; other pods on the same node were also affected. This is a different problem — node-level capacity/bin-packing, not this workload's config. Redirect toward `resource-optimization` (node-level view) or `architecture-review` if it's systemic.
- **Sidecar/init container consuming shared memory budget** — if the pod has multiple containers, check whether a sidecar (e.g., a log shipper, mesh proxy) is the one actually hitting its own limit, not the main application container — `describe pod` shows which specific container was OOMKilled.
- **No limit set, node-level kernel OOM killer picked this container anyway** — if no `resources.limits.memory` was set at all, the container is subject to the node's overall memory pressure and the kernel's OOM-killer heuristics can pick it during a node-wide shortage, even though it never had its "own" limit. Confirmed by an absent memory limit combined with node memory pressure evidence.

### 3. Identify the root cause

State which cause is confirmed, and importantly, whether the right fix is "raise the limit" (only correct for the "limit too low for legitimate peak" case) versus something else — reflexively raising the limit on a real leak or a runtime misconfiguration just delays the same failure at a higher memory cost.

### 4. Recommend the fix

- Real leak → this needs an application-level fix (the skill can flag it clearly but the actual leak fix is outside Kubernetes config).
- Limit too low for real peak usage → recommend a specific new limit backed by the observed peak (cite the actual peak value; for a data-driven pass across many workloads, point to `resource-optimization`).
- Runtime ignoring cgroup limit → recommend aligning the runtime's memory flag to a value safely under the container limit (e.g., JVM `-Xmx` set to ~75-80% of the container memory limit to leave room for non-heap memory).
- Node-level pressure → recommend investigating node-level capacity, not this workload's limit.

### 5. Verify

State what to check after the fix (memory usage graph should plateau under the new limit/flag rather than climbing to it repeatedly; restart count should stop increasing for this reason).

## Report format

1. **Symptom summary** — pod name, restart count, confirmed `OOMKilled` (container-level) vs. `Evicted` (node-level).
2. **Evidence collected** — usage-over-time pattern, runtime memory flags, current limit, node pressure state if relevant.
3. **Root cause analysis** — which pattern (leak / limit-too-low / runtime-misconfig / node-pressure) the evidence matches, with the others ruled out.
4. **Root cause**.
5. **Recommended fix** — specific, and correctly matched to the actual cause (not a reflexive limit bump).
6. **How to verify**.

## Notes

- The most common mistake here is treating every OOMKilled as "just raise the limit" — that's only correct for one of the four causes above. Misdiagnosing a leak or runtime misconfiguration as "limit too low" just moves the failure to a higher, more expensive threshold.
- Always distinguish `OOMKilled` (container-level, this workload's own limit) from `Evicted` (node-level pressure, a capacity problem) — they look similar to a quick glance at pod status but have completely different fixes.
- If no usage history is available, say so explicitly and scope the diagnosis to what's confirmable from static config (e.g., a runtime heap flag that's obviously misconfigured relative to the limit) rather than guessing at the usage pattern.
