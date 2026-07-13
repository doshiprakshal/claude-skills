---
name: log-analysis
description: General-purpose analysis of application/system log files — pattern extraction, error-rate trend detection, and anomaly identification in log volume or content. Distinct from journalctl-analysis (systemd journal specifically) and kernel-log-analysis (kernel messages specifically). Triggers on "analyze this log file", "find the error pattern in these logs", "log analysis", "is there an anomaly in our log volume".
user-invocable: true
---

# Log Analysis

General-purpose analysis of application/system log files (not journald-specific, not kernel-specific) — extracting patterns, trends, and anomalies from arbitrary log content.

## When to use

- Analyzing a specific application or system log file (not the systemd journal or kernel messages specifically).
- Looking for an error pattern, a volume anomaly, or a trend across a log file.

**Out of scope**:
- systemd journal querying → `journalctl-analysis`
- Kernel message interpretation → `kernel-log-analysis`
- Structured observability log analysis at scale (Loki/Splunk/Datadog) → the `observability` domain's dedicated skills

## Inputs

- The log file(s) or a sample/excerpt.
- The specific question: finding a pattern, detecting an anomaly, understanding an error rate trend.

## Workflow

### 1. Understand the log format

Identify the log's structure (plain text, JSON lines, a specific application's format) before attempting pattern extraction — this determines what tooling/approach fits (grep/awk for plain text, jq for JSON lines).

### 2. Extract and analyze

- **Pattern extraction** — find all occurrences of a specific error/pattern, with counts and time distribution.
- **Volume anomaly detection** — compare log volume over time (spikes or unusual drops in log rate can indicate an incident — a sudden spike often means an error loop, a sudden drop can mean the application stopped logging entirely, which is its own red flag).
- **Error-rate trend** — error-to-total-log-line ratio over time, to distinguish a gradual degradation from a sudden onset.
- **Correlation** — if multiple log sources are available, correlate timestamps across them for a fuller picture of what happened.

### 3. Report

1. **What was found** — the specific pattern/anomaly/trend, with concrete counts and timestamps.
2. **Interpretation** — what it likely indicates.
3. **Next step** — if the finding points toward a more specific investigation (e.g., a memory-related error pattern → `memory-investigation`), name it.

## Notes

- A sudden drop in log volume to near-zero is often as significant a signal as a spike — it can mean the application has crashed/hung rather than that everything is fine.
- Always ground findings in actual counts/timestamps from the log content — don't characterize a pattern as "frequent" or "rare" without citing the specific numbers.
