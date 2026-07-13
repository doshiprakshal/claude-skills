# GitLab CI Review

Reviews `.gitlab-ci.yml` — stage/job structure, caching configuration, rules/only-except correctness, runner tag targeting, and protected-variable scope.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our GitLab CI config."
- "Are our GitLab CI rules correct?"
- "GitLab runner security review."

## Example

### Input

```yaml
deploy_prod:
  stage: deploy
  script:
    - ./deploy.sh
  rules:
    - if: '$CI_COMMIT_BRANCH == "main"'
  variables:
    DEPLOY_TOKEN: $PROD_DEPLOY_TOKEN
```

`PROD_DEPLOY_TOKEN` is a project CI/CD variable that is **not** marked "Protected" — meaning it's available to pipelines on any branch, not just `main`, even though this specific job only runs on `main`. Merge request pipelines from forks are enabled for this project.

### Output (abbreviated)

> **Findings**
>
> - **`PROD_DEPLOY_TOKEN` is not a protected variable** — `[High]` — although `deploy_prod` itself only runs on `main`, an unprotected variable is available to *any* pipeline in the project, including merge request pipelines from forks (if fork MR pipelines are enabled, as they are here). Another job or a malicious fork MR could reference `$PROD_DEPLOY_TOKEN` directly and exfiltrate it, even though it was only intended for the production deploy job. Mark it "Protected" so it's only available on protected branches (`main`), and confirm `main` itself is a protected branch.
>
> **Recommended fix**
> Mark `PROD_DEPLOY_TOKEN` as Protected and Masked in project CI/CD variable settings. Verify `main` is configured as a protected branch so the "Protected" flag actually restricts it as intended.
>
> **Overall verdict**
> This is a real, exploitable secret-exposure gap — the job-level `rules:` restriction gives a false sense of security since the variable itself isn't actually scoped. Fix the variable protection setting immediately.

This example is illustrative — a real review depends entirely on the actual GitLab CI configuration discovered for the target project.
