# Helm Skills

Planned: 15 skills. 15 built so far.

Each skill lives in its own subfolder here with a `SKILL.md` (instructions Claude follows when the skill runs) and a `README.md` (what it does, how to invoke it, and a worked example).

## Built

| Skill | What it does |
|---|---|
| [`production-review`](./production-review) | Helm-packaging production readiness — values file separation, secrets not in values, hook safety, dependency pinning. |
| [`values-review`](./values-review) | values.yaml/values.schema.json design quality — structure, defaults, naming, documentation. |
| [`chart-best-practices`](./chart-best-practices) | Chart authoring conventions — Chart.yaml completeness, helper usage, labels, versioning. |
| [`upgrade-risk-analysis`](./upgrade-risk-analysis) | Risk of a planned helm upgrade — StatefulSet-breaking changes, unmanaged CRD changes, values schema breaks. |
| [`template-debugger`](./template-debugger) | Diagnoses helm template rendering failures — nil pointers, indentation, scope, type mismatches. |
| [`dependency-review`](./dependency-review) | Subchart dependency pinning, Chart.lock hygiene, stale overrides, redundant dependencies. |
| [`security-review`](./security-review) | Chart packaging/supply-chain security — secrets in values, provenance/signing, hook RBAC. |
| [`version-compatibility`](./version-compatibility) | Checks a chart's compatibility with a target Kubernetes cluster version. |
| [`rollback-planner`](./rollback-planner) | Plans a safe helm rollback — CRD non-reversion, hook behavior, stateful data risk. |
| [`release-comparison`](./release-comparison) | Diffs two releases/revisions — categorized manifest and values diff. |
| [`values-migration`](./values-migration) | Migrates values.yaml to a new chart version's schema — key mapping, removed/new keys. |
| [`helmfile-review`](./helmfile-review) | Reviews Helmfile release ordering, environments, secrets handling, DRY-ness, sync safety. |
| [`chart-optimization`](./chart-optimization) | Chart engineering quality — template complexity, redundancy, bloat, values sprawl. |
| [`lint-assistant`](./lint-assistant) | Runs/interprets helm lint plus unused values/helpers and YAML type-coercion checks. |
| [`documentation-generator`](./documentation-generator) | Generates a chart README with a values reference table. |
