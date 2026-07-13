---
name: cron-review
description: Review cron jobs and systemd timers — schedule overlap risk, error handling and failure visibility, script permission/ownership, and logging. Triggers on "review our cron jobs", "are our cron jobs overlapping", "do we know when a cron job fails", "cron and systemd timer audit".
user-invocable: true
---

# Cron Review

Review scheduled jobs (cron and systemd timers) for overlap risk, failure visibility, and permission hygiene.

## When to use

- A periodic scheduled-job hygiene review.
- The user asks whether cron jobs could overlap, or whether failures are actually noticed.

**Out of scope**:
- Diagnosing why a specific job run failed → treat as an application-level investigation using the job's own logs; this skill is a structural review, not a live-failure diagnosis

## Inputs

- All crontabs (`crontab -l` per user, `/etc/cron.d/*`, `/etc/crontab`) and systemd timers (`systemctl list-timers`).
- Each job's script and its logging/error-handling behavior.
- File permissions/ownership on job scripts.

## Workflow

### 1. Discover

Gather every scheduled job across cron and systemd timers, and their underlying scripts.

### 2. Checks

- **Schedule overlap risk** — a job scheduled frequently enough (or with unpredictable enough runtime) that a new invocation could start before the previous one finishes, without a lock/guard preventing concurrent runs (a common cause of resource contention or data corruption if the job isn't idempotent/concurrency-safe).
- **Failure visibility** — job failures actually surface somewhere a human would notice (email on failure, a monitoring check, exit-code-based alerting) rather than silently failing with cron's default behavior of just... not doing anything visible unless mail is configured and checked.
- **Script permissions/ownership** — job scripts are owned/writable only by the intended user (a world-writable script run by root via cron is a privilege-escalation path — anyone who can write to the script can get root-level execution).
- **Logging** — job output/errors captured somewhere (redirected to a log file, or the job itself logs meaningfully) rather than being discarded (`> /dev/null 2>&1`, hiding failures from any investigation).
- **Absolute paths and environment assumptions** — scripts don't assume an interactive shell's `PATH`/environment (cron runs with a minimal environment) — a common cause of "works when I run it manually, fails under cron."

### 3. Report

Findings grouped by Overlap Risk, Failure Visibility, Permissions, Logging, Environment Assumptions, each with severity and fix.

## Notes

- A world-writable script executed by root via cron is a serious, concrete privilege-escalation vector — treat as Blocker severity, not routine hygiene.
- `> /dev/null 2>&1` redirecting a job's output is extremely common and extremely dangerous from a visibility standpoint — flag it explicitly whenever found, since it means failures are completely invisible by design.
