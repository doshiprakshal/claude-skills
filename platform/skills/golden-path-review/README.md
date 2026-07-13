# Golden Path Review

Reviews the design and content of a golden path — common-case coverage, opinionation/flexibility balance, currency, and update mechanism.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our golden path for creating a new service."
- "Is our paved-road workflow actually good?"
- "Assess whether our golden paths cover real use cases."

## Example

### Input

The "new service" golden path assumes a stateless HTTP service with a single Postgres database — this fits about 30% of actual new services; the other 70% need a queue consumer, multiple data stores, or a scheduled job pattern, none of which the golden path addresses, forcing those teams to build from scratch anyway. The golden path was last updated 18 months ago and still references a deprecated logging library that was replaced org-wide 8 months ago.

### Output (abbreviated)

> **Findings**
>
> - **Golden path covers only ~30% of real use cases** — `[High]` — the majority of new services need patterns (queue consumers, multi-datastore, scheduled jobs) the golden path doesn't address, meaning most teams get no benefit from it and build unguided from scratch anyway. Recommend expanding the golden path to cover the top 2-3 most common patterns explicitly, even if the fully-general case remains unsupported.
> - **Golden path references a deprecated logging library** — `[High]` — every team using the golden path since the org-wide migration 8 months ago has been onboarded onto a pattern that's already known to be wrong, actively propagating tech debt. Update immediately — this is a correctness bug in the golden path itself, not just a nice-to-have refresh.
> - **No visible update owner/process** — `[Medium]` — the staleness above suggests no one is actively responsible for keeping the golden path current; recommend assigning clear ownership with a review cadence.
>
> **Overall verdict**: the deprecated-library reference is the most urgent fix (actively propagating a known-wrong pattern); the coverage gap is the larger strategic issue and explains why golden-path adoption is likely low — see `developer-experience-audit` to confirm.

This example is illustrative — a real review depends entirely on the actual golden path content and real service patterns in the target organization.
