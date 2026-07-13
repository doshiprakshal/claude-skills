# Helm Template Debugger

Diagnoses why `helm template`/`install`/`upgrade` fails or renders unexpected output — nil pointer errors, broken YAML indentation, range/if logic bugs, named-template scope issues, and type mismatches.

See `SKILL.md` for the full root-cause catalog and workflow.

## How to invoke

- "Helm template is failing."
- "nil pointer evaluating interface {}.foo — help me debug this."
- "Why is this Helm template rendering wrong?"

## Example

### Input

```
$ helm template mychart --debug
Error: template: mychart/templates/deployment.yaml:24:22: executing "mychart/templates/deployment.yaml" at <.Values.resources.limits.cpu>: nil pointer evaluating interface {}.limits
```

Template excerpt:
```yaml
resources:
  limits:
    cpu: {{ .Values.resources.limits.cpu }}
```

`values.yaml` has:
```yaml
resources: {}
```

### Output (abbreviated)

> **Symptom summary**
> `helm template` fails at `deployment.yaml:24` with a nil pointer error on `.Values.resources.limits`.
>
> **Evidence**
> `values.yaml` defines `resources: {}` — the `resources` key exists but is empty, so `.Values.resources.limits` is nil, and accessing `.cpu` on that nil value fails.
>
> **Root cause**
> Classic nil-pointer-on-missing-nested-key pattern: the template assumes `resources.limits.cpu` always exists, but the values file only guarantees `resources` exists (as an empty map), not its nested `limits` key.
>
> **Recommended fix**
> Guard the access, either with a default:
> ```yaml
> cpu: {{ .Values.resources.limits.cpu | default "500m" }}
> ```
> or restructure to skip the whole `resources` block if not set:
> ```yaml
> {{- if .Values.resources }}
> resources:
>   {{- toYaml .Values.resources | nindent 2 }}
> {{- end }}
> ```
> The second form is usually preferable for an optional block, since it avoids emitting an empty/partial `resources:` section at all when the user hasn't configured one.
>
> **How to verify**
> Re-run `helm template mychart --debug` with the same values — it should now render successfully (or cleanly omit the `resources` block, depending on which fix was applied).

This example is illustrative — a real investigation depends entirely on the actual error and template content for the target chart.
