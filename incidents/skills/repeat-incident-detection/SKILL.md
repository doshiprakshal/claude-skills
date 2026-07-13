---
name: repeat-incident-detection
description: Detect whether a current or past incident is a near-duplicate of a previous one — same root cause recurring despite a prior fix, or an unaddressed action item resurfacing as a new incident. Triggers on "has this happened before", "is this a repeat of a previous incident", "did we already have an action item for this that didn't get done", "check if this incident is a recurrence".
user-invocable: true
---

# Repeat Incident Detection

Detect whether a current incident is a near-duplicate of a previous one — the same underlying root cause recurring, particularly when a prior fix or action item should have prevented it.

## When to use

- Investigating whether "this has happened before."
- Checking whether an unresolved/ineffective prior action item is responsible for a new incident.

**Out of scope**:
- Extracting broad systemic themes across many incidents → `lessons-learned`
- Aggregate frequency/severity trend analysis → `incident-trend-analysis`

## Inputs

- The current incident's symptom and root cause (confirmed or suspected).
- A searchable history of past postmortems/incidents.

## Workflow

### 1. Search for candidate matches

Compare the current incident's symptom, affected component, and (if known) root cause against past incidents — look beyond exact symptom match, since the same underlying root cause can manifest with a somewhat different surface symptom.

### 2. Verify root cause match, not just symptom match

A similar surface symptom (e.g., "elevated errors on checkout") with a different underlying cause is not a repeat — confirm the actual mechanism matches, not just the affected service or error type.

### 3. Check prior action item status

If a genuine repeat is found, check whether the prior postmortem had an action item addressing this root cause, and if so, whether it was completed — an incomplete or ineffective prior fix is a distinct and important finding from "no one identified this risk before."

### 4. Report

Match found: yes/no, with confidence. If yes: the prior incident reference, the shared root cause mechanism, and the status of any prior action item (done-but-ineffective / not done / no action item existed).

## Notes

- A repeat with a prior action item that was marked done but didn't actually prevent recurrence is a more serious finding than one with no prior action item — it indicates the fix itself was inadequate, not just that follow-through was missed; call this distinction out explicitly.
- Don't over-match on symptom alone — two incidents with "elevated 500 errors on checkout" can have entirely unrelated causes; always verify the actual mechanism before declaring a repeat.
