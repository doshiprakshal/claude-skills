# Process Investigation

Diagnoses a specific misbehaving process — zombie/defunct processes, an unresponsive-but-running process, unexpected signal handling, or orphaned processes.

See `SKILL.md` for the full workflow.

## How to invoke

- "Why is this process a zombie?"
- "This process is hung but not using CPU."
- "Why won't this process die?"

## Example

### Input

```
$ ps aux | grep worker
appuser  4021  0.0  0.0      0     0 ?        Z    10:15   0:00 [worker] <defunct>
appuser  4022  0.0  0.0      0     0 ?        Z    10:16   0:00 [worker] <defunct>
appuser  4023  0.0  0.0      0     0 ?        Z    10:17   0:00 [worker] <defunct>
```
15 zombie `worker` processes accumulated over the last hour, one per minute, matching a cron-like spawn pattern. Parent PID for all of them is `3999`, a long-running supervisor process.

### Output (abbreviated)

> **Symptom summary**
> 15 zombie processes, one appearing roughly every minute, all children of PID 3999 (a supervisor process).
>
> **Root cause**
> The zombies themselves are harmless (negligible resource use, just process-table entries) — the real issue is that the parent (PID 3999) is spawning short-lived `worker` children but never calling `wait()`/`waitpid()` on them after they exit, so they stay as zombies instead of being reaped. This is a bug in the supervisor's child-process management, not in the workers themselves.
>
> **Recommended fix**
> Fix PID 3999's code to properly reap child processes — either handle `SIGCHLD` and call `waitpid()` in the handler, or use a process-supervision pattern that reaps automatically. As an immediate mitigation (not a fix), restarting PID 3999 will cause its zombie children to be reparented and reaped by `init`, clearing the current backlog — but the underlying bug will keep accumulating new zombies until the supervisor code is fixed.
>
> **How to verify**
> After the fix, zombie processes should no longer accumulate — `ps aux | grep defunct` should stay empty over time instead of growing.

This example is illustrative — a real investigation depends entirely on the actual process evidence gathered from the target host.
