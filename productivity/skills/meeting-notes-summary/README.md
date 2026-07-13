# Meeting Notes Summary

Summarizes raw meeting notes/transcript into decisions made, owned action items, and open questions.

See `SKILL.md` for the full workflow.

## How to invoke

- "Summarize these meeting notes."
- "Turn this meeting transcript into action items."
- "Extract decisions and action items from this meeting."

## Example

### Input

Raw notes: "Discussed the caching approach for the new endpoint. Jane thinks Redis makes sense, Bob wasn't sure given the team's limited Redis experience — no final call made, need to revisit after Bob checks with the platform team. Agreed to move forward with adding rate limiting regardless of the caching decision — Sam will implement by next Friday. Also touched on whether to deprecate the old v1 endpoint but ran out of time."

### Output (abbreviated)

> **Decisions Made**
> - Add rate limiting to the new endpoint, independent of the caching decision.
>
> **Action Items**
> | Action | Owner | Deadline |
> |---|---|---|
> | Implement rate limiting | Sam | Next Friday |
> | Check with platform team on Redis experience/support | Bob | Not stated — owner needed to confirm timeline |
>
> **Open Questions**
> - Caching approach for the new endpoint (Redis vs. alternative) — not decided; pending Bob's follow-up with the platform team.
> - Whether to deprecate the v1 endpoint — not discussed due to time; needs a follow-up conversation.
>
> **Note**: the caching discussion was explicitly *not* resolved despite being the meeting's main topic — flagged here as an open question rather than implying a Redis decision was made, since Bob's concern was never actually addressed.

This example is illustrative — a real summary depends entirely on the actual meeting notes provided.
