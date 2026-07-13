# Build Performance

Analyzes CI build/pipeline performance — slow steps identified from timing data, caching gaps, missed parallelization opportunities, and resource sizing — with concrete, data-backed speedup recommendations.

See `SKILL.md` for the full workflow.

## How to invoke

- "Why is our CI pipeline slow?"
- "Build performance review."
- "Speed up our CI builds."

## Example

### Input

Pipeline timing across the last 10 runs: `install-deps` step averages 3m10s every run (no caching configured); `unit-tests` and `lint` run sequentially, averaging 2m and 1m respectively, but don't depend on each other's output; `integration-tests` averages 4m30s and is the largest single step, doing genuine work against a real test database.

### Output (abbreviated)

> **Findings**
>
> - **`install-deps` takes 3m10s every run with no caching** — `[High — largest easy win]` — this step reinstalls all dependencies from scratch on every run, consistently across all 10 sampled runs. Adding dependency caching keyed on the lockfile hash would very likely cut this to under 30s on cache hits — an estimated ~2m40s saved per run.
> - **`unit-tests` and `lint` run sequentially despite no dependency between them** — `[Medium]` — combined they take ~3m serialized; running them in parallel jobs would reduce this to whichever is longer (~2m), saving ~1m per run.
> - **`integration-tests` (4m30s) is genuine work, not obviously optimizable from timing data alone** — *(informational)* — this is the single largest step, but there's no clear caching/parallelization opportunity visible from timing data alone; it's doing real work against a test database. Worth a closer look at whether the test suite itself has slow individual tests, but that's a different kind of investigation than this data can drive.
>
> **Overall verdict**
> Adding dependency caching to `install-deps` is the highest-leverage, lowest-effort fix — roughly 2m40s off every single run. Parallelizing `unit-tests`/`lint` is a smaller, still-worthwhile second step. Together these could cut total pipeline time by roughly a third based on the current ~10m40s average.

This example is illustrative — a real analysis depends entirely on the actual timing data available for the target pipeline.
