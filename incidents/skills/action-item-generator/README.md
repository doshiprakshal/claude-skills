# Action Item Generator

Generates concrete, verifiable, owned action items from a postmortem's root cause and contributing factors, distinguishing preventive fixes from detection/response improvements.

See `SKILL.md` for the full workflow.

## How to invoke

- "Generate action items for this postmortem."
- "Turn these findings into action items."
- "Draft concrete action items with owners for this RCA."

## Example

### Input

Root cause: no automated test covered a specific edge-case input in the pricing module. Contributing factor 1: alert threshold was tuned high, delaying detection by 4 minutes. Contributing factor 2: rollback took 12 minutes due to a manual, undocumented process for locating the previous deploy artifact.

### Output (abbreviated)

> | Action | Owner | Priority | Type | Verifiable outcome |
> |---|---|---|---|---|
> | Add automated test coverage for the specific edge-case input that caused the defect | @pricing-team | High | Preventive | New test exists and fails on the pre-fix code, passes on the fix |
> | Lower the checkout error-rate alert threshold to detect within 1 minute of onset | @checkout-team | Medium | Detection | Alert fires within 1 min in a simulated test of the same error pattern |
> | Automate rollback-artifact lookup (script or CI job to find/deploy previous known-good build) | @platform-team | Medium | Response | Rollback can be triggered via a single command/click, no manual artifact lookup needed |
>
> **Flagged**: a suggestion in the original discussion to "rearchitect the pricing module to prevent this class of bug entirely" is scope-flagged — this is a multi-quarter initiative, not a postmortem action item; recommend tracking it separately as a proposed initiative rather than listing it here, where it would likely never get closed.

This example is illustrative — a real action item list depends entirely on the actual root cause and contributing factors from the target postmortem.
