# Helm Dependency Review

Reviews a chart's subchart dependencies — version pinning, `Chart.lock` presence, condition/tags usage, stale values overrides against subchart schema changes, and redundant duplicate dependencies.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our chart dependencies."
- "Are our subchart versions pinned correctly?"
- "Umbrella chart dependency audit."

## Example

### Input

```yaml
# Chart.yaml
dependencies:
  - name: redis
    version: "*"
    repository: "https://charts.example.com"
  - name: postgresql
    version: "12.1.0"
    repository: "https://charts.example.com"
    condition: postgresql.enabled
```

No `Chart.lock` present. Parent `values.yaml` has:
```yaml
redis:
  master:
    persistence:
      size: 8Gi   # this key was renamed to "primary.persistence.size" in a redis chart version bump the team already picked up transitively
```

### Output (abbreviated)

> **Findings**
>
> - **Unconstrained `redis` version (`"*"`)** — `[High]` — any `helm dependency update` can silently pull a new major version of the redis subchart with breaking changes, with no warning. Pin to a specific version or a scoped range (e.g., `~19.x`).
> - **No `Chart.lock` committed** — `[Medium]` — without a lockfile, `helm dependency build` isn't reproducible; different machines/CI runs could resolve different actual versions within the `postgresql` chart's range. Commit `Chart.lock` after running `helm dependency update`.
> - **Stale override on `redis`** — `[High]` — `redis.master.persistence.size` no longer matches the current redis subchart's values schema, which uses `redis.primary.persistence.size`. This override is silently doing nothing — redis is very likely running with the subchart's default persistence size instead of the intended `8Gi`. Update the override key.
>
> **Overall verdict**
> The redis dependency has two real issues (unpinned version, stale override) that compound each other — the unpinned version is likely what caused the override to go stale in the first place after an unnoticed version drift. Pin the version, fix the override, and add the lockfile.

This example is illustrative — a real review depends entirely on the actual Chart.yaml and values discovered for the target chart.
