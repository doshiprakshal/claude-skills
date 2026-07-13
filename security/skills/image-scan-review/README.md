# Image Scan Review

Interprets and triages container image vulnerability scan output, consolidating by root cause and prioritizing by reachability and fix availability.

See `SKILL.md` for the full workflow.

## How to invoke

- "Help me interpret this Trivy scan output."
- "Triage our container image scan results."
- "Why does our image scan show so many vulnerabilities?"

## Example

### Input

Trivy scan on an application image reports 87 vulnerabilities. Investigation shows 79 of them trace back to the base image (`python:3.9-slim`, several versions behind current), all fixable by rebuilding from `python:3.11-slim`. The remaining 8 are in application-layer pip dependencies, of which 6 have available patch-level fixes and 2 have no fix available yet (upstream unpatched).

### Output (abbreviated)

> **Consolidated findings**
>
> - **79 of 87 findings trace to the outdated base image** — `[High, single root cause]` — rebuilding from `python:3.11-slim` (a base image update, not 79 individual fixes) resolves the vast majority of findings in one change. This is by far the highest-leverage action available.
> - **6 application-layer findings have available patch-level fixes** — `[Medium]` — low-risk version bumps in pip dependencies; batch these into a routine dependency update.
> - **2 application-layer findings have no fix available yet** — `[Flag]` — no patched version exists upstream. Recommend either a compensating control if the vulnerable code path is reachable, or documented risk acceptance with a review date to re-check for a fix; don't leave these in the same "todo" bucket as the fixable ones.
>
> **Overall verdict**: this "87 vulnerabilities" scan result is really "one outdated base image + 6 quick dependency bumps + 2 tracked exceptions" — rebuild the base image first, which resolves 91% of the raw finding count in a single change.

This example is illustrative — a real triage depends entirely on the actual scan output and image composition for the target image.
