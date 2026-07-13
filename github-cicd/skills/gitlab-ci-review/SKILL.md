---
name: gitlab-ci-review
description: Review .gitlab-ci.yml — stage/job structure, caching configuration, rules/only-except correctness, runner tag targeting, and protected-variable scope. Triggers on "review our gitlab ci config", "gitlab ci pipeline review", "are our gitlab ci rules correct", "gitlab runner security review".
user-invocable: true
---

# GitLab CI Review

Review `.gitlab-ci.yml` for structural correctness, caching effectiveness, and runner/variable security.

## When to use

- Reviewing a GitLab CI configuration before or after adoption.
- The user asks whether `rules`/`only`/`except` conditions are correct, or wants runner security reviewed.

**Out of scope**:
- Broader multi-tool pipeline security patterns → `pipeline-security`
- Mechanical secret scanning → `secrets-review`

## Inputs

- `.gitlab-ci.yml` (and any included/templated CI files via `include:`).
- Protected variable/branch/tag configuration.
- Runner tags and their availability (shared vs. project-specific runners).

## Workflow

### 1. Discover

Gather the CI config (including all `include:`-referenced files) and project-level CI/CD variable settings.

### 2. Checks

- **`rules`/`only`/`except` correctness** — conditions actually match intended trigger scenarios; a common bug is a `rules` block that unintentionally excludes the default branch or always evaluates true/false due to operator precedence mistakes.
- **Caching configuration** — `cache:` keys scoped appropriately (per-branch vs. shared) and actually reducing redundant work (dependency installs) across pipeline runs.
- **Stage/job dependency structure** — `needs:` used to allow jobs to run as soon as their actual dependencies finish, rather than everything waiting on stage boundaries unnecessarily.
- **Runner tag targeting** — jobs requiring specific capabilities (e.g., Docker-in-Docker, a specific OS) are tagged to run only on runners that actually support them, not left to land on an incompatible shared runner.
- **Protected variable scope** — CI/CD variables holding secrets are marked "Protected" (only available on protected branches/tags) and "Masked" (hidden in job logs), and not exposed to merge request pipelines from forks unless deliberately intended.
- **`include:` trust** — external CI templates included from other projects/remote URLs are from a trusted source, since an included file can inject arbitrary pipeline behavior.

### 3. Report

Findings grouped by Rules Correctness, Caching, Job Dependencies, Runner Targeting, Variable Protection, Include Trust, each with severity and fix.

## Notes

- Unprotected, unmasked CI/CD variables holding real secrets are a common GitLab CI gap — check both flags explicitly for anything secret-shaped.
- `rules:` logic bugs are easy to introduce and easy to miss by inspection alone — trace through what would actually trigger for the default branch, a feature branch, and an MR pipeline specifically.
