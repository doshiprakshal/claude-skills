---
name: meeting-notes-summary
description: Summarize raw meeting notes/transcript into a structured, actionable format — decisions made, action items with owners, and open questions, separating signal from unstructured discussion. Triggers on "summarize these meeting notes", "turn this meeting transcript into action items", "extract decisions and action items from this meeting", "clean up these raw meeting notes into a summary".
user-invocable: true
---

# Meeting Notes Summary

Summarize raw meeting notes or a transcript into a structured, actionable format, separating decisions and action items from unstructured discussion.

## When to use

- Turning raw meeting notes/transcript into a clean, structured, actionable summary.

**Out of scope**:
- Formal decision documentation with full context/alternatives for a significant architectural choice → `adr-generator`
- Audience-tailored communication of the outcome to a non-attendee audience → `stakeholder-summary`

## Inputs

- The raw meeting notes or transcript.
- Context on the meeting's purpose, if not obvious from the notes.

## Workflow

### 1. Extract decisions made

Identify what was actually decided during the meeting, stated unambiguously — distinguish a genuine decision from a discussion point that didn't reach resolution, since conflating the two creates false confidence that something was settled.

### 2. Extract action items with owners

Identify concrete action items, each with a specific owner and, if stated, a deadline — an action item with no owner is a common way meeting outcomes fail to translate into actual follow-through, similar to the concrete-ownership principle in `incidents/action-item-generator`.

### 3. Extract open questions

Identify what remains unresolved and needs further discussion or a follow-up — explicitly separating this from decided items prevents an open question from being silently treated as settled.

### 4. Filter out non-actionable discussion

Summarize substantive discussion context briefly where it explains a decision's reasoning, but don't transcribe the full back-and-forth — the goal is a scannable, actionable summary, not a verbatim record.

### 5. Report

A structured summary: Decisions Made, Action Items (owner + deadline), Open Questions, with a brief discussion-context note only where needed to explain a decision's reasoning.

## Notes

- Always distinguish a genuine decision from an inconclusive discussion point — treating unresolved debate as a settled decision in the summary creates false alignment that surfaces as confusion later.
- An action item without an owner is effectively not actionable — if the notes don't clearly assign one, flag it explicitly as "owner needed" rather than silently omitting it or guessing.
