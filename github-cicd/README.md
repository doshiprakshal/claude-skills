# GitHub & CI/CD Skills

Planned: 20 skills. 20 built so far.

Each skill lives in its own subfolder under [`skills/`](./skills) with a `SKILL.md` (instructions Claude follows when the skill runs) and a `README.md` (what it does, how to invoke it, and a worked example).

## Built

| Skill | What it does |
|---|---|
| [`pull-request-review`](./skills/pull-request-review) | PR process/mergeability quality — size, description, test evidence, CI status. |
| [`github-actions-review`](./skills/github-actions-review) | Token permissions, action pinning, fork-PR secret exposure, caching, matrix efficiency. |
| [`jenkins-review`](./skills/jenkins-review) | Credential handling, script security, plugin currency, agent allocation. |
| [`gitlab-ci-review`](./skills/gitlab-ci-review) | Rules correctness, caching, job dependencies, runner targeting, variable protection. |
| [`azure-devops-review`](./skills/azure-devops-review) | Service connection scope, variable secrets, template trust, approval gates. |
| [`circleci-review`](./skills/circleci-review) | Orb pinning/trust, workflow structure, caching, resource class sizing. |
| [`argocd-review`](./skills/argocd-review) | Auto-sync/prune safety, sync ordering, AppProject scoping, RBAC, self-heal implications. |
| [`spinnaker-review`](./skills/spinnaker-review) | Deployment strategy fit, judgment gate placement, automated canary analysis, rollback. |
| [`deployment-failure-investigation`](./skills/deployment-failure-investigation) | Diagnoses a specific failed pipeline run — build vs. test vs. deploy-step failure. |
| [`release-readiness`](./skills/release-readiness) | Pre-release checklist — tests, migrations, feature flags, changelog, rollback plan. |
| [`rollback-readiness`](./skills/rollback-readiness) | Whether a rollback path actually exists and would work — tool-agnostic. |
| [`build-performance`](./skills/build-performance) | Data-backed CI speed analysis — slow steps, caching gaps, parallelization. |
| [`pipeline-security`](./skills/pipeline-security) | Cross-tool security — least-privilege identities, untrusted-code risk, artifact integrity. |
| [`secrets-review`](./skills/secrets-review) | Mechanical scan for hardcoded/log-exposed secrets and overly broad secret scope. |
| [`branch-strategy-review`](./skills/branch-strategy-review) | Branch protection adequacy and strategy fit for team size/cadence. |
| [`changelog-generator`](./skills/changelog-generator) | Categorized technical changelog from commit/PR history between two refs. |
| [`release-notes-generator`](./skills/release-notes-generator) | Curated, audience-facing release notes translated from a changelog. |
| [`documentation-review`](./skills/documentation-review) | Whether repo docs/runbooks are complete and current relative to the codebase. |
| [`workflow-optimization`](./skills/workflow-optimization) | Structural simplification — redundant jobs, duplicate logic, consolidation. |
| [`pipeline-migration`](./skills/pipeline-migration) | Plans a CI/CD tool migration — concept mapping, gaps, sequenced cutover. |
