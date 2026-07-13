# CircleCI Review

Reviews `.circleci/config.yml` — orb version pinning and trust, workflow/job structure, caching effectiveness, and resource class sizing.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our CircleCI config."
- "Should we pin our CircleCI orbs?"
- "CircleCI resource class review."

## Example

### Input

```yaml
orbs:
  deploy-helper: some-random-user/deploy-helper@volatile   # unverified third-party orb, floating tag

jobs:
  test:
    resource_class: xlarge   # every job defaults to xlarge regardless of actual need
```

Cache key: `v1-deps-{{ checksum "package.json" }}` (using `package.json` instead of the lockfile).

### Output (abbreviated)

> **Findings**
>
> - **Unverified, unpinned third-party orb** — `[High]` — `some-random-user/deploy-helper@volatile` is not a CircleCI-verified orb and uses a floating tag (`volatile`), meaning its behavior can change without any corresponding change in this repo, and it runs with full pipeline access. Pin to a specific version and review its source before continuing to use it; consider replacing with a verified orb or inlined steps if the orb's functionality is simple.
> - **Cache key based on `package.json` instead of the lockfile** — `[Medium]` — `package.json` can change without dependency versions actually changing (or vice versa, a lockfile update without a `package.json` change), so this cache key doesn't reliably invalidate exactly when dependencies change. Key on the lockfile (`package-lock.json`/`yarn.lock`) checksum instead.
> - **All jobs default to `xlarge`** — `[Medium]` — without evidence every job needs this much compute, this is likely overpaying for smaller jobs. Review actual resource utilization per job and right-size individually.
>
> **Overall verdict**
> The unpinned third-party orb is the most concerning finding — it's a live supply-chain risk that could change pipeline behavior without any visibility. Address that first.

This example is illustrative — a real review depends entirely on the actual CircleCI configuration discovered for the target project.
