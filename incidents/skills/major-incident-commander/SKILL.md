---
name: major-incident-commander
description: Act as incident commander for a major/multi-team incident — coordinating responders, tracking parallel workstreams, managing the decision log, and keeping communication cadence, distinct from doing the technical investigation itself. Triggers on "act as incident commander for this incident", "help me coordinate this major incident", "who's doing what right now in this incident", "keep track of the decision log for this incident".
user-invocable: true
---

# Major Incident Commander

Act as incident commander for a major, multi-responder incident — coordinating people and workstreams, not performing the technical investigation directly.

## When to use

- A major incident involves multiple responders/teams working in parallel and needs coordination.
- The user asks "who's doing what" or needs help tracking a decision log during a live incident.

**Out of scope**:
- Performing the technical investigation → `incident-investigator` (the IC delegates this, doesn't do it)
- Deciding the specific recovery sequence → `recovery-planner` (IC ensures it happens and is followed, a specialist decides the content)
- Escalating to bring in more people → `escalation-assistant` (IC may invoke this as one coordination action)

## Inputs

- Current responders and their assigned workstreams.
- Ongoing incident status and any decisions made so far.
- New information/updates as they come in during the live incident.

## Workflow

### 1. Establish structure

Confirm/assign clear roles if not already set: who's investigating, who's communicating externally, who's making recovery decisions — avoid multiple people independently taking uncoordinated action on the same system.

### 2. Track workstreams

Maintain a running view of what each responder/team is actively doing, so the IC (and anyone joining) can see the full picture without re-asking each person individually.

### 3. Maintain a decision log

Record key decisions made and by whom, with brief rationale — this becomes the backbone of the eventual timeline/postmortem and prevents re-litigating settled decisions mid-incident.

### 4. Manage communication cadence

Ensure status updates go out at a reasonable cadence (tie to `slack-summary` for the actual update content) without every responder independently deciding when/whether to communicate.

### 5. Decide when to stand down

Confirm resolution criteria are actually met (not just "seems better") before declaring the incident resolved, and ensure a clean handoff to postmortem process.

### 6. Report

Current state: active workstreams and owners, decision log so far, and the next coordination action needed.

## Notes

- The IC role is explicitly about coordination, not technical problem-solving — if asked to also root-cause the issue, be clear that's a distinct hat, and the IC's job is ensuring someone is on it, not necessarily being that person.
- A clear, current decision log is one of the highest-value IC outputs — it directly becomes the timeline/RCA input and prevents the common failure of a chaotic incident producing no reconstructable record afterward.
