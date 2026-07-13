---
name: refactoring-plan
description: Plan a code refactoring effort — scoping the change, sequencing it into safe incremental steps, and identifying what test coverage is needed before starting, distinct from a specific migration plan or technical debt prioritization. Triggers on "help us plan this refactoring effort", "sequence this refactor into safe steps", "what test coverage do we need before refactoring this", "scope this refactoring project".
user-invocable: true
---

# Refactoring Plan

Plan a code refactoring effort — scope, safe incremental sequencing, and required test coverage before starting.

## When to use

- Planning how to approach a specific refactoring effort safely.

**Out of scope**:
- Identifying and prioritizing what needs refactoring across a codebase → `technical-debt-analysis`
- A migration between different systems/vendors (broader than internal code restructuring) → `migration-plan`

## Inputs

- The code/module being refactored and the target end state.
- Current test coverage for the affected code.

## Workflow

### 1. Define scope precisely

State exactly what's in and out of scope for this refactor — refactoring scope tends to creep as more "while we're in here" opportunities are noticed; a precise scope boundary keeps the effort reviewable and reduces risk of an open-ended, never-finished effort.

### 2. Assess test coverage adequacy before starting

Check whether existing tests adequately cover the current behavior of the code being refactored — refactoring without adequate coverage risks silently changing behavior without detection; if coverage is inadequate, recommend adding characterization tests for current behavior as a prerequisite step, before the refactor itself begins.

### 3. Sequence into safe incremental steps

Break the refactor into small, independently-verifiable steps rather than one large simultaneous change — each step should leave the system in a working state, allowing verification (and rollback, if needed) between steps rather than only at the very end.

### 4. Identify risk points

Flag the specific steps most likely to introduce a behavior change or break something (e.g., changing a shared interface used by many callers) for extra scrutiny/review, rather than treating every step as equally risky.

### 5. Report

A scope statement, test-coverage-adequacy assessment (with characterization-test recommendation if needed), a sequenced step plan with verification points, and flagged high-risk steps.

## Notes

- Inadequate test coverage before refactoring is the most common way refactors introduce silent regressions — always assess this explicitly and recommend characterization tests as a prerequisite rather than proceeding directly into the refactor if coverage is weak.
- Scope creep ("while we're in here, let's also...") is a common failure mode that turns a bounded refactor into an open-ended effort — state scope precisely and flag any suggested additions as a separate, distinct effort rather than folding them in.
