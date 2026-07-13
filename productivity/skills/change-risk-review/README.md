# Change Risk Review

Assesses the risk of a proposed change generically — blast radius, reversibility, test coverage, and size/complexity — as a lightweight pre-merge/pre-deploy gate.

See `SKILL.md` for the full workflow.

## How to invoke

- "Assess the risk of this change before we merge it."
- "How risky is this pull request?"
- "Pre-deploy risk assessment for this change."

## Example

### Input

A pull request modifies the shared authentication middleware used by every service endpoint, changing how session tokens are validated. The change includes new unit tests for the modified logic but no integration tests. It's a moderately large diff (~200 lines) touching multiple related functions. The change is a straightforward code deploy (no data migration), revertible via a standard rollback.

### Output (abbreviated)

> **Risk assessment**
>
> - **Blast radius**: `[High]` — shared authentication middleware used by every endpoint means any regression affects the entire system, not an isolated feature.
> - **Reversibility**: `[Good]` — standard code deploy, revertible via normal rollback with no data migration or other one-way-door characteristics.
> - **Test coverage**: `[Flag]` — new unit tests exist for the modified logic, but no integration tests covering the actual end-to-end auth flow across real endpoints; unit tests alone may not catch an integration-level regression in something this cross-cutting.
> - **Size/complexity**: `[Moderate]` — ~200 lines touching multiple related functions is non-trivial to review thoroughly.
>
> **Overall risk level**: `[High]` — driven primarily by the blast radius (every endpoint) combined with the test coverage gap (no integration-level validation) for a change this cross-cutting.
>
> **Recommendation**: require a second reviewer with specific auth-flow expertise, and add integration test coverage before merging rather than relying on unit tests alone — given the high blast radius, the coverage gap is the main risk factor worth closing before this ships, even though it's easily revertible if something does go wrong.

This example is illustrative — a real assessment depends entirely on the actual change and its context.
