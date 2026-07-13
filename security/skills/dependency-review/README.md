# Dependency Review

Reviews application source-code dependencies for known vulnerabilities (including transitive), license risk, and maintenance health.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our dependencies for vulnerabilities."
- "Check our package dependencies for license issues."
- "Audit our dependency tree for security risk."

## Example

### Input

`package.json` shows a direct dependency on `express@4.17.1`. Dependency tree analysis reveals a transitive dependency, `lodash@4.17.15`, pulled in by a different direct dependency, with a known prototype-pollution vulnerability fixed in `4.17.21`. A direct dependency `some-ui-lib@2.0.0` was last published 4 years ago with an archived upstream GitHub repo. Another dependency uses an AGPL license in a proprietary, closed-source product.

### Output (abbreviated)

> **Findings**
>
> - **Transitive dependency `lodash@4.17.15` has a known prototype-pollution vulnerability** — `[High]` — not visible in the direct dependency list, only discoverable via full tree analysis. Fixed in `4.17.21`, a patch-level jump — low-risk to adopt via a lockfile override or updating the parent dependency.
> - **AGPL-licensed dependency in a proprietary product** — `[High, License Risk]` — AGPL's copyleft terms are generally incompatible with proprietary distribution; recommend legal review and likely replacement with a permissively-licensed alternative.
> - **`some-ui-lib` is unmaintained (archived upstream, no releases in 4 years)** — `[Advisory]` — no currently known vulnerability, but no path to a fix if one is discovered later. Recommend evaluating a maintained alternative proactively rather than waiting for an actual vulnerability to force the migration.
>
> **Overall verdict**: the transitive lodash vulnerability is a quick, low-risk fix and should be prioritized first; the AGPL license issue needs legal input before a technical fix path is chosen.

This example is illustrative — a real review depends entirely on the actual dependency tree and manifest for the target project.
