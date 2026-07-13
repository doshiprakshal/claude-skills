# Stakeholder Summary

Translates a technical initiative into a summary tailored to a specific non-engineering stakeholder audience — what matters to them, status in their terms, and explicit risks/asks.

See `SKILL.md` for the full workflow.

## How to invoke

- "Summarize this technical work for our stakeholders."
- "Write an update on this project for the product team."
- "Draft a stakeholder update on our progress."

## Example

### Input

A database migration project is 60% complete. Technical status: the read-path migration is done, the write-path migration is in progress, and a recent discovery suggests the write-path work may take 2 extra weeks beyond the original estimate due to unexpected data consistency edge cases. Audience: the product team, who has a customer commitment tied to the completion date.

### Output (abbreviated)

> **Stakeholder Update: Database Migration — Product Team**
>
> **Status**: On track overall, but a risk has emerged that may affect the committed date.
>
> **What this means for the committed launch**: We've completed the portion of the migration that doesn't affect user-facing behavior. The remaining work (write-path migration) has hit some unexpected complexity — specifically, some data consistency edge cases we need to handle carefully to avoid customer-visible issues. Our current estimate is this could push completion out by up to 2 weeks beyond the original date.
>
> **Ask**: We'd like to flag this risk now, well before the committed date, so the team has time to decide whether to communicate a revised timeline to the customer or whether there's flexibility to adjust scope. We'll have more certainty on the exact timeline impact within the next few days and will follow up immediately.
>
> **Note on framing**: this summary leads with the risk and its business implication (the committed date) rather than technical migration-phase detail, since that's what the product team audience actually needs to act on — the underlying "data consistency edge cases" detail is mentioned briefly for context but not elaborated on technically.

This example is illustrative — a real summary depends entirely on the actual project status and stakeholder audience.
