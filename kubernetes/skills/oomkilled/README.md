# OOMKilled Investigation

Diagnoses why a pod was OOMKilled — distinguishing a genuine memory leak from a limit set too low, a runtime ignoring the container's cgroup limit, or node-level memory pressure — and recommends the right fix instead of reflexively raising the limit.

See `SKILL.md` for the full root-cause catalog and workflow.

## How to invoke

- "Why was this pod OOMKilled?"
- "This container keeps hitting exit code 137."
- "Our pod ran out of memory, help me figure out why."

## Example

### Input

```
$ kubectl describe pod payment-worker-6f9d8c-p2x1v
...
Last State:     Terminated
  Reason:       OOMKilled
  Exit Code:    137
Restart Count:  6
```

Container memory limit: `512Mi`. Runtime is a JVM started with `-Xmx768m`. Usage graph (14-day Prometheus history) shows memory climbing to exactly the limit within ~2 minutes of every restart, then getting killed — not a gradual multi-hour climb.

### Output (abbreviated)

> **Symptom summary**
> `payment-worker-6f9d8c-p2x1v` — 6 restarts, all `OOMKilled`, exit code 137, container-level (not node `Evicted`).
>
> **Evidence collected**
> - Memory climbs to the 512Mi limit within ~2 minutes of every start, then gets killed — a fast, consistent pattern, not a slow multi-hour leak.
> - JVM configured with `-Xmx768m` — the heap alone is allowed to grow to 768Mi, well above the container's 512Mi limit.
>
> **Root cause analysis**
> - Real memory leak — **ruled out**: the pattern is fast and consistent on every restart, not a gradual climb across a long uptime — a leak would show increasing time-to-OOM or a slow climb, not the same 2-minute pattern every time.
> - Limit too low for legitimate peak usage — **ruled out**: there's no evidence of a legitimate workload-driven peak; the climb to the limit happens on ordinary startup, not during a known heavy-processing phase.
> - Runtime ignoring the container's cgroup limit — **confirmed**: `-Xmx768m` sets the JVM heap ceiling above the container's 512Mi memory limit. The JVM will happily grow toward 768Mi (plus non-heap overhead on top of that), guaranteeing an OOM kill well before the app is actually out of legitimate work to do.
>
> **Root cause**
> JVM heap flag (`-Xmx768m`) is set higher than the container's memory limit (512Mi), so the runtime itself is configured to exceed the cgroup boundary — this isn't a leak or genuine under-provisioning.
>
> **Recommended fix**
> Lower `-Xmx` to roughly 75-80% of the container limit to leave room for non-heap JVM memory (metaspace, thread stacks, etc.) — e.g., `-Xmx380m` against the current 512Mi limit — rather than raising the container limit, which would just let the same misconfiguration burn more memory before failing.
>
> **How to verify**
> After the fix, the memory usage graph should plateau below 512Mi during normal operation instead of climbing straight to the limit on every start, and restart count should stop increasing for this reason.

This example is illustrative — a real investigation depends entirely on the actual usage data and runtime configuration of the target workload.
