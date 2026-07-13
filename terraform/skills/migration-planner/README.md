# Terraform Migration Planner

Plans a large structural Terraform migration — moving infrastructure between cloud providers, regions, accounts, or restructuring state/module boundaries — producing a sequenced, risk-aware plan.

See `SKILL.md` for the full workflow.

## How to invoke

- "Plan our migration to a new AWS account."
- "Help us migrate this Terraform to another region."
- "Restructure our Terraform state."

## Example

### Input

Migrating a production stack (app tier, RDS database, S3 bucket) from AWS account A to a newly created account B, as part of an account-isolation initiative. Acceptable downtime: a 30-minute maintenance window.

### Output (abbreviated)

> **Migration inventory**
>
> | Resource | Migration mechanism |
> |---|---|
> | App tier (stateless, ASG-managed) | Recreate in account B from the same Terraform config, pointed at a new provider alias/account |
> | RDS database | Cannot move directly across accounts — requires snapshot in account A, share snapshot with account B, restore from shared snapshot |
> | S3 bucket | Cannot move directly across accounts — requires `aws s3 sync` (or cross-account replication) to a new bucket in account B, then cutover |
>
> **Sequenced plan**
> 1. Set up account B's baseline (networking, IAM) via Terraform, targeting the new account — no production impact yet.
> 2. Create the RDS snapshot in account A, share with account B, restore into a new RDS instance in account B. Validate the restored data. (No downtime yet — old instance still serving traffic.)
> 3. Sync the S3 bucket to the new account B bucket; set up ongoing replication so it stays current until cutover. (No downtime.)
> 4. **Maintenance window begins**: stop writes to the account-A app tier, do a final S3 sync/RDS snapshot delta to catch anything since step 2/3, deploy the app tier in account B pointed at the new RDS/S3 resources, cut DNS/traffic over.
> 5. Validate account B is serving correctly; keep account A's resources intact but stopped for a rollback window (e.g., 24-48 hours) before decommissioning.
>
> **Risk callouts**
> The RDS restore (step 2) is the highest-risk step — validate the restored data thoroughly before proceeding, since this is the one step that can't be easily undone once account A's instance is decommissioned. Keep account A's database running (read-only or stopped, not deleted) until account B has been validated in production for a reasonable burn-in period.

This example is illustrative — a real plan depends entirely on the actual infrastructure and constraints for the target migration.
