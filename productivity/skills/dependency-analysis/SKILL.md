---
name: dependency-analysis
description: Analyze a codebase or service's dependency graph for coupling and structural health — circular dependencies, inappropriate layer violations, and modules with excessive fan-in/fan-out, distinct from third-party package vulnerability review. Triggers on "analyze our dependency graph for coupling issues", "do we have circular dependencies in this codebase", "which modules are too tightly coupled", "review our service's dependency structure for architectural health".
user-invocable: true
---

# Dependency Analysis

Analyze a codebase or service's internal dependency graph for coupling and structural health.

## When to use

- Assessing internal code/module or service dependency structure for coupling problems.

**Out of scope**:
- Third-party package vulnerability/license review → `security/dependency-review`
- Service-to-service architectural blast radius for an incident → `incidents/blast-radius-analysis`

## Inputs

- The codebase's module/package structure, or the service's call-dependency graph.
- Any intended layering/architecture (e.g., a layered architecture with defined allowed-dependency directions).

## Workflow

### 1. Map the dependency graph

Build or obtain the actual dependency graph between modules/packages/services — from import statements, build dependencies, or observed call patterns.

### 2. Detect circular dependencies

Identify any circular dependency chains — these are a strong signal of coupling problems, since they prevent clean independent testing/deployment of the involved modules and often indicate an unclear separation of responsibilities.

### 3. Detect layer violations

If an intended layering exists (e.g., domain logic shouldn't depend on infrastructure code), check for violations where a lower layer depends on a higher one — this erodes the layering's intended benefits (testability, replaceability) over time if left unchecked.

### 4. Identify excessive fan-in/fan-out

Flag modules with unusually high fan-in (many things depend on it, making it risky to change) or fan-out (it depends on many things, making it hard to test in isolation) — both are structural coupling risk signals worth surfacing even without a specific problem already reported.

### 5. Report

Findings on Circular Dependencies, Layer Violations, Fan-In/Fan-Out Hotspots, each with the specific modules involved and severity, plus a suggested restructuring direction where feasible.

## Notes

- A circular dependency is one of the strongest and most objective coupling red flags available — always report these explicitly and specifically (the actual cycle, not just "there are circular dependencies somewhere"), since they're concrete and actionable.
- High fan-in modules deserve particular caution when recommending changes — a module many things depend on is exactly the kind of place where a seemingly small change can have wide, hard-to-predict blast radius; flag this explicitly when such a module is a refactoring candidate.
