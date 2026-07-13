# Executive Summary

Writes a general-purpose, decision-oriented executive summary for any technical initiative or proposal — bottom line first, explicit purpose, honest risks.

See `SKILL.md` for the full workflow.

## How to invoke

- "Write an executive summary of this project."
- "Summarize this proposal for executives."
- "Draft an exec summary for this initiative."

## Example

### Input

A proposal to migrate the company's monolith to a set of microservices over 9 months, requiring a dedicated team of 4 engineers pulled from feature work. Benefits: improved deploy independence, reduced blast radius for incidents. Risks: 9 months of reduced feature velocity from the reassigned team, and migration complexity risk given the monolith's deep internal coupling. This summary is meant to support a leadership decision on whether to approve the resourcing.

### Output (abbreviated)

> **Executive Summary: Microservices Migration Proposal**
>
> **Bottom line**: Recommend approving a 9-month, 4-engineer investment to migrate the monolith to microservices — this addresses growing deploy risk and incident blast radius, but will measurably reduce feature velocity during the migration window.
>
> **Purpose**: This summary supports a resourcing decision — specifically, whether to approve reassigning 4 engineers from feature work for 9 months.
>
> **Key points**: The monolith's current coupling has contributed to increasing deploy risk and wider-than-necessary incident blast radius (see recent incident history). Microservices migration would address both directly.
>
> **Risks**: Two material risks: (1) 9 months of reduced feature velocity from the reassigned team — a real, direct tradeoff, not a hidden cost; (2) the monolith's deep internal coupling means migration complexity risk is non-trivial and the 9-month estimate carries real uncertainty.
>
> **Ask**: Approval to reassign the proposed team for this initiative, with an understanding that feature velocity will be measurably affected during this window.

This example is illustrative — a real summary depends entirely on the actual initiative and its content.
