# Runbook Review

Reviews runbook quality and currency across a service portfolio — coverage, findability, currency, and whether runbooks have actually been validated.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our runbook quality and coverage."
- "Are our runbooks actually up to date?"
- "Have our runbooks ever actually been tested?"

## Example

### Input

15 documented runbooks exist in a wiki, not linked from any alert. A recent incident review noted the on-call engineer couldn't find the relevant runbook during a live incident and solved the problem from scratch, only discovering afterward that a runbook existed. Another runbook references restarting a service via a deployment tool that was replaced 8 months ago. No runbook has a recorded "last validated" date.

### Output (abbreviated)

> **Findings**
>
> - **Runbooks not linked from alerts, unfindable during a live incident — confirmed by a recent real case** — `[Blocker]` — this isn't theoretical; a recent incident directly demonstrates the cost of this gap (an existing runbook went unused, extending resolution time). Recommend linking relevant runbooks directly from alert definitions as the top priority.
> - **Runbook referencing a deployment tool replaced 8 months ago** — `[High]` — actively misleading; following this runbook as written during an incident would fail or cause confusion. Audit and update, and add a lighter-weight review trigger tied to major tooling changes going forward.
> - **No runbook has ever been validated/drilled** — `[High]` — all 15 runbooks carry unverified risk; recommend a rotating validation schedule (e.g., drill a subset each quarter) rather than continuing to treat all 15 as equally trustworthy.
>
> **Overall verdict**: the findability gap is the most urgent given it's already caused a real, documented incident impact — fix alert-linking first, then prioritize currency review for runbooks tied to frequently-changing tooling, then establish an ongoing validation cadence.

This example is illustrative — a real review depends entirely on the actual runbook inventory and incident history discovered.
