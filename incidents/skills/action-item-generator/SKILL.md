---
name: action-item-generator
description: Generate concrete, verifiable, owned action items from a postmortem's root cause and contributing factors — not vague intentions, and distinguishing preventive fixes from detection/response improvements. Triggers on "generate action items for this postmortem", "turn these findings into action items", "what should our follow-up tasks be from this incident", "draft concrete action items with owners for this rca".
user-invocable: true
---

# Action Item Generator

Generate concrete, verifiable, owned action items from a postmortem's root cause and contributing factors.

## When to use

- Converting root cause / contributing factor findings into a follow-up action item list.

**Out of scope**:
- Producing the root cause analysis itself → `rca-generator`
- Assembling the full postmortem document (action items are one section) → `postmortem-generator`
- Cross-incident systemic investment framing → `lessons-learned`

## Inputs

- Root cause and contributing factors (from `rca-generator` or equivalent).
- Available owners/teams, if known.

## Workflow

### 1. Map each finding to a candidate action

For the root cause, generate a preventive action (stops this class of issue from recurring). For each contributing factor, generate a detection/response action (reduces time-to-detect or time-to-resolve for this class of issue, even if it doesn't prevent the trigger).

### 2. Make each action concrete and verifiable

Reject vague phrasing ("improve monitoring," "be more careful") in favor of specific, checkable outcomes ("add an alert firing when X exceeds Y within Z minutes," "add automated test coverage for input combination X") — a good action item should be answerable as done/not-done without interpretation.

### 3. Assign owner and rough priority

Every action item gets a specific owner (person or team, not "engineering") and a priority/urgency relative to the others — not every action item from an incident is equally urgent, and treating them all as equally critical dilutes follow-through.

### 4. Flag scope creep

If a proposed action item is a large, multi-quarter initiative disguised as a postmortem action item (e.g., "rearchitect the entire service"), flag it as such explicitly and recommend it be tracked as a separate initiative rather than a postmortem follow-up, since postmortem action items with unrealistic scope tend to never get closed.

### 5. Report

A table: Action | Owner | Priority | Type (preventive/detection/response) | Verifiable outcome.

## Notes

- An action item's value is proportional to how verifiable it is — always push toward a specific, checkable outcome over a general intention, since vague action items are the most common reason postmortem follow-through fails.
- Distinguish preventive actions (address root cause) from response/detection actions (address contributing factors) explicitly in the output — conflating them makes it unclear whether the actual trigger is being addressed or just the response process around it.
