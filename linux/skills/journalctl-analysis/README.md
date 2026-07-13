# Journalctl Analysis

Queries and correlates systemd journal logs effectively — cross-unit correlation around a specific time window, boot-scoped queries, priority filtering, and structured field extraction.

See `SKILL.md` for the full workflow.

## How to invoke

- "Search our systemd journal for errors around 3pm."
- "Correlate logs across services around this time."
- "Find what happened in the journal before this crash."

## Example

### Input

`app.service` crashed at approximately 14:32 UTC. Need to know what happened across the system in the minutes before.

### Output (abbreviated)

> **Query used**
> ```bash
> journalctl -u app.service -u docker.service -u systemd-oomd.service --since "14:28" --until "14:35" -o short-iso
> ```
>
> **Timeline**
> ```
> 2026-07-12T14:30:12+00:00 systemd-oomd: Killed /system.slice/app.service due to memory pressure
> 2026-07-12T14:30:12+00:00 app.service: Main process exited, code=killed, status=9/KILL
> 2026-07-12T14:30:13+00:00 app.service: Failed with result 'signal'
> 2026-07-12T14:32:01+00:00 app.service: Started (auto-restart)
> 2026-07-12T14:32:15+00:00 app.service: Fatal error: could not bind to port 8080 (address already in use)
> ```
>
> **Findings**
> The crash at 14:32 wasn't the original problem — `systemd-oomd` killed `app.service` at 14:30 due to memory pressure (a separate issue worth investigating via `memory-investigation`). The auto-restart at 14:32 then failed because port 8080 was still held by something — likely a lingering process from the killed instance that hadn't fully released the port yet, or another process. The reported 14:32 crash is a downstream symptom of the 14:30 OOM kill, not an independent issue.

This example is illustrative — a real analysis depends entirely on the actual journal content for the target host and time window.
