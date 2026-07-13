---
name: timeline-generator
description: Build a precise, chronological incident timeline from scattered evidence — alerts, deploys, chat logs, metric inflection points — normalized to a single timezone with clear event sourcing. Triggers on "build a timeline for this incident", "put together a chronological timeline of what happened", "generate the incident timeline for the postmortem", "reconstruct the sequence of events for this outage".
user-invocable: true
---

# Timeline Generator

Build a precise, chronological, source-attributed timeline of an incident from scattered evidence.

## When to use

- Assembling a chronological record of an incident from multiple evidence sources.
- The timeline section of a postmortem is needed specifically.

**Out of scope**:
- Determining root cause from the timeline → `incident-investigator`, `rca-generator`
- The full postmortem document → `postmortem-generator`

## Inputs

- Raw evidence: alert history, deploy/change logs, chat/Slack messages during the incident, metric/log inflection points, human actions taken.
- The incident's rough start/end boundaries.

## Workflow

### 1. Collect events

Gather every timestamped event across all available sources — alerts, deploys, human actions (who did what), and notable metric/log inflection points (error rate spike, recovery point).

### 2. Normalize

Convert every timestamp to a single consistent timezone (state which one explicitly), since mixed-timezone sources are a common source of a confusing or wrong timeline.

### 3. Attribute sources

Tag each event with where it came from (alert system, deploy log, Slack, metrics dashboard) so the timeline is auditable and disputed points can be traced back to their source.

### 4. Order and de-duplicate

Sort chronologically; merge near-duplicate events from different sources describing the same underlying event (e.g., an alert and a Slack message about the same spike) rather than listing both as separate entries.

### 5. Report

A chronological table: Time | Event | Source. Flag any gaps (periods with no evidence) explicitly rather than implying continuity that isn't supported by evidence.

## Notes

- Precision matters more than narrative here — resist the temptation to editorialize or infer causation within the timeline itself; causation belongs in the RCA (`rca-generator`), the timeline should just state what happened when.
- Explicitly call out timezone normalization and any assumptions made when merging near-simultaneous events from different sources, since these are the most common source of timeline disputes during postmortem review.
