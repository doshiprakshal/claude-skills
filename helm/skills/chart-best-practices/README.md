# Helm Chart Best Practices Audit

Audits a chart's authoring conventions and structure — Chart.yaml completeness, helper template usage, standard label conventions, NOTES.txt, semantic versioning, and repo hygiene.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our chart structure."
- "Helm chart best practices audit."
- "Is this chart well structured?"

## Example

### Input

A chart with: `Chart.yaml` missing `maintainers` and `description`; every template (`deployment.yaml`, `service.yaml`, `ingress.yaml`) manually repeats the same 6-line label block instead of using a helper; no `NOTES.txt`; no `.helmignore` (a `.git` folder ends up packaged into chart releases).

### Output (abbreviated)

> **Findings**
>
> - **`Chart.yaml` missing `description` and `maintainers`** — `[Medium]` — makes the chart harder to discover/trust in a repository listing, and gives no owner contact for questions. Add both fields.
> - **Labels copy-pasted across every template instead of a shared helper** — `[Medium]` — the same 6-line block appears in 3 templates; any future label change requires editing all 3 in sync, and they're already at risk of drifting. Extract to a `_helpers.tpl` `define` block and `include` it everywhere.
> - **No `NOTES.txt`** — `[Advisory]` — users get no post-install guidance (e.g., how to access the service). Add one with the chart's actual access instructions.
> - **No `.helmignore`** — `[Medium]` — the packaged chart includes the `.git` directory, bloating the package and potentially leaking commit history metadata into distributed chart archives. Add a `.helmignore` excluding `.git`, CI configs, and editor files.
>
> **Overall verdict**
> Structurally workable but not following ecosystem conventions in a few concrete ways — the label duplication is the most likely to cause a real bug (drift between templates), the missing `.helmignore` is the easiest fix with real payload-size impact.

This example is illustrative — a real audit depends entirely on the actual chart structure discovered for the target chart.
