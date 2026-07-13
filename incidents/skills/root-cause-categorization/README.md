# Root Cause Categorization

Categorizes an incident's root cause against a consistent taxonomy — primary and contributing categories — to enable aggregate reporting across incidents.

See `SKILL.md` for the full workflow.

## How to invoke

- "Categorize this incident's root cause."
- "Tag this postmortem with a root cause category."
- "Classify this incident for our reporting taxonomy."

## Example

### Input

Root cause: a deploy introduced a defect that wasn't caught by tests. Contributing factor: the alert threshold was tuned too high, delaying detection by several minutes.

### Output (abbreviated)

> **Primary category**: Deploy/Config Change — the trigger was a code deployment introducing the defect.
>
> **Contributing category**: Human Process Gap — the underlying reason the defect reached production (no test coverage for this input) and the delayed detection (alert threshold not tuned appropriately) are both process gaps, tagged as a secondary contributing category.
>
> **Justification**: while the proximate trigger is a deploy, the taxonomy's "Deploy/Config Change" category is reserved for cases where the deploy mechanism itself is implicated (e.g., a bad rollout process); here the deploy was procedurally normal, and the actual gap was insufficient pre-deploy validation — categorized primary as Deploy/Config Change (trigger-level, for aggregate "what kind of event usually starts our incidents" reporting) with Human Process Gap as a contributing tag (for "what underlying gap usually enables our incidents" reporting). Both views are useful depending on the aggregate question being asked.

This example is illustrative — a real categorization depends entirely on the actual root cause and the organization's specific taxonomy.
