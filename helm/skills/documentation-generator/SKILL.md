---
name: documentation-generator
description: Generate a Helm chart's README.md — overview, install instructions, and a full values reference table — from Chart.yaml, values.yaml, and inline documentation comments, explicitly flagging values that lack documentation rather than inventing descriptions. Triggers on "generate documentation for this chart", "create a values table for our chart", "helm documentation generator", "write a README for this helm chart".
user-invocable: true
---

# Helm Documentation Generator

Generate a chart's `README.md` — overview, installation instructions, and a full values reference table — from its actual `Chart.yaml`, `values.yaml`, and any inline documentation comments. A generation skill: produces the document, and is explicit about what it had to leave undocumented rather than inventing plausible-sounding descriptions.

## When to use

- A chart has no README, or an outdated one.
- The user wants a values reference table generated automatically.

**Out of scope**:
- Judging whether the values structure itself is well-designed → `values-review` (this skill documents whatever exists, it doesn't critique it)

## Inputs

- `Chart.yaml` (name, description, version, maintainers).
- `values.yaml`, including inline comments if present (e.g., `helm-docs`-style `# -- description` comments).
- The chart's actual repository/registry reference, for accurate install instructions.

## Workflow

### 1. Discover

Parse `Chart.yaml` for metadata, and `values.yaml` for every key, its default value, inferred type, and any inline comment documenting it.

### 2. Generate

- **Overview** — chart name, description, version, from `Chart.yaml`.
- **Installation** — the actual `helm install`/`helm repo add` commands using the chart's real repo/name, not a placeholder.
- **Values reference table** — every key, its type (inferred from the YAML value), its default, and its description (from inline comments if present).
- **Dependencies** — list from `Chart.yaml`'s `dependencies:` block, if any.

### 3. Report

The generated `README.md` content, plus an explicit list of values keys that had no inline documentation comment — so the user knows exactly where the generated description is a placeholder/inferred-from-key-name rather than authoritative, and where to add real documentation for a better result on the next run.

## Notes

- Never invent a plausible-sounding description for an undocumented key — either state it plainly as "no description provided" or make an inferred guess *and clearly mark it as inferred*, but don't present a guess as authoritative documentation.
- If the chart already has a README, don't blindly overwrite hand-written prose sections (overview, usage examples) — regenerate the values table specifically and note where the rest of the README may need manual review to stay in sync.
