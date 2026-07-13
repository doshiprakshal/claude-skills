---
name: rca-generator
description: Generate a formal root cause analysis document from investigation evidence — structured cause chain (trigger, root cause, contributing factors), not just a one-line summary. Triggers on "generate an rca for this incident", "write a root cause analysis document", "produce a formal rca", "draft the root cause analysis section of the postmortem".
user-invocable: true
---

# RCA Generator

Generate a formal, structured root cause analysis document from investigation evidence, distinguishing the triggering event, the root cause, and contributing factors.

## When to use

- A formal RCA document is needed from already-gathered incident evidence.
- The user wants the root-cause section of a postmortem drafted specifically.

**Out of scope**:
- Performing the investigation itself to gather evidence → `incident-investigator`
- The full postmortem document (RCA is one section of it) → `postmortem-generator`
- Categorizing this RCA against a taxonomy of past incidents → `root-cause-categorization`

## Inputs

- Investigation findings: timeline, evidence, confirmed root cause, ruled-out alternatives.
- Any contributing factors identified (things that worsened impact or delayed detection/recovery, distinct from the trigger itself).

## Workflow

### 1. Structure the cause chain

Distinguish three layers explicitly, since conflating them produces a weak RCA:
- **Trigger** — the specific event that started the incident (e.g., "a deploy introduced a null-pointer bug").
- **Root cause** — the underlying condition that allowed the trigger to cause impact (e.g., "no automated test covered this code path" or "the service had no input validation for this case").
- **Contributing factors** — things that worsened impact, delayed detection, or slowed recovery, but didn't cause the incident (e.g., "the relevant alert had a 10-minute delay" or "the rollback runbook was outdated").

### 2. Verify the "five whys" depth

For the stated root cause, ask whether it's actually root or just a proximate cause one level down from the trigger — a root cause of "the code had a bug" is usually too shallow; push toward the systemic condition (missing test coverage, missing validation, an architectural assumption that broke) that a fix should actually address.

### 3. Draft the document

Sections: Summary, Timeline (reference `timeline-generator` output if available), Trigger, Root Cause, Contributing Factors, Impact (reference `impact-assessment` if available), Detection (how/when it was noticed), Resolution (what restored service).

### 4. Report

The drafted RCA document.

## Notes

- Resist stopping at the first proximate cause — a genuinely useful RCA identifies the systemic condition, not just "what line of code broke," so the resulting action items address prevention, not just the single instance.
- Keep trigger, root cause, and contributing factors visually distinct in the document — merging them into one narrative paragraph is the most common way RCAs become vague and unactionable.
