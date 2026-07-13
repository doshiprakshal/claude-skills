---
name: journalctl-analysis
description: Query and correlate systemd journal logs effectively — cross-unit correlation around a specific time window, boot-scoped queries, priority filtering, and structured field extraction. Distinct from kernel-log-analysis (kernel-message interpretation) and log-analysis (non-journald logs). Triggers on "search our systemd journal", "correlate logs across services around this time", "journalctl analysis", "find what happened in the journal before this crash".
user-invocable: true
---

# Journalctl Analysis

Query and correlate systemd journal logs effectively to answer a specific question — what happened, across which units, around a specific time. Distinct from `kernel-log-analysis` (interpreting kernel message *meaning*) and `log-analysis` (non-journald application logs) — this skill is about querying the journal itself effectively.

## When to use

- Investigating an incident using systemd journal logs.
- The user wants logs correlated across multiple units around a specific time window.

**Out of scope**:
- Interpreting what a kernel message means → `kernel-log-analysis`
- Non-journald application log analysis → `log-analysis`

## Inputs

- The time window or event of interest.
- Which units are relevant (or "all," if the investigation needs cross-unit correlation).
- Specific boot, if investigating something boot-scoped (`journalctl -b`, `-b -1` for previous boot).

## Workflow

### 1. Scope the query

Build a targeted `journalctl` query rather than dumping the entire journal: time range (`--since`/`--until`), specific unit(s) (`-u`), priority level (`-p`) if looking for errors specifically, and boot scope if relevant.

### 2. Correlate across units

For an incident investigation, pull logs from every plausibly-relevant unit in the same time window, interleaved chronologically (`journalctl` naturally interleaves multiple `-u` selections), to see the actual sequence of events across services rather than one service's logs in isolation.

### 3. Extract structured fields if relevant

Use `journalctl -o json` (or `--output=json-pretty`) to extract specific structured fields (`_PID`, `_SYSTEMD_UNIT`, `MESSAGE`, custom fields set via structured logging) when a simple text search isn't precise enough.

### 4. Report

1. **Query used** — the specific `journalctl` invocation, so it's reproducible.
2. **Timeline** — chronological, cross-unit if relevant, with the key events highlighted.
3. **Findings** — what the correlated logs show about the sequence of events.

## Notes

- Persistent journal storage must be enabled (`/var/log/journal` exists, not just volatile in-memory) for logs to survive a reboot — check this if historical logs seem to be missing entirely.
- Always scope queries with `--since`/`--until` for anything beyond a quick check — an unscoped `journalctl` on a busy host can return an enormous, unusable amount of output.
