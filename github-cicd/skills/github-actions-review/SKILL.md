---
name: github-actions-review
description: Review GitHub Actions workflow files — GITHUB_TOKEN permission scope, third-party action pinning (SHA vs. floating tag), secrets exposure to untrusted PR runs, caching effectiveness, and matrix strategy efficiency. Triggers on "review our github actions workflows", "is our github actions permissions too broad", "should we pin our actions to a sha", "github actions security review".
user-invocable: true
---

# GitHub Actions Review

Review GitHub Actions workflow YAML for security and efficiency.

## When to use

- Reviewing workflows before or after adoption.
- The user asks about token permissions, action pinning, or secrets exposure on PR workflows.

**Out of scope**:
- Broader CI/CD pipeline security patterns across tools → `pipeline-security`
- Mechanical secret scanning in workflow files → `secrets-review`

## Inputs

- All `.github/workflows/*.yml` files.
- Repository/organization-level default `GITHUB_TOKEN` permission settings.

## Workflow

### 1. Discover

Gather every workflow file and the repo's default token permission setting.

### 2. Checks

- **`GITHUB_TOKEN` permission scope** — workflows declare explicit, minimal `permissions` rather than relying on the (historically broad) default, and definitely don't request `write-all` unless genuinely needed.
- **Third-party action pinning** — actions pinned to a full commit SHA, not a floating tag (`@v3`) or branch (`@main`) — a floating reference can be repointed by the action's maintainer (or an attacker who compromises their account) to malicious code with no corresponding change in your repo.
- **Secrets exposure on `pull_request_target`/fork PR workflows** — workflows triggered by `pull_request_target` (which runs with access to secrets even for fork PRs) checking out and executing the PR's own code — this is a well-known injection vector where a malicious fork PR can exfiltrate secrets. Flag any workflow combining `pull_request_target` with checking out `github.event.pull_request.head.sha` and running untrusted code from it.
- **Caching effectiveness** — dependency caching (`actions/cache` or built-in package-manager caching) used where it would meaningfully speed up builds.
- **Matrix strategy efficiency** — matrix builds sized sensibly (not testing every combination of OS × version when only a subset is actually needed), and `fail-fast` behavior set intentionally.
- **Concurrency control** — `concurrency` groups used to cancel superseded runs on the same branch/PR, avoiding wasted compute on outdated pushes.

### 3. Report

Findings grouped by Token Permissions, Action Pinning, Fork PR Secret Exposure, Caching, Matrix Efficiency, Concurrency, each with severity and fix.

## Notes

- The `pull_request_target` + untrusted-checkout combination is one of the most serious, well-documented GitHub Actions security issues — treat any instance as Blocker severity, not just a code smell.
- Floating action tags are a real supply-chain risk, not just a style preference — recommend SHA pinning plus Dependabot/Renovate to keep pinned SHAs updated deliberately.
