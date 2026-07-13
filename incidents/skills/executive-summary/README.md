# Executive Summary

Writes a concise, non-technical, leadership-facing incident summary — impact, brief cause, and concrete prevention commitments.

See `SKILL.md` for the full workflow.

## How to invoke

- "Write an executive summary of this incident."
- "Summarize this outage for leadership."
- "Give me a non-technical summary of what happened."

## Example

### Input

Technical findings: a code deploy at 15:00 UTC introduced a defect causing checkout failures for ~8% of transactions between 15:01 and 15:15 UTC (14 minutes), root cause was a missing test case for a specific input combination, resolved via rollback. Estimated ~$40K in failed transaction attempts during the window (some portion likely retried successfully after resolution). Follow-up: adding automated test coverage for the missing case and reducing rollback time via an automated rollback runbook.

### Output (abbreviated)

> **Executive Summary — Checkout Incident, [date]**
>
> **Impact**: For 14 minutes (15:01–15:15 UTC), approximately 8% of checkout attempts failed. Estimated revenue impact is ~$40K in failed transaction attempts, though some customers likely retried successfully after the fix.
>
> **Cause**: A code change deployed at 15:00 UTC contained a defect that wasn't caught by existing automated tests, affecting a specific checkout scenario.
>
> **Resolution**: The team identified the issue and rolled back the change, restoring normal checkout within 14 minutes of onset.
>
> **Prevention**: We are adding automated test coverage for this scenario to prevent recurrence, and building an automated rollback process to reduce response time for similar issues in the future.

This example is illustrative — a real summary depends entirely on the actual incident findings and business impact for the target incident.
