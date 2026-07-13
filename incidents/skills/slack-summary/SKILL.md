---
name: slack-summary
description: Write a brief, real-time incident-channel status update — current status, what's known, what's being done next — formatted for a fast-moving Slack/chat thread during an active incident. Triggers on "post a status update in the incident channel", "write a slack update for this incident", "draft the next incident channel status post", "give me a quick status update for the incident thread".
user-invocable: true
---

# Slack Summary

Write a brief, real-time status update for an incident channel during an active incident — optimized for fast scanning, not completeness.

## When to use

- An active incident needs a status update posted to a chat/incident channel.

**Out of scope**:
- Post-incident summaries for leadership or customers → `executive-summary`, `customer-summary`
- The full timeline/RCA/postmortem → `timeline-generator`, `rca-generator`, `postmortem-generator`

## Inputs

- Current incident status (investigating / identified / mitigating / resolved).
- What's known so far and what's actively being done.
- Any action needed from others (e.g., "need someone with access to X").

## Workflow

### 1. Lead with status

Start with a one-word/short-phrase status marker (Investigating / Identified / Mitigating / Monitoring / Resolved) so readers scanning the channel get the headline immediately.

### 2. State what's known, briefly

Two or three bullet points max on current understanding — this is a status ping, not a report; save depth for the eventual RCA/postmortem.

### 3. State next action and owner

What's happening next and who's doing it, so others know whether to jump in or stand down.

### 4. Report

A short formatted update, typically under 6 lines, ready to paste into the incident channel.

## Notes

- Brevity is the point — a long, detailed update in a fast-moving incident channel gets skimmed or ignored; keep it to the essential status/next-action information and let the eventual postmortem carry the detail.
- Always include an explicit status marker at the top (Investigating/Identified/Mitigating/Resolved) — this is what most readers scan for first, especially anyone joining the channel mid-incident.
