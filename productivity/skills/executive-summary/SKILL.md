---
name: executive-summary
description: Write a general-purpose executive summary for any technical initiative, proposal, or body of work — concise, decision-oriented, and leading with the bottom line, distinct from an incident-specific executive summary. Triggers on "write an executive summary of this project", "summarize this proposal for executives", "give me an executive-level summary of this technical work", "draft an exec summary for this initiative".
user-invocable: true
---

# Executive Summary

Write a general-purpose, decision-oriented executive summary for any technical initiative, proposal, or body of work.

## When to use

- An executive-level summary is needed for a project, proposal, or initiative — not specifically an incident.

**Out of scope**:
- Incident-specific executive summaries (different structure — impact/cause/prevention) → `incidents/executive-summary`
- A summary tailored to a non-executive specific stakeholder audience (product, sales) → `stakeholder-summary`

## Inputs

- The initiative/proposal/work being summarized, and its current state or key content.
- What decision or action, if any, this summary is meant to support.

## Workflow

### 1. Lead with the bottom line

State the key takeaway or recommendation in the first sentence or two — executives reading a summary need the conclusion immediately, not built up to through background context (the "bottom line up front" principle).

### 2. State what decision or action this supports

Be explicit about why this summary exists — is it informational, does it need a decision, is it requesting resources — an executive summary with an unclear purpose leaves the reader unsure what's actually being asked of them.

### 3. Include only decision-relevant detail

Include the minimum detail needed to support the stated decision/purpose — omit implementation-level detail, background that doesn't change the conclusion, or exhaustive context that a decision-maker doesn't need to act.

### 4. State risks/tradeoffs honestly

Include material risks or tradeoffs, not just the favorable case — an executive summary that only presents upside undermines trust and can lead to poor decisions if risks surface later without having been flagged.

### 5. Report

A short document (typically well under one page): Bottom Line, Purpose/Ask, Key Points, Risks/Tradeoffs — proportioned to the summary's actual decision-support purpose.

## Notes

- "Bottom line up front" is the single most important structural principle here — always lead with the conclusion/recommendation, not a narrative buildup toward it; a reader should get the key point even if they only read the first sentence.
- Be explicit about the purpose (inform vs. decide vs. request) — an executive summary that doesn't make clear what's being asked of the reader often gets acknowledged but not acted on.
