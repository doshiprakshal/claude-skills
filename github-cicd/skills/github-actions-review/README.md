# GitHub Actions Review

Reviews GitHub Actions workflow files — GITHUB_TOKEN permission scope, third-party action pinning, secrets exposure to untrusted PR runs, caching effectiveness, and matrix strategy efficiency.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our GitHub Actions workflows."
- "Is our GitHub Actions permissions too broad?"
- "Should we pin our actions to a SHA?"

## Example

### Input

```yaml
on:
  pull_request_target:
    types: [opened, synchronize]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          ref: ${{ github.event.pull_request.head.sha }}   # checks out the fork PR's code
      - run: npm install && npm test   # runs untrusted code
        env:
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}   # with secrets available
```

### Output (abbreviated)

> **Findings**
>
> - **`pull_request_target` running untrusted fork code with secrets exposed** — `[Blocker]` — this workflow triggers on `pull_request_target` (which grants access to repository secrets even for PRs from forks), checks out the fork's own commit, and then runs `npm install && npm test` — executing the fork's code with `NPM_TOKEN` available in the environment. A malicious fork PR could add a `postinstall` script (or modify test files) to exfiltrate `NPM_TOKEN` directly. This is a well-known, actively exploited GitHub Actions attack pattern.
>
> **Recommended fix**
> Switch to the regular `pull_request` trigger (which does not expose secrets to fork PRs) unless there's a specific need for `pull_request_target`'s elevated context (e.g., commenting on the PR) — in which case, split into two workflows: an untrusted `pull_request`-triggered job with no secrets that does the actual test run, and a separate, minimal `pull_request_target`-triggered job (with no code checkout from the fork) that only handles the trusted action (e.g., posting a comment) using the results as an artifact.
>
> **Overall verdict**
> This single finding is a critical, actively exploitable secret-exfiltration path — treat as the top priority regardless of any other findings in this repo.

This example is illustrative — a real review depends entirely on the actual workflow files discovered for the target repository.
