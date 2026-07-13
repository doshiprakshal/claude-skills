---
name: process-investigation
description: Diagnose a specific misbehaving process — zombie/defunct processes, an unresponsive-but-running process, unexpected signal handling, or orphaned processes — using process-state and /proc evidence. Distinct from cpu-investigation/memory-investigation's resource-consumption focus. Triggers on "why is this process a zombie", "this process is hung but not using cpu", "process investigation", "why won't this process die".
user-invocable: true
---

# Process Investigation

Diagnose a specific process's lifecycle/state problem — zombies, hangs, unexpected signal behavior — using process-state evidence from `/proc` and process-management tools. Distinct from `cpu-investigation`/`memory-investigation`, which focus on resource consumption; this is about a process's *state and behavior*, not how much CPU/memory it's using.

## When to use

- A specific process is a zombie, hung, or won't respond to signals.
- The user asks why a particular process is behaving oddly.

**Out of scope**:
- Resource consumption (CPU/memory) diagnosis for a process → `cpu-investigation`/`memory-investigation`
- A systemd service failing to start/stay running → `service-failure-investigation`

## Inputs

- Process state (`ps aux`, specifically the `STAT` column).
- `/proc/<pid>/status`, `/proc/<pid>/stack` (if accessible), open file descriptors (`lsof -p`).
- Parent process ID and process tree (`pstree`).

## Workflow

### 1. Gather evidence

Get the process's state, parent, and (if it appears hung rather than zombie) what it's currently doing (`strace -p` briefly, or `/proc/<pid>/stack` for the kernel-level wait reason).

### 2. Work through the root cause catalog

- **Zombie (`Z` state)** — the process has terminated but its exit status hasn't been reaped by its parent. A zombie itself consumes negligible resources (just a process table entry) and can't be killed directly (it's already dead) — the fix is to signal or fix the *parent* to reap it (`SIGCHLD` handling bug in the parent), or if the parent is also dead/unresponsive, the zombie will be reparented to `init`/`PID 1` and reaped automatically. A large accumulation of zombies indicates a parent process with a reaping bug.
- **Unresponsive but running (`R`/`S` state, not responding to its actual function)** — the process is scheduled and "running" from the OS's perspective but not doing useful work (e.g., a hung network call, a deadlock). Use `strace -p <pid>` briefly to see what syscall it's stuck in (a `read`/`recv` stuck indefinitely suggests a hung network peer; a `futex` wait suggests an application-level deadlock).
- **`D` state (uninterruptible sleep)** — blocked on I/O at the kernel level, can't even be killed with `SIGKILL` until the I/O completes or times out — cross-reference `disk-investigation`/`filesystem-investigation` if this is the actual cause, since it's an I/O issue manifesting as a "stuck process."
- **Won't die despite `SIGKILL`** — almost always a `D`-state process (see above) — `SIGKILL` can't interrupt an uninterruptible kernel-level wait; the process will terminate once the underlying I/O operation completes or fails.
- **Orphaned process** — parent has exited but the child continues running, reparented to `init`. Not inherently a problem, but worth checking whether the orphaning was intentional (a deliberately daemonized process) or a bug (the parent crashed and should have cleaned up its children first).

### 3. Report

1. **Symptom summary** — process state, PID, parent.
2. **Root cause** — the specific state/behavior pattern confirmed.
3. **Recommended fix** — specific to the pattern (fix the parent's reaping, investigate the underlying I/O wait, etc.), not just "kill -9 it" when that wouldn't actually work.

## Notes

- `kill -9` doesn't work on `D`-state processes — recommending it without checking process state first is a common, ineffective first instinct.
- A zombie can't be "killed" — it's already dead; the fix always targets the parent, not the zombie PID itself.
