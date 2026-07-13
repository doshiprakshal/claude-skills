---
name: dmesg-analysis
description: Parse a specific dmesg ring buffer dump to reconstruct a boot-time or runtime kernel event timeline, correlating timestamps with an incident window. Mechanical, timeline-focused — distinct from kernel-log-analysis's broader message-meaning catalog. Triggers on "analyze this dmesg output", "walk through our boot log", "dmesg timeline for this incident", "dmesg analysis".
user-invocable: true
---

# dmesg Analysis

Parse a specific `dmesg` dump to reconstruct a timeline of kernel events — mechanical timestamp correlation and sequencing, distinct from `kernel-log-analysis`'s broader catalog of what different kernel message patterns generally mean.

## When to use

- Given a specific dmesg dump, need to reconstruct what happened and when.
- Correlating a dmesg dump with an incident window.

**Out of scope**:
- General interpretation of a kernel message pattern's meaning (feeds into this skill, but is the dedicated job of) → `kernel-log-analysis`
- systemd journal querying (dmesg is the kernel ring buffer specifically, a subset of what journalctl can show) → `journalctl-analysis`

## Inputs

- The dmesg output (raw, or via `dmesg -T` for human-readable timestamps).
- The incident time window, if correlating against a specific event.

## Workflow

### 1. Normalize timestamps

`dmesg`'s default output shows seconds-since-boot, not wall-clock time — convert using `dmesg -T` or by calculating from the system's boot time (`uptime -s`), since raw seconds-since-boot is not directly comparable to an incident's wall-clock timestamp.

### 2. Build the timeline

Sequence every relevant kernel event chronologically, noting gaps (long periods with no messages, which is normal, vs. a message immediately preceding a known failure point).

### 3. Correlate with the incident window

If investigating a specific incident, filter/highlight the messages falling within or immediately before the incident's known time window — the message(s) immediately preceding the failure are the most likely to be causally related.

### 4. Interpret key messages

For any message whose meaning isn't immediately obvious, apply `kernel-log-analysis`'s pattern catalog (or note that a message is unrecognized and needs further research rather than guessing).

### 5. Report

1. **Normalized timeline** — chronological, wall-clock-timestamped.
2. **Incident-window correlation** — what happened immediately before/during the incident.
3. **Key findings** — the specific message(s) most likely related to the incident, with interpretation.

## Notes

- Always convert to wall-clock time before attempting to correlate with an incident timestamp — raw seconds-since-boot is easy to misread as something else.
- A long silent gap in dmesg output right before an incident isn't itself meaningful (it just means nothing kernel-notable happened) — don't over-interpret an absence of messages.
