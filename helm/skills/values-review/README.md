# Helm Values Review

Reviews a chart's `values.yaml`/`values.schema.json` design quality — schema coverage, sane defaults, structural complexity, naming consistency, and documentation — independent of any specific deployment.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our values.yaml."
- "Is our Helm values structure good?"
- "Values schema review for this chart."

## Example

### Input

```yaml
# values.yaml (excerpt)
img:
  repo: myapp
  tag: latest          # implicit floating default
config:
  db:
    connection:
      pool:
        settings:
          max: 10       # 5 levels deep
replica_count: 1         # snake_case, inconsistent with "img" camelCase elsewhere
apiKey: "changeme"        # placeholder-looking secret default
```

No `values.schema.json` present.

### Output (abbreviated)

> **Findings**
>
> - **No schema validation** — `[Medium]` — no `values.schema.json` exists, so malformed overrides (wrong type, typo'd key) fail silently or produce a confusing template error rather than a clear validation message. Recommend adding one.
> - **Floating `latest` default** — `[High]` — `img.tag` defaults to `latest`, meaning a fresh install with no override pulls whatever the tag currently points to, non-reproducibly. Default to a specific version or make the value required with no default.
> - **Excessive nesting** — `[Medium]` — `config.db.connection.pool.settings.max` is 5 levels deep for a single tunable. Flatten to something like `db.poolMaxConnections` unless the nesting reflects a real, reused structure elsewhere.
> - **Inconsistent naming convention** — `[Advisory]` — `replica_count` (snake_case) alongside `img`/camelCase-style keys elsewhere in the same file. Pick one convention and apply it consistently.
> - **Placeholder secret default** — `[High]` — `apiKey: "changeme"` is exactly the kind of default that gets deployed as-is by someone who doesn't notice it. Remove the default entirely and mark it `required` in the schema, forcing an explicit value.
>
> **Overall verdict**
> The values interface has real usability gaps — the floating tag and placeholder secret are the two most likely to cause real problems if left as-is; the rest are maintainability improvements.

This example is illustrative — a real review depends entirely on the actual values.yaml and templates for the target chart.
