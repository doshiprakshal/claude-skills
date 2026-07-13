# Lessons Learned

Extracts broader, systemic lessons and recurring patterns across a set of postmortems, distinct from any single incident's action items.

See `SKILL.md` for the full workflow.

## How to invoke

- "What lessons can we learn across these incidents?"
- "Extract systemic patterns from our last quarter of postmortems."
- "Are there recurring themes across our incidents?"

## Example

### Input

Q2 postmortems (6 total): 3 had root causes traced to "insufficient test coverage for edge-case inputs" across different services (checkout, pricing, inventory). 2 had resolution time significantly extended by manual rollback processes. 1 was an unrelated infrastructure/AZ failure.

### Output (abbreviated)

> **Pattern 1: Insufficient edge-case test coverage** — `[3 of 6 incidents]`
> Checkout, pricing, and inventory incidents all traced back to untested edge-case inputs reaching production. This recurrence across three different services and teams suggests a systemic gap rather than isolated oversight. **Recommended investment**: org-wide guidance or tooling for edge-case test generation, not just per-service fixes — e.g., property-based testing adoption or a shared checklist for PR review.
>
> **Pattern 2: Manual rollback extends resolution time** — `[2 of 6 incidents]`
> Two incidents had resolution meaningfully delayed by manual, undocumented rollback steps. **Recommended investment**: automated one-click rollback capability as shared platform tooling.
>
> **Not elevated**: the AZ failure incident is treated as isolated (1 of 6, distinct root cause) — not enough recurrence to justify a systemic conclusion beyond what that single postmortem's own action items already cover.
>
> **Overall**: two systemic investments (edge-case test tooling, automated rollback) account for 5 of 6 incidents this quarter — worth prioritizing over addressing each service's specific fix in isolation.

This example is illustrative — a real analysis depends entirely on the actual postmortems reviewed for the target period.
