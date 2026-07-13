# Helm Values Migration

Migrates a `values.yaml` from an old chart version's schema to a new one — mapping renamed/moved keys automatically where unambiguous, flagging removed keys with no replacement, and flagging new required keys with no default.

See `SKILL.md` for the full workflow.

## How to invoke

- "Migrate our values.yaml to the new chart version."
- "Our values keys changed after a chart upgrade — help me map them."
- "Map old values to the new chart schema."

## Example

### Input

Current values (chart v3.x):
```yaml
persistence:
  size: 20Gi
ingress:
  enabled: true
  hosts:
    - app.example.com
metrics:
  enabled: true
```

New chart (v4.x) `UPGRADING.md` states: `persistence.size` moved to `primary.persistence.size`; `ingress.hosts` (list of strings) changed to `ingress.hosts` (list of objects with `host`/`paths`); `metrics.enabled` was removed entirely — metrics are now always-on and configured via a new `metrics.serviceMonitor.enabled` key instead.

### Output (abbreviated)

> **Migrated values file**
> ```yaml
> primary:
>   persistence:
>     size: 20Gi
> ingress:
>   enabled: true
>   hosts:
>     - host: app.example.com
>       paths:
>         - path: /
>           pathType: Prefix
> # metrics.enabled removed — see note below
> ```
>
> **Mapped keys**
> - `persistence.size` → `primary.persistence.size` (documented in UPGRADING.md, applied automatically).
> - `ingress.hosts` (string list) → `ingress.hosts` (object list) — restructured automatically; default `path: /` and `pathType: Prefix` assumed since the old format had no path info to carry over. **Review this assumption.**
>
> **Removed keys with no direct replacement**
> - `metrics.enabled: true` — metrics are now always-on in v4.x. If you specifically want a `ServiceMonitor` created (for Prometheus Operator scraping), the new equivalent is `metrics.serviceMonitor.enabled: true` — not added automatically since it's a different concept (always-on metrics vs. an optional ServiceMonitor), not a strict rename. Decide whether to add it.
>
> **New required keys**
> None found in this diff.
>
> **Ambiguous mappings**
> None beyond the flagged assumption on `ingress.hosts` path/pathType defaults.

This example is illustrative — a real migration depends entirely on the actual old/new chart schemas and any UPGRADING.md content available.
