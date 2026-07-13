# Azure DevOps Review

Reviews Azure Pipelines YAML — stage/job structure, service connection security scope, variable group/secret handling, and template trust.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our Azure Pipelines YAML."
- "Azure DevOps pipeline review."
- "Is our service connection scope too broad?"

## Example

### Input

`azure-pipelines.yml` deploys to a single resource group `rg-app-prod` using service connection `sc-org-admin`, which is scoped to the entire Azure subscription (not just `rg-app-prod`). No approval check configured before the deploy stage runs.

### Output (abbreviated)

> **Findings**
>
> - **Service connection scoped to the entire subscription for a single-resource-group deploy** — `[High]` — `sc-org-admin` can act across the whole subscription, but this pipeline only ever deploys to `rg-app-prod`. If the pipeline (or its YAML) is ever compromised, the blast radius is the entire subscription, not just the one resource group it actually needs. Create a narrower service connection scoped to `rg-app-prod` only.
> - **No approval gate before production deploy** — `[High]` — the deploy stage runs automatically with no manual approval check. Any merge to the triggering branch immediately deploys to production with no human review point. Add an approval check on the production deployment stage.
>
> **Overall verdict**
> Both findings represent real operational/security exposure — the overscoped service connection increases blast radius if anything goes wrong, and the missing approval gate means there's no human checkpoint before production changes. Address both before relying on this pipeline for production releases.

This example is illustrative — a real review depends entirely on the actual pipeline configuration discovered for the target project.
