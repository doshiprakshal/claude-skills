# Chaos Engineering Review

Reviews or designs a chaos engineering practice — hypothesis-driven experiment design, blast-radius control, experiment prioritization, and findings follow-through.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our chaos engineering practice."
- "Help us design a chaos experiment."
- "Do our chaos engineering findings ever get fixed?"

## Example

### Input

The team runs monthly chaos experiments, mostly random pod-kill exercises in a staging environment with no specific hypothesis stated beforehand. Reviewing the last 6 months of experiment reports: 4 revealed real weaknesses (e.g., a missing retry on a specific dependency call), but none of the 4 findings have a corresponding tracked fix or ticket — they were noted in the report and not followed up on.

### Output (abbreviated)

> **Findings**
>
> - **No stated hypothesis per experiment** — `[Medium]` — random pod-kill without a specific "what do we expect to happen and does it" question limits how much can be learned; recommend framing each future experiment around a specific hypothesis (e.g., "if pod X is killed, do in-flight requests fail over within 2 seconds with no user-visible error").
> - **Findings never translate into fixes — 4 of 4 unaddressed** — `[Blocker]` — this is the most serious finding: the practice is successfully surfacing real weaknesses (the missing retry, and 3 others), but none have resulted in an actual fix. As currently run, this program produces reports but not reliability improvement. Recommend requiring every chaos experiment finding to result in a tracked ticket with an owner, and treating unresolved chaos findings similarly to open action items from a postmortem.
>
> **Overall verdict**: the follow-through gap is far more important than the hypothesis-design gap — fix the process so findings actually get addressed before investing further effort in running more sophisticated experiments that would just add to the same growing pile of unaddressed findings.

This example is illustrative — a real review depends entirely on the actual chaos engineering practice and findings history discovered.
