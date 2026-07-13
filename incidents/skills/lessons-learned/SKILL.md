---
name: lessons-learned
description: Extract broader, cross-incident lessons and systemic patterns from a set of postmortems, distinct from the single-incident action items in any one postmortem. Triggers on "what lessons can we learn across these incidents", "extract systemic patterns from our last quarter of postmortems", "are there recurring themes across our incidents", "cross-incident lessons learned review".
user-invocable: true
---

# Lessons Learned

Extract broader, systemic lessons and recurring patterns across multiple postmortems, distinct from any single incident's specific action items.

## When to use

- Reviewing multiple postmortems together (e.g., quarterly) to find systemic patterns.
- The user asks whether recurring themes exist across incidents.

**Out of scope**:
- Action items for a single incident → `postmortem-generator`
- Statistical trend analysis (frequency, MTTR trends over time) → `incident-trend-analysis`
- Detecting near-identical repeat incidents specifically → `repeat-incident-detection`

## Inputs

- A set of postmortems (typically covering a defined period, e.g., a quarter).

## Workflow

### 1. Gather individual root causes and contributing factors

Extract the root cause and contributing factors from each postmortem in the set.

### 2. Look for systemic patterns

Group by underlying theme rather than surface symptom — e.g., multiple incidents whose root cause traces back to "insufficient test coverage for edge cases," or "missing automated rollback capability extending resolution time," even if the specific services/symptoms differed each time.

### 3. Distinguish signal from coincidence

A pattern across 2 incidents may be coincidence; require enough recurrence (or a sufficiently severe single instance) before elevating something to a "systemic lesson" worth organizational investment — state the confidence/sample size explicitly.

### 4. Connect to organizational investment

For each identified systemic pattern, frame the implied investment (e.g., "invest in automated rollback tooling across services" rather than "fix rollback for service X") — the value of this skill over single-postmortem action items is exactly this org-level framing.

### 5. Report

Patterns identified, supporting incidents (count and brief reference), and the recommended systemic investment for each, ordered by how many incidents (or how much severity) each pattern accounts for.

## Notes

- The value here is elevating from "fix this one thing" to "invest in this capability class" — always frame conclusions at the capability/process level, not as a list of individual incident fixes (that's what the postmortems already contain).
- Be explicit about pattern confidence — a pattern seen across many incidents deserves more organizational weight than one inferred from two loosely related ones; don't overstate connections to make a narrative feel more complete than the evidence supports.
