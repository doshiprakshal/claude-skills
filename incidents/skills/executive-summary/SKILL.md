---
name: executive-summary
description: Write an executive-level incident summary — business impact, duration, root cause in plain language, and what's being done to prevent recurrence, without engineering jargon or excessive technical detail. Triggers on "write an executive summary of this incident", "summarize this outage for leadership", "draft a leadership-facing incident summary", "give me a non-technical summary of what happened".
user-invocable: true
---

# Executive Summary

Write a concise, non-technical, business-impact-focused summary of an incident for leadership audiences.

## When to use

- A leadership/executive-facing summary of an incident is needed.
- The user asks for a non-technical version of an incident writeup.

**Out of scope**:
- The full technical postmortem → `postmortem-generator`
- Customer-facing communication (different audience, different constraints) → `customer-summary`
- Real-time incident-channel updates → `slack-summary`

## Inputs

- The incident's technical findings (root cause, timeline, resolution) — typically from `rca-generator`/`timeline-generator` output.
- Business impact data: affected users/revenue/SLA implications if known.
- Prevention/follow-up actions planned.

## Workflow

### 1. Translate to business terms

Convert technical root cause into plain language focused on what happened and why, omitting implementation-level detail (specific error messages, code paths, infrastructure component names) unless directly relevant to understanding impact.

### 2. Lead with impact

Open with what was affected, for how long, and the business consequence (customer impact, revenue, SLA) — this is what leadership needs first, before the story of how it happened.

### 3. State the cause briefly

One or two sentences on cause, in plain language — enough to convey "this is understood and addressable," not a full technical explanation.

### 4. State prevention

What's being done to prevent recurrence, framed as concrete commitments, not vague reassurance ("we're looking into it" is not sufficient; "we're adding automated testing for X" is).

### 5. Report

A short document (typically under one page): Impact, Duration, Cause (brief), Resolution, Prevention. No jargon, no unexplained acronyms.

## Notes

- Keep it short — executive summaries that run long defeat their own purpose; if the full technical story is needed, link to the postmortem rather than including it.
- Avoid hedging language that undermines confidence ("we think maybe") when the technical investigation has actually reached a confirmed conclusion — match the summary's certainty to the investigation's actual confidence level, from either `incident-investigator` or `rca-generator` output.
