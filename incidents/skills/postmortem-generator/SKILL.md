---
name: postmortem-generator
description: Assemble a complete, blameless postmortem document from investigation, timeline, RCA, and impact inputs — the full structured document, not a single section. Triggers on "generate the postmortem for this incident", "assemble the full postmortem document", "write up this incident as a postmortem", "put together the postmortem doc".
user-invocable: true
---

# Postmortem Generator

Assemble a complete, blameless postmortem document from already-gathered incident inputs (timeline, RCA, impact, action items).

## When to use

- A full postmortem document is needed, assembling multiple already-produced pieces (or gathering them if not yet produced).

**Out of scope**:
- Producing the individual sections in depth — delegate to `timeline-generator`, `rca-generator`, `impact-assessment`, `action-item-generator` if those inputs don't yet exist
- Extracting broader lessons across multiple postmortems → `lessons-learned`

## Inputs

- Timeline (or raw evidence to build one).
- Root cause analysis (or raw findings to build one).
- Impact assessment.
- Action items with owners, if decided.

## Workflow

### 1. Assemble inputs

Check which inputs already exist (timeline, RCA, impact assessment); for any missing, note explicitly that they should be produced via the relevant dedicated skill first, or draft a lightweight version inline if the user wants to proceed without full depth.

### 2. Structure the document

Standard sections: Summary, Impact, Timeline, Root Cause (trigger/root cause/contributing factors), Detection, Resolution, Action Items (owner + due date for each), Lessons Learned.

### 3. Apply blameless framing

Review the language throughout for blame framing ("X forgot to..." / "the engineer made an error") and reframe toward systemic conditions ("the process didn't require a review step that would have caught this") — blameless framing is a deliberate, non-optional editorial pass, not just a nice-to-have tone choice.

### 4. Verify action items are concrete

Every action item has a specific owner and is phrased as a concrete, verifiable change (not "improve monitoring" but "add an alert for X condition") — vague action items are a common postmortem failure mode that produces no actual follow-through.

### 5. Report

The complete postmortem document.

## Notes

- The blameless-framing pass is not optional — even a technically accurate postmortem that reads as blaming an individual undermines the psychological safety needed for honest future incident reporting; always do this pass explicitly before finalizing.
- If inputs are missing (no timeline, no confirmed RCA), say so explicitly rather than fabricating plausible-sounding but unverified detail to fill the document.
