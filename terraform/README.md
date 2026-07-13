# Terraform Skills

Planned: 20 skills. 20 built so far.

Each skill lives in its own subfolder under [`skills/`](./skills) with a `SKILL.md` (instructions Claude follows when the skill runs) and a `README.md` (what it does, how to invoke it, and a worked example).

## Built

| Skill | What it does |
|---|---|
| [`production-review`](./skills/production-review) | State backend, locking, provider pinning, environment separation, and destroy-protection — packaging/operational readiness. |
| [`security-audit`](./skills/security-audit) | Network exposure, encryption, and logging/audit-trail gaps, prioritized by real exploitability. |
| [`cost-optimization`](./skills/cost-optimization) | Instance sizing, commitment mix, orphaned resources, and storage tiering, with estimated savings. |
| [`drift-analysis`](./skills/drift-analysis) | Detects and diagnoses drift between state and live infrastructure, recommending reconciliation. |
| [`state-analysis`](./skills/state-analysis) | State file health — orphaned entries, bloat, sensitive data exposure, backend config. |
| [`module-review`](./skills/module-review) | Reusable module design — interface clarity, composability, hardcoding, versioning. |
| [`variable-review`](./skills/variable-review) | variables.tf design — types, validation, defaults, sensitive flagging, documentation. |
| [`naming-review`](./skills/naming-review) | Resource/variable naming consistency, provider naming constraints, tagging standards. |
| [`secret-detection`](./skills/secret-detection) | Deterministic scan for hardcoded credentials in .tf/.tfvars/state. |
| [`iam-review`](./skills/iam-review) | Deep dive on IAM policies, trust relationships, cross-account access, unused roles. |
| [`multi-cloud-review`](./skills/multi-cloud-review) | Consistency and abstraction fit across multiple cloud providers in one codebase. |
| [`architecture-review`](./skills/architecture-review) | Network topology, account/project structure, and multi-region strategy vs. stated requirements. |
| [`performance-review`](./skills/performance-review) | Sizing, autoscaling/read-replica gaps, and topology-induced latency. |
| [`change-risk-assessment`](./skills/change-risk-assessment) | Risk of a specific terraform plan before apply — destructive changes, blast radius. |
| [`migration-planner`](./skills/migration-planner) | Sequenced plan for large structural migrations (cross-account/region/provider). |
| [`upgrade-planner`](./skills/upgrade-planner) | Terraform core/provider version upgrade breaking changes and sequencing. |
| [`compliance-review`](./skills/compliance-review) | Maps infrastructure config to a named compliance framework's controls (SOC2/HIPAA/PCI/CIS). |
| [`policy-review`](./skills/policy-review) | Reviews Sentinel/OPA/Checkov policy-as-code coverage, correctness, and enforcement level. |
| [`documentation-generator`](./skills/documentation-generator) | Generates a module README with inputs/outputs tables from variables.tf/outputs.tf. |
| [`refactoring-assistant`](./skills/refactoring-assistant) | Helps restructure/migrate Terraform code while preserving state addresses via moved blocks. |
