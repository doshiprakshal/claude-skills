# Helm Documentation Generator

Generates a chart's `README.md` — overview, installation instructions, and a full values reference table — from `Chart.yaml`, `values.yaml`, and inline documentation comments, explicitly flagging values that lack documentation.

See `SKILL.md` for the full workflow.

## How to invoke

- "Generate documentation for this chart."
- "Create a values table for our chart."
- "Write a README for this Helm chart."

## Example

### Input

```yaml
# Chart.yaml
name: redis-cache
description: A lightweight Redis cache deployment
version: 1.4.0
```

```yaml
# values.yaml
replicaCount: 1  # -- Number of Redis replicas to run
image:
  repository: redis
  tag: "7.2"       # no comment
persistence:
  enabled: false
```

Repo: `https://charts.example.com`, chart name `redis-cache`.

### Output (abbreviated)

> **Generated README.md** *(excerpt)*
>
> ```markdown
> # redis-cache
>
> A lightweight Redis cache deployment.
>
> ## Installation
>
> \`\`\`bash
> helm repo add example https://charts.example.com
> helm install my-redis example/redis-cache --version 1.4.0
> \`\`\`
>
> ## Values
>
> | Key | Type | Default | Description |
> |---|---|---|---|
> | `replicaCount` | int | `1` | Number of Redis replicas to run |
> | `image.repository` | string | `redis` | *No description provided* |
> | `image.tag` | string | `"7.2"` | *No description provided* |
> | `persistence.enabled` | bool | `false` | *No description provided* |
> ```
>
> **Undocumented values flagged**
> `image.repository`, `image.tag`, and `persistence.enabled` had no inline comment — their table entries are marked "No description provided" rather than a guessed description. Adding `# -- <description>` comments above these keys in `values.yaml` will improve the next generated README.

This example is illustrative — a real generation run depends entirely on the actual Chart.yaml and values.yaml content for the target chart.
