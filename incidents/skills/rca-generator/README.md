# RCA Generator

Generates a formal root cause analysis document — distinguishing trigger, root cause, and contributing factors — from investigation evidence.

See `SKILL.md` for the full workflow.

## How to invoke

- "Generate an RCA for this incident."
- "Write a root cause analysis document."
- "Draft the root cause analysis section of the postmortem."

## Example

### Input

Investigation findings: a deploy at 15:00 introduced a NullPointerException in the pricing path (confirmed root cause of the trigger). Detection took 4 minutes (alert threshold was set high). No automated test existed for the specific input combination that triggered the bug. Rollback took 12 minutes because the on-call engineer had to manually locate the previous known-good deploy artifact.

### Output (abbreviated)

> **Trigger**: The 15:00 deploy introduced a code change that threw a `NullPointerException` for a specific, previously untested input combination in the pricing calculation path.
>
> **Root cause**: No automated test covered this input combination, so the defect reached production undetected. The underlying systemic gap is insufficient test coverage for edge-case inputs in the pricing module specifically.
>
> **Contributing factors**:
> - Alert threshold was tuned high enough that detection took 4 minutes rather than near-immediate — worsened impact duration.
> - No documented/automated process for locating the previous known-good deploy artifact — added ~10 of the 12 minutes to rollback time.
>
> **Detection**: Alert fired 4 minutes after the exception spike began.
>
> **Resolution**: Manual rollback to the previous deploy, completed 12 minutes after alert.
>
> **Note**: root cause is intentionally framed as "insufficient test coverage" rather than "the deploy had a bug" — the former points to an actionable, preventive fix; the latter would only prevent this exact bug, not the class of bug.

This example is illustrative — a real RCA depends entirely on the actual investigation findings for the target incident.
