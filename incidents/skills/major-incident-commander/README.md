# Major Incident Commander

Coordinates a major, multi-responder incident — tracking workstreams, maintaining a decision log, and managing communication cadence, without performing the technical investigation itself.

See `SKILL.md` for the full workflow.

## How to invoke

- "Act as incident commander for this incident."
- "Help me coordinate this major incident."
- "Who's doing what right now in this incident?"

## Example

### Input

Sev1 incident, 4 responders engaged: @alice investigating database, @bob checking recent deploys, @carol handling customer communication, @dave on standby. No one has been tracking decisions made so far. 20 minutes in, @bob found a suspicious deploy but hasn't told @alice, who is still pursuing the database angle independently.

### Output (abbreviated)

> **Current workstreams**
> | Responder | Workstream | Status |
> |---|---|---|
> | @alice | Database investigation | In progress |
> | @bob | Deploy review | Found a suspicious deploy at T-5min — **not yet shared with @alice** |
> | @carol | Customer communication | Drafting status update |
> | @dave | Standby | Available for reassignment |
>
> **Coordination action needed now**: @bob's finding should be shared with @alice immediately — if the deploy is the actual cause, @alice's database investigation may be a parallel dead end worth pausing. Recommend a quick sync between @alice and @bob before continuing both threads independently.
>
> **Decision log so far**: [T+0] Sev1 declared. [T+5] Rollback of suspicious deploy not yet attempted, pending confirmation. — *(sparse so far; recommend logging each decision as it's made from here.)*
>
> Reassign @dave to prepare a rollback of the suspicious deploy once @alice and @bob confirm it's the likely cause, so we're ready to act immediately rather than starting rollback prep after confirmation.

This example is illustrative — a real coordination session depends entirely on the actual responders, workstreams, and incident state.
