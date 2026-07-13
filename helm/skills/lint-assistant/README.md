# Helm Lint Assistant

Runs and interprets `helm lint` (including `--strict`), and catches additional issues it misses — unused values, unused template helpers, and unquoted values that hit YAML type-coercion gotchas.

See `SKILL.md` for the full workflow.

## How to invoke

- "Run helm lint on this chart."
- "Lint this chart and tell me what's wrong."
- "What's wrong with this chart's syntax?"

## Example

### Input

```
$ helm lint --strict mychart
==> Linting mychart
[WARNING] templates/deployment.yaml: object name does not conform to Kubernetes naming requirements: "My-App"
```

Additionally, `mychart/values.yaml` defines `featureFlags.betaEnabled: true`, never referenced in any template. `_helpers.tpl` defines a `mychart.oldLabels` helper never `include`d anywhere. `templates/configmap.yaml` has:
```yaml
data:
  appVersion: {{ .Values.appVersion }}
```
where `values.yaml` has `appVersion: 1.20` (no quotes) — YAML parses this as a float, so it renders as `1.2`, silently dropping the trailing zero.

### Output (abbreviated)

> **Per-check table**
>
> | Check | Result |
> |---|---|
> | `helm lint --strict` | 1 Warning |
> | Unused values | 1 found |
> | Unused helpers | 1 found |
> | Unquoted type-coercion risk | 1 found |
>
> **Issues**
>
> - **`helm lint` warning: invalid object name** — `templates/deployment.yaml` — the rendered resource name `"My-App"` doesn't conform to Kubernetes naming rules (must be lowercase RFC 1123). Fix the `nameOverride`/name template to lowercase.
> - **Unused value: `featureFlags.betaEnabled`** — defined in `values.yaml`, never referenced in any template. Either wire it into the relevant template or remove it.
> - **Unused helper: `mychart.oldLabels`** — defined in `_helpers.tpl`, never `include`d anywhere. Likely leftover from a past refactor — safe to remove if confirmed unused.
> - **Unquoted numeric-looking value: `appVersion: 1.20`** — `[Blocker-equivalent for correctness]` — YAML parses `1.20` as the float `1.2`, silently dropping the trailing zero when rendered. Quote it in `values.yaml` (`appVersion: "1.20"`) to preserve it as a string.
>
> **Overall verdict**
> Invalid — 1 warning (naming), 1 correctness bug (unquoted version silently truncated), 2 dead-code findings (unused value, unused helper).

This example is illustrative — a real lint run depends entirely on the actual chart content for the target chart.
