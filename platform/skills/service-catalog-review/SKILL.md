---
name: service-catalog-review
description: Review a service catalog's data model and completeness — what metadata is tracked, how ownership/dependency relationships are modeled, and whether the catalog is trustworthy enough to drive real workflows, independent of any specific catalog tool. Triggers on "review our service catalog data model", "is our service catalog actually trustworthy", "what should our service catalog track", "audit our service catalog completeness".
user-invocable: true
---

# Service Catalog Review

Review a service catalog's data model and completeness — independent of the specific tool implementing it — focused on whether the catalog is trustworthy enough to drive real workflows.

## When to use

- Reviewing what a service catalog tracks and whether it's complete/trustworthy, as a data-model question.

**Out of scope**:
- Backstage-specific catalog implementation mechanics → `backstage-review`
- Whether teams actually use the catalog day-to-day → `developer-experience-audit`

## Inputs

- The catalog's current data model (what fields/relationships are tracked per service).
- Coverage: what fraction of actual running services are represented in the catalog.
- Any downstream workflows/tools that consume catalog data.

## Workflow

### 1. Assess data model completeness

Check whether the catalog tracks the fields that actually matter for real workflows — ownership, on-call routing, dependency relationships, lifecycle stage (experimental/production/deprecated), runtime environment — versus a data model that's technically populated but missing the fields that would make it operationally useful.

### 2. Assess coverage

Determine what fraction of actually-running services are represented in the catalog — a catalog missing a significant fraction of real services isn't trustworthy as a single source of truth, and any workflow built on top of it (dependency-based blast-radius analysis, on-call routing) will be systematically wrong for the missing services.

### 3. Assess dependency-relationship accuracy

If the catalog models service dependencies, check whether they're actually kept accurate (auto-derived from real traffic/config where possible) versus manually entered once and never updated — stale dependency data is worse than no dependency data, since it creates false confidence.

### 4. Assess downstream trust

Check whether any workflows actually consume catalog data for real decisions (on-call routing, `blast-radius-analysis`-style impact assessment, security asset inventory) — a catalog with no real downstream consumers is a documentation exercise, not infrastructure; conversely, a catalog with important downstream consumers needs a much higher completeness/accuracy bar.

### 5. Report

Findings on Data Model Completeness, Coverage, Dependency Accuracy, Downstream Trust, each with severity.

## Notes

- Coverage gaps are the most consequential and most likely to be silently accepted — always ask "what fraction of real running services are actually represented here" explicitly rather than assuming the catalog is comprehensive.
- Stale, manually-entered dependency data is actively worse than no dependency data at all for any workflow (like incident blast-radius analysis) that trusts it — flag stale dependency data as a correctness risk, not just an incompleteness one.
