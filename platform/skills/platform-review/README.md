# Platform Review

Reviews an internal platform holistically — capability breadth, adoption, consistency, and support model — as a top-level entry point routing to deeper skills.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our internal platform."
- "Assess our platform engineering setup."
- "What's the state of our internal platform?"

## Example

### Input

Platform team provides a Backstage-based service catalog, a Terraform-module-based provisioning system, and a golden-path CI/CD template. Investigation shows only 40% of product teams use the golden-path CI/CD template; the rest maintain custom pipelines built before the platform team existed. No formal process exists for requesting new platform features — requests happen ad hoc in Slack DMs to individual platform engineers.

### Output (abbreviated)

> **Capability map**: Provisioning (Terraform modules, in use), Service Catalog (Backstage, in use), CI/CD golden path (exists, 40% adoption).
>
> **Findings**
>
> - **Low golden-path CI/CD adoption (40%)** — `[High]` — most teams maintain pre-platform custom pipelines rather than migrating; this fragments support burden and undermines the consistency the platform is meant to provide. Recommend `developer-experience-audit` to understand specifically why teams haven't migrated — likely either a migration-effort barrier or a genuine capability gap in the golden path.
> - **No formal feature-request process** — `[Medium]` — ad hoc Slack requests make prioritization opaque and create bus-factor risk around specific platform engineers. Recommend establishing a lightweight, visible request/prioritization process.
>
> **Overall verdict**: the platform has reasonable capability breadth but a significant adoption gap on its most central offering (CI/CD). Recommend `developer-experience-audit` as the next step before investing further in new capabilities — understanding the adoption barrier is higher-leverage than adding more platform surface right now.

This example is illustrative — a real review depends entirely on the actual platform capabilities and adoption discovered.
