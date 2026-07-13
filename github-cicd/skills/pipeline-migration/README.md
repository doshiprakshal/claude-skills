# Pipeline Migration

Plans migrating a CI/CD pipeline from one tool to another — mapping concepts between tools, identifying feature gaps, and producing a sequenced, risk-aware migration plan.

See `SKILL.md` for the full workflow.

## How to invoke

- "Help us migrate from Jenkins to GitHub Actions."
- "Plan our CI/CD tool migration."
- "Migrate our GitLab CI to CircleCI."

## Example

### Input

Migrating from Jenkins to GitHub Actions. Current Jenkinsfile uses: a Jenkins Shared Library for common deploy logic, the Credentials plugin for AWS access (static keys), and a specific "Approval" plugin for manual gates before production deploy.

### Output (abbreviated)

> **Concept mapping table**
>
> | Jenkins | GitHub Actions equivalent |
> |---|---|
> | Jenkinsfile stages | Jobs/steps in a workflow YAML |
> | Shared Library | Reusable workflow or composite action |
> | Credentials plugin (static AWS keys) | OIDC federation to AWS (recommended upgrade, not just a direct mapping — see gap below) |
> | Approval plugin (manual gate) | Environment protection rules with required reviewers |
>
> **Feature gaps**
> - Jenkins' static-credential-based AWS access has no *direct* equivalent, but GitHub Actions supports OIDC federation to AWS, which is actually a security improvement over static keys — recommend adopting this rather than replicating the static-key pattern, even though it's not a strict 1:1 mapping.
> - The Shared Library's exact Groovy logic will need to be rewritten as a reusable workflow/composite action in YAML — this isn't a mechanical translation and needs review of what the library actually does.
>
> **Sequenced migration plan**
> 1. Build the GitHub Actions equivalent workflow, including OIDC federation setup (new AWS IAM role/trust policy) and the reusable-workflow rewrite of the shared library logic.
> 2. Run both pipelines in parallel for 2-3 weeks: Jenkins remains authoritative for actual deploys, GitHub Actions runs on the same triggers but doesn't deploy — compare outputs/behavior.
> 3. Once validated, cut over: GitHub Actions becomes authoritative, Jenkins pipeline disabled (not deleted) for a rollback window.
> 4. After a confidence period (e.g., 30 days), decommission the Jenkins pipeline.
>
> **Overall verdict**
> The credential migration to OIDC is both a gap-fill and a security improvement — treat it as a deliberate upgrade, not just a like-for-like port. The shared library rewrite is the highest-effort, highest-review-need part of this migration.

This example is illustrative — a real plan depends entirely on the actual source pipeline configuration and target tool for the migration.
