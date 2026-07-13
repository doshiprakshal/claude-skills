# Postmortem Generator

Assembles a complete, blameless postmortem document from timeline, RCA, impact, and action-item inputs.

See `SKILL.md` for the full workflow.

## How to invoke

- "Generate the postmortem for this incident."
- "Write up this incident as a postmortem."
- "Put together the postmortem doc."

## Example

### Input

Draft note from an engineer: "Jane deployed a change without running the full test suite and it broke checkout for 14 minutes. We rolled back. Jane should be more careful next time." Timeline, RCA, and impact data are otherwise available separately.

### Output (abbreviated)

> **Postmortem: Checkout Disruption, [date]**
>
> **Summary**: A deployment introduced a defect causing checkout failures for ~8% of transactions over 14 minutes; resolved via rollback.
>
> **Root Cause**: The deployed change was not covered by the full automated test suite, and no process step required full-suite execution before deploying to this service — the change reached production without validation that would have caught the defect.
>
> **Action Items**:
> | Action | Owner | Due |
> |---|---|---|
> | Make full test suite execution a required, automated CI gate before deploy to checkout-service | @platform-team | [date] |
> | Add test coverage for the specific input combination that triggered the defect | @checkout-team | [date] |
>
> **Note on framing**: the original note ("Jane should be more careful") was reframed — the postmortem instead identifies that no automated gate *required* full-suite execution, which is the systemic, fixable condition. Blaming individual carefulness produces no durable fix and discourages honest reporting in future incidents.

This example is illustrative — a real postmortem depends entirely on the actual timeline, RCA, and impact data for the target incident.
