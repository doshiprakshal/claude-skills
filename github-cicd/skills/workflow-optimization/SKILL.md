---
name: workflow-optimization
description: Simplify CI/CD workflow structure — redundant/duplicate jobs across workflows, unnecessary sequential dependencies, and consolidation opportunities. Distinct from build-performance's timing-data-driven speed focus — this is structural simplification. Triggers on "simplify our ci/cd workflows", "we have too many redundant pipelines", "workflow optimization review", "consolidate our github actions workflows".
user-invocable: true
---

# Workflow Optimization

Simplify CI/CD workflow structure — redundant jobs, unnecessary duplication across workflows, and unclear ownership from organic growth. Distinct from `build-performance` (timing-data-driven speed optimization) — this is about structural clarity and maintainability, though the two often overlap in practice.

## When to use

- A codebase has accumulated many workflows/pipelines over time with unclear overlap.
- The user wants to consolidate or simplify CI/CD structure.

**Out of scope**:
- Raw speed optimization backed by timing data → `build-performance`
- Tool-specific configuration correctness → the relevant tool-specific review skill

## Inputs

- All workflow/pipeline definitions across the repository.
- How/when each is triggered.

## Workflow

### 1. Discover

Gather every workflow and its trigger conditions.

### 2. Checks

- **Duplicate logic across workflows** — the same steps (e.g., dependency install, linting) repeated identically across multiple separate workflow files, that could be a shared/reusable workflow or composite action instead.
- **Redundant triggers** — multiple workflows triggering on the same event doing overlapping work (e.g., two separate workflows both running tests on every PR, for historical reasons that no longer apply).
- **Unnecessary sequential structure** — jobs that don't actually need to wait on each other still declared with a dependency, adding wall-clock time without a real reason (cross-reference `build-performance` for the timing-data-backed version of this finding).
- **Unclear ownership/purpose** — workflows with no clear documented purpose, or that appear to be leftover from a past experiment/migration and never cleaned up.
- **Consolidation opportunities** — several narrow, single-purpose workflows that could be simplified into fewer, clearer ones without losing meaningful separation of concerns.

### 3. Report

Findings on Duplication, Redundant Triggers, Sequential Structure, Ownership/Purpose, Consolidation Opportunities, each with a specific simplification recommendation.

## Notes

- Simplification should preserve meaningful separation of concerns — consolidating everything into one giant workflow isn't automatically better than several focused ones; judge each case on whether the current split adds real value or just historical accident.
- Before recommending removal of a workflow that looks redundant/unused, confirm it's genuinely not serving a purpose (e.g., check recent run history) rather than assuming from the name alone.
