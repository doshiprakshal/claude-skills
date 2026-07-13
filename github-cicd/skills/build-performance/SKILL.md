---
name: build-performance
description: Analyze CI build/pipeline performance — slow steps identified from timing data, caching gaps, missed parallelization opportunities, and resource sizing — with concrete, data-backed speedup recommendations. Triggers on "why is our ci pipeline slow", "build performance review", "speed up our ci builds", "analyze our pipeline timing".
user-invocable: true
---

# Build Performance

Analyze CI/CD pipeline timing data to find concrete speedup opportunities — slow steps, caching gaps, and parallelization potential. Distinct from `workflow-optimization` (structural/redundancy simplification) — this is specifically about raw speed, backed by timing data.

## When to use

- The user reports slow CI builds and wants a data-driven analysis.
- A periodic build-performance review.

**Out of scope**:
- Structural redundancy/simplification not primarily about speed → `workflow-optimization`
- Tool-specific configuration correctness → the relevant tool-specific review skill

## Inputs

- Pipeline run timing data (per-step duration, ideally across multiple recent runs to see consistency).
- Caching configuration currently in use.
- Parallelization/dependency structure of the pipeline.

## Workflow

### 1. Discover

Gather step-level timing data across several recent runs (a single run's timing can be noisy; a pattern across multiple runs is more reliable).

### 2. Checks

- **Slowest steps** — identify the steps consuming the largest share of total pipeline time, ranked — this is where optimization effort has the most leverage.
- **Caching gaps** — steps re-doing work that caching could avoid (dependency installs, build artifact reuse) where no cache is configured, or where cache configuration exists but has a low hit rate (checkable via cache-hit metrics if the CI tool exposes them).
- **Missed parallelization** — steps that don't actually depend on each other but are still sequenced serially, when running them concurrently would reduce wall-clock time.
- **Resource sizing** — steps that are slow due to genuine resource starvation (CPU/memory-constrained runner) rather than algorithmic slowness — a bigger runner would help here, while it wouldn't help a step that's slow for other reasons.
- **Redundant work across the pipeline** — the same expensive step (e.g., a full dependency install) repeated in multiple jobs when it could be done once and shared via an artifact/cache.

### 3. Report

Findings ranked by time-saved potential, each citing the actual timing data behind the recommendation, with a specific concrete fix (add caching to step X, parallelize steps Y and Z, upsize the runner for step W).

## Notes

- Every recommendation should cite the actual timing data behind it — "this looks slow" isn't sufficient; cite the specific duration and its share of total pipeline time.
- Distinguish steps that are slow due to genuine work (a large test suite) from steps slow due to avoidable overhead (repeated dependency installs) — the fix is different for each.
