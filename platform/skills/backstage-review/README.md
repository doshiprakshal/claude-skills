# Backstage Review

Reviews a Backstage instance's configuration — catalog entity consistency, ownership accuracy, plugin fit, TechDocs coverage, and template quality.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our Backstage setup."
- "Why is our Backstage catalog so messy?"
- "Audit our Backstage plugin configuration."

## Example

### Input

`catalog-info.yaml` files exist for most services but with inconsistent fields — some specify `owner` as a team name, others as an individual's username, others omit it entirely. TechDocs is enabled but only 15 of 60 cataloged services have actual documentation pages; the rest show a default "no docs found" page. 8 plugins are installed; usage analytics show 3 have had zero interactions in the last quarter.

### Output (abbreviated)

> **Findings**
>
> - **Inconsistent ownership metadata** — `[High]` — mixing team names, individual usernames, and omitted `owner` fields breaks any tooling or process that depends on ownership (routing questions, ownership-based access, on-call mapping). Standardize on team-based ownership and add a CI validation step rejecting non-conformant `catalog-info.yaml` files.
> - **TechDocs coverage is 25% (15 of 60 services)** — `[High]` — the remaining 45 services' catalog entries actively mislead engineers into believing docs don't exist for the service, which is worse than the catalog entry not existing at all. Prioritize closing this gap, starting with the most-visited/most-critical services.
> - **3 of 8 plugins unused last quarter** — `[Advisory]` — candidates for removal to reduce maintenance surface; confirm with the teams who requested them before removing.
>
> **Overall verdict**: the ownership inconsistency should be fixed first since it's foundational to several other catalog-dependent workflows; the TechDocs gap is the most visible and trust-eroding issue and should follow closely behind.

This example is illustrative — a real review depends entirely on the actual Backstage configuration discovered.
