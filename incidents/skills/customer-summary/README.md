# Customer Summary

Writes a customer-facing incident summary or status-page update — accurate about impact, appropriately scoped on technical detail, and flagged for legal review when security-relevant.

See `SKILL.md` for the full workflow.

## How to invoke

- "Write a customer-facing incident summary."
- "Draft a status page update for this incident."
- "Draft a customer notification about this outage."

## Example

### Input

Impact: checkout was unavailable for ~14 minutes for roughly 8% of transaction attempts. Cause: a software defect introduced in a routine deployment, not security-related. Resolution: rolled back within 14 minutes. Prevention: added test coverage for the specific scenario and an automated rollback process.

### Output (abbreviated)

> **Status Update — Checkout Service Disruption**
>
> Between [time] and [time] on [date], some customers experienced errors when completing checkout. We identified the cause — a defect introduced in a routine software update — and resolved it within 14 minutes by reverting the change.
>
> We've since added automated test coverage to catch this type of issue before it reaches production, and improved our rollback process to respond even faster if a similar issue occurs.
>
> We apologize for the inconvenience this may have caused.
>
> **Note**: not security-related, so no legal/compliance disclosure review flag needed here — if the underlying cause had involved unauthorized access or data exposure, this draft would need legal/security review before publishing, and the cause statement would need more careful scoping.

This example is illustrative — a real draft depends entirely on the actual incident impact and cause, and must be reviewed against your organization's disclosure policies before publishing.
