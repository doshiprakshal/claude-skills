---
name: incident-metrics-review
description: Review the incident response program's own metrics (MTTD, MTTA, MTTR, postmortem completion rate, action item closure rate) for health, distinct from analyzing trends in the incidents themselves. Triggers on "review our incident response metrics", "is our postmortem process actually working", "what's our action item closure rate", "review the health of our incident response program".
user-invocable: true
---

# Incident Metrics Review

Review the incident response *program's* own operational metrics — detection/acknowledgment/resolution speed, and process-health indicators like postmortem completion and action item closure — as distinct from the incidents' content itself.

## When to use

- Assessing whether the incident response process itself is healthy, not the incidents' technical trends.
- The user asks about postmortem completion rate or action item closure rate specifically.

**Out of scope**:
- Incident frequency/severity/MTTR trend by service → `incident-trend-analysis` (this skill also covers MTTR but at the program level, e.g., whether every incident gets an MTTR recorded at all)
- Systemic technical lessons → `lessons-learned`

## Inputs

- Incident records with timestamps (detected, acknowledged, resolved) and postmortem/action-item completion status.

## Workflow

### 1. Compute process-speed metrics

MTTD (time from onset to detection), MTTA (detection to acknowledgment/response start), MTTR (acknowledgment to resolution) — computed consistently and reported both as averages and distributions (a single slow outlier skews an average badly; medians/percentiles are usually more informative).

### 2. Assess process-completion health

- **Postmortem completion rate** — what fraction of incidents meeting the postmortem threshold (e.g., all Sev1/Sev2) actually got a postmortem written, and within what timeframe.
- **Action item closure rate** — what fraction of action items from postmortems were actually completed, and how long they took versus their stated due date — a program generating action items that don't get closed isn't actually improving reliability regardless of how good the RCAs are.

### 3. Identify process gaps

Incidents that skipped acknowledgment tracking, had no postmortem despite meeting the threshold, or had action items with no owner/due date at all — these represent the process itself breaking down, not incident-specific findings.

### 4. Report

Process-speed metrics (MTTD/MTTA/MTTR, with distribution not just average), postmortem completion rate, action item closure rate, and identified process gaps.

## Notes

- Action item closure rate is often the most revealing and most neglected metric — a healthy-looking postmortem practice with a low closure rate means the RCA work isn't translating into actual reliability improvement; report it prominently even if not specifically asked for.
- Prefer medians/percentiles over averages for MTTD/MTTA/MTTR — a program's typical performance is usually better represented by the median, since a small number of extreme outlier incidents can distort an average without reflecting typical experience.
