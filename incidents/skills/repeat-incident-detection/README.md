# Repeat Incident Detection

Detects whether a current incident is a near-duplicate of a previous one — matching root cause, not just surface symptom — and checks whether a prior action item should have prevented it.

See `SKILL.md` for the full workflow.

## How to invoke

- "Has this happened before?"
- "Is this a repeat of a previous incident?"
- "Check if this incident is a recurrence."

## Example

### Input

Current incident: checkout errors traced to a null-pointer exception from an untested edge-case input in pricing logic. Search finds a postmortem from 4 months ago: checkout errors from a similar untested edge case in the same pricing module, with an action item "add automated test coverage for pricing edge cases" marked done.

### Output (abbreviated)

> **Match found: Yes** — `[Confidence: Likely]`
>
> **Prior incident**: 4 months ago, checkout errors from an untested edge-case input in the same pricing module — the underlying mechanism (untested edge case reaching production in pricing logic) matches, not just the surface symptom (checkout errors).
>
> **Prior action item status**: "Add automated test coverage for pricing edge cases" was marked done — but this incident's root cause is the same class of gap recurring. **This is a more serious finding than a missing action item**: the prior fix was either scoped too narrowly (covered some edge cases but not this one) or the coverage regressed since being added. Recommend investigating what the prior test coverage actually covers before writing a new, potentially equally narrow, fix.
>
> **Recommendation**: rather than another single-input test addition, consider whether a more systemic approach (property-based testing, or a required review checklist for pricing-logic changes) is warranted, given this is now a second occurrence of the same category despite a prior "done" fix.

This example is illustrative — a real detection depends entirely on the actual incident history and root cause data available.
