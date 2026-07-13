---
name: production-review
description: Review a Terraform configuration for production readiness — remote state backend with locking, provider version pinning, tagging/labeling standards, workspace/environment separation, and destroy-protection on critical resources. Triggers on "is this terraform config production ready", "terraform production readiness review", "review our terraform setup for prod".
user-invocable: true
---

# Terraform Production Review

Review a Terraform configuration's production readiness from the state-management and operational-safety angle — not whether the underlying cloud architecture is sound (`architecture-review`), but whether this configuration is safe to operate as the source of truth for production infrastructure.

## When to use

- Before a Terraform configuration first manages production infrastructure.
- The user asks whether their Terraform setup is production-ready.

**Out of scope**:
- Cloud architecture/topology soundness → `architecture-review`
- Security posture of the resources themselves → `security-audit`/`iam-review`
- Cost → `cost-optimization`

## Inputs

- Backend configuration (`backend` block or `.tfbackend` file).
- Provider version constraints (`required_providers`).
- Workspace/environment structure (Terraform workspaces, separate state files per environment, or a directory-per-environment pattern).
- Tagging/labeling conventions used across resources.
- `lifecycle` blocks on stateful/critical resources.

## Workflow

### 1. Discover

Gather backend config, provider constraints, workspace/environment structure, and tagging conventions across the configuration.

### 2. Checks

- **Remote state with locking** — state is stored remotely (S3+DynamoDB, Terraform Cloud, GCS, Azure Storage, etc.), not local state files, and the backend supports/enables locking to prevent concurrent-apply corruption.
- **Provider version pinning** — `required_providers` pins to a specific version or a deliberately scoped range, not left unconstrained (an unconstrained provider can introduce breaking changes on a routine `terraform init` with no warning).
- **Terraform core version constraint** — `required_version` set, so the config doesn't silently behave differently across team members' or CI's Terraform versions.
- **Environment separation** — production and non-production infrastructure are isolated (separate state files/workspaces/accounts), not sharing one state file where a mistake in dev tooling could touch prod resources.
- **Destroy protection** — critical stateful resources (databases, critical storage) have `lifecycle { prevent_destroy = true }` or equivalent, so an accidental `terraform destroy`/resource removal from config doesn't silently delete something unrecoverable.
- **Tagging/labeling standard** — consistent tags applied across resources (via a shared `default_tags` provider setting or a common local, not ad hoc per-resource) — needed for cost allocation, ownership, and compliance tracking.
- **CI/CD apply safety** — if applies run via CI, confirm plan output is reviewed before apply (not auto-applying on every merge without a review gate) for anything touching production.

### 3. Report

Findings grouped by State Management, Provider Pinning, Environment Separation, Destroy Protection, Tagging, CI/CD Safety, each with severity and fix. One overall production-readiness verdict.

## Notes

- Local state for anything beyond a personal sandbox is close to an automatic Blocker — it has no locking, no team visibility, and is a single point of loss.
- `prevent_destroy` findings should specifically target genuinely critical/stateful resources — applying it everywhere makes legitimate infrastructure changes unnecessarily painful.
