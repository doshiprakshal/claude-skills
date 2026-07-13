# Changelog Generator

Generates a technical changelog from commit history/PR titles between two refs, grouped by change type, for internal engineering consumption.

See `SKILL.md` for the full workflow.

## How to invoke

- "Generate a changelog between v2.3.0 and v2.4.0."
- "Create a changelog from our commits."
- "Changelog generator."

## Example

### Input

Commits between `v2.3.0` and `v2.4.0`, using conventional commit format:
```
feat(auth): add SSO login support
fix(api): correct pagination off-by-one error
feat!: remove deprecated /v1/users endpoint
chore: bump lodash to 4.17.21
docs: update API reference for pagination
```

### Output (abbreviated)

> **Generated changelog: v2.3.0 → v2.4.0**
>
> ```markdown
> ## Breaking Changes
> - Removed deprecated `/v1/users` endpoint (`feat!`)
>
> ## Features
> - Add SSO login support (`auth`)
>
> ## Fixes
> - Correct pagination off-by-one error (`api`)
>
> ## Documentation
> - Update API reference for pagination
>
> ## Chores
> - Bump lodash to 4.17.21
> ```
>
> **Categorization notes**
> All 5 commits used conventional commit prefixes, so categorization is high-confidence — no inferred/ambiguous items in this range.

This example is illustrative — a real changelog depends entirely on the actual commit/PR history discovered between the target refs.
