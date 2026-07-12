# CrashLoopBackOff Investigation

Diagnoses why a pod is stuck in `CrashLoopBackOff` by systematically ruling causes in or out with evidence — application crash, misconfigured probes, missing config/dependency, OOMKilled disguised as a crash, permission errors, bad image/entrypoint.

See `SKILL.md` for the full root-cause catalog and workflow.

## How to invoke

- "Why is this pod crashlooping?"
- "CrashLoopBackOff on `worker-abc123`."
- "This pod keeps restarting, help me figure out why."

## Example

### Input

```
$ kubectl describe pod worker-7d9f8c6b6-x2vql
...
Last State:     Terminated
  Reason:       Error
  Exit Code:    1
  Started:      Mon, 12 Jan 2026 09:14:02 +0000
  Finished:     Mon, 12 Jan 2026 09:14:03 +0000
Restart Count:  14

$ kubectl logs worker-7d9f8c6b6-x2vql --previous
Loading config from /etc/worker/config.yaml...
Error: config file not found: /etc/worker/config.yaml
```

Manifest excerpt:
```yaml
volumeMounts:
  - name: config
    mountPath: /etc/worker/
volumes:
  - name: config
    configMap:
      name: worker-config    # actual ConfigMap in the cluster is named "worker-cfg"
```

### Output (abbreviated)

> **Symptom summary**
> `worker-7d9f8c6b6-x2vql` — 14 restarts, exit code 1, crashing ~1 second after start every time.
>
> **Evidence collected**
> - Exit code 1 (not 137 — rules out OOMKilled immediately).
> - `--previous` logs show a clear, deterministic error: config file not found at `/etc/worker/config.yaml`.
> - Manifest mounts a ConfigMap named `worker-config` at that path.
>
> **Root cause analysis**
> - OOMKilled — **ruled out**: exit code is 1, not 137; no OOM reason in describe output.
> - Liveness probe killing a slow-starting app — **ruled out**: the app crashes on its own (exit code 1 with an explicit error message), not killed by a probe (would show `SIGTERM`/143 or reason `Error` from a probe failure event, not this immediate app-level error).
> - Missing/incorrect config — **confirmed**: the log message is explicit and points directly at the mounted config path being empty/missing.
> - Bad image/entrypoint — **ruled out**: the app starts, runs its own config-loading code, and produces a normal application-level error — not an exec-format or shell error.
>
> **Root cause**
> The pod references ConfigMap `worker-config`, but no such ConfigMap exists in the namespace — only `worker-cfg` does. The volume mount resolves to an empty directory, so the app's config file is never actually present.
>
> **Recommended fix**
> Fix the `configMap.name` reference in the Deployment to `worker-cfg` (or rename the ConfigMap to `worker-config`, whichever matches the team's intended naming) and re-apply.
>
> **How to verify**
> After the fix, `kubectl get pod` should show the restart count stop increasing, and `kubectl logs` should show the app successfully loading its config and proceeding past the point where it previously failed.

This example is illustrative — a real investigation depends entirely on the actual evidence gathered from the target pod.
