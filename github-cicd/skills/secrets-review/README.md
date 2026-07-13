# CI/CD Secrets Review

A mechanical scan of CI/CD configuration and logs for hardcoded secrets, secrets echoed into logs, and overly broad secret scope across jobs/environments.

See `SKILL.md` for the full workflow.

## How to invoke

- "Scan our pipeline for exposed secrets."
- "Are secrets leaking into CI logs?"
- "Check our pipeline for hardcoded credentials."

## Example

### Input

```yaml
jobs:
  deploy:
    steps:
      - run: echo "Deploying with token $DEPLOY_TOKEN"   # echoes the secret into logs
      - run: curl -H "Authorization: Bearer ${{ secrets.DEPLOY_TOKEN }}" https://api.example.com/deploy
```

`DEPLOY_TOKEN` is a repository-level secret available to every job in every workflow, including one triggered by `pull_request` from forks.

### Output (abbreviated)

> **Per-finding table**
>
> | Location | Finding | Severity |
> |---|---|---|
> | `deploy` job, first step | `echo` command prints `$DEPLOY_TOKEN` directly into job logs | Error |
> | Repository secret scope | `DEPLOY_TOKEN` available to all workflows, including fork-triggered `pull_request` runs | Error |
>
> **Recommended fix**
> - Remove the `echo` statement entirely — it serves no functional purpose and exposes the token in plaintext in every build log. **Treat this token as already compromised** if this workflow has run even once with this line present — logs are typically retained and viewable by anyone with repo access. Rotate `DEPLOY_TOKEN` immediately.
> - Scope the secret to only the specific workflow/job that needs it (via environment-level secrets tied to a protected deployment environment), and confirm it's not accessible to `pull_request`-triggered runs from forks.
>
> **Overall verdict**
> Both findings point to the same secret being actively compromised (log exposure) and overly broadly scoped. Rotate the token now, fix the logging, and narrow the scope before considering this resolved.

This example is illustrative — a real scan depends entirely on the actual pipeline configuration and logs discovered for the target project. If any values in your real pipeline resemble this example and are genuine credentials, rotate them immediately regardless of what this report says.
