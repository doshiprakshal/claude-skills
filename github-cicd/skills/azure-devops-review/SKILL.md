---
name: azure-devops-review
description: Review Azure Pipelines YAML — stage/job structure, service connection security scope, variable group/secret handling, and template trust. Triggers on "review our azure pipelines yaml", "azure devops pipeline review", "is our service connection scope too broad", "azure devops variable group security".
user-invocable: true
---

# Azure DevOps Review

Review Azure Pipelines configuration for structural correctness and security.

## When to use

- Reviewing an Azure Pipelines YAML before or after adoption.
- The user asks about service connection scope or variable group secret handling.

**Out of scope**:
- Broader multi-tool pipeline security patterns → `pipeline-security`
- Mechanical secret scanning → `secrets-review`

## Inputs

- Azure Pipelines YAML (`azure-pipelines.yml` and any templates it references).
- Service connection configuration and their scope (which subscriptions/resource groups they can access).
- Variable groups and their secret/non-secret variables.

## Workflow

### 1. Discover

Gather the pipeline YAML, referenced templates, service connections, and variable groups.

### 2. Checks

- **Service connection scope** — connections scoped to the specific subscription/resource group a pipeline actually needs, not a broad connection with organization-wide access used for a narrow task.
- **Variable group secret handling** — sensitive values marked as secret variables (masked in logs), not plain variables holding credential-shaped values.
- **Stage/job dependency structure** — `dependsOn` used correctly so stages run in the right order without unnecessary serialization of independent work.
- **Template trust** — templates referenced from other repositories (`resources: repositories:`) come from a trusted source, since a compromised template repo can inject arbitrary pipeline behavior.
- **Approval gates** — production-deploying stages have manual approval checks configured, not auto-deploying without a review gate.
- **Fork/external contributor PR triggers** — if the pipeline builds PRs from forks, confirm variable groups with secrets aren't accessible to those builds by default.

### 3. Report

Findings grouped by Service Connection Scope, Variable Secrets, Stage Dependencies, Template Trust, Approval Gates, Fork PR Safety, each with severity and fix.

## Notes

- An overly broad service connection is a common, easy-to-miss gap — check the connection's actual granted scope in Azure, not just how it's referenced in the pipeline YAML.
- Missing approval gates before production deployment stages is a real operational-safety gap, not just a process nicety.
