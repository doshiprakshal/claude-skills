---
name: crashloopbackoff
description: Diagnose why a pod is in CrashLoopBackOff by systematically working through the known root causes — application crash, misconfigured probes, missing config/dependency, OOMKilled disguised as a crash, permission errors, bad image/entrypoint — and identify the confirmed cause with evidence. Triggers on "why is this pod crashlooping", "CrashLoopBackOff", "pod keeps restarting", "container keeps crashing".
user-invocable: true
---

# CrashLoopBackOff Investigation

Diagnose a pod stuck in `CrashLoopBackOff` by systematically ruling causes in or out using evidence, not guessing at the first plausible explanation.

## When to use

- A pod is showing `CrashLoopBackOff` in `kubectl get pods`.
- The user asks why a container keeps restarting.

**Out of scope** — if evidence points elsewhere, hand off:
- Exit code 137 with memory pressure evidence → `oomkilled` (this skill still checks for it first, since it's a common CrashLoopBackOff disguise)
- Image can't be pulled at all (not "crashing," never starts) → `imagepullbackoff`
- Fixing the underlying resource/probe config once diagnosed as a systemic gap, not just this incident → `production-readiness-review`

## Inputs

- `kubectl describe pod <name>` — last state, exit code, restart count, events.
- `kubectl logs <name> --previous` — logs from the crashed container.
- `kubectl logs <name>` — current attempt's logs, if any.
- The pod's manifest: probes, resources, command/args, securityContext, env, volumes.

## Diagnostic workflow

### 1. Gather evidence

Pull describe output (exit code, reason, restart count), previous logs, current logs, and the relevant manifest fields (probes, resources, command, securityContext). Exit code is the single most useful signal — get it before theorizing.

### 2. Work through the root cause catalog, ranked by how the evidence discriminates between them

- **Exit code 137, reason `OOMKilled`** — this is memory exhaustion disguised as a crash loop, not an application bug. Hand off to `oomkilled` rather than continuing here.
- **Application crashes on startup** (non-zero exit, e.g., 1) — check `--previous` logs for a stack trace/unhandled exception immediately before exit. Confirmed if logs show a clear crash and exit happens within seconds of start.
- **Liveness probe killing the container before it's ready** — exit code from `SIGTERM`/`SIGKILL` (often 137 or 143) but *no* OOM reason, and logs show the app was still starting up (still initializing, not fully serving) when killed. Check `initialDelaySeconds`/`periodSeconds` against the app's actual startup time; confirmed if the probe's first check window is shorter than observed startup duration in logs.
- **Missing/incorrect config causing immediate exit** — logs show a config-loading error (missing env var, unreadable file, failed to parse a ConfigMap-mounted file) right before exit. Cross-check the manifest's `env`/`envFrom`/volume mounts against what the error references.
- **Missing dependency at startup** (DB/cache/queue unreachable) — logs show a connection error to a specific host:port immediately before exit, and the app exits instead of retrying. Confirmed by testing reachability to that dependency if live access is available.
- **`CreateContainerConfigError`-adjacent issue** — a referenced ConfigMap/Secret key doesn't exist. This shows as a distinct pod status, not strictly a crash loop, but is commonly reported as "crashing" by users — check `describe pod` events for this exact reason string.
- **Permission error** — logs show a permission-denied error writing to a path, often caused by `runAsNonRoot`/`runAsUser` combined with a volume or directory the process can't write to. Confirmed by matching the log's failing path against volume mounts and `securityContext`.
- **Wrong command/entrypoint override** — the manifest's `command`/`args` overrides the image's intended entrypoint, causing an immediate, deterministic exit (often exit code 127 "not found" or 126 "not executable"). Check the exit code and whether logs show a shell error rather than application output at all.
- **Bad image** (wrong architecture, corrupted layer) — logs are empty or show an exec format error immediately; happens on every attempt regardless of config. Confirmed if the image's architecture doesn't match the node's.
- **Failing init container blocking the main container** — `describe pod` shows the pod stuck with an init container in `CrashLoopBackOff`, not the main container. Diagnose the init container using this same catalog, scoped to it.

### 3. Identify the confirmed root cause

State which single cause the evidence actually confirms, and explicitly note which other candidates were ruled out and how (e.g., "not OOMKilled — exit code was 1, not 137, and memory usage was well under the limit").

### 4. Recommend the fix

Give the specific, concrete fix for the confirmed cause — not a generic "check your logs" deflection.

### 5. Verify

State what to check after the fix is applied to confirm it actually worked (e.g., "restart count should stop increasing," "logs should show successful startup to the point where it previously failed").

## Report format

1. **Symptom summary** — pod name, restart count, last exit code/reason.
2. **Evidence collected** — key excerpts from describe/logs, not the full dump.
3. **Root cause analysis** — each candidate cause considered, ruled in or out with the specific evidence that decided it.
4. **Root cause** — the confirmed cause, stated plainly.
5. **Recommended fix** — concrete and specific.
6. **How to verify** — what to check after applying the fix.

## Notes

- Always check the exit code and reason first — it eliminates most of the catalog immediately and prevents chasing the wrong theory.
- Don't stop at the first plausible cause if the evidence doesn't actually confirm it — state explicitly why alternatives were ruled out.
- If `--previous` logs aren't available (container never logged anything before dying), say so — that itself is evidence (points toward bad image/entrypoint/permission issues over application-level bugs, which usually log something first).
