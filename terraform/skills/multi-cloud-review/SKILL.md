---
name: multi-cloud-review
description: Review a Terraform codebase spanning multiple cloud providers for consistency, redundant abstraction, provider-specific pitfalls, and whether the module/workspace structure actually fits a multi-cloud setup. Triggers on "review our multi-cloud terraform setup", "are we handling multiple providers well", "multi-cloud terraform review", "should we abstract across aws and gcp".
user-invocable: true
---

# Terraform Multi-Cloud Review

Review a Terraform codebase spanning more than one cloud provider — consistency of approach, whether abstraction across providers is helping or hurting, and provider-specific pitfalls that a single-cloud review wouldn't catch.

## When to use

- A codebase manages resources across two or more cloud providers.
- The user asks whether their multi-cloud abstraction strategy makes sense.

**Out of scope**:
- Single-provider architecture quality → `architecture-review`
- Provider version compatibility specifically → `upgrade-planner`

## Inputs

- All `.tf` files across every provider in use.
- Any shared/abstraction modules meant to work across providers.

## Workflow

### 1. Discover

Identify every provider in use and how resources/modules are organized relative to them (per-provider directories, a single mixed structure, or an abstraction layer attempting a unified interface).

### 2. Checks

- **Abstraction fit** — if there's a shared module attempting to abstract over multiple providers (e.g., a "compute" module that creates either an EC2 instance or a GCE instance depending on a variable), assess whether the abstraction actually holds up — cloud providers differ enough in capability and semantics that an overly ambitious abstraction often leaks (the "least common denominator" problem) or requires constant escape hatches, which can be worse than two separate, provider-specific modules.
- **Consistency of approach** — similar concerns (networking, IAM, tagging) handled with a comparable level of rigor across each provider, not thoroughly done for one cloud and ad hoc for another.
- **Provider-specific pitfalls** — known gotchas for each provider in use (e.g., GCP resource deletion behavior differing from AWS, Azure resource group scoping requirements) that the code may not be accounting for correctly.
- **State organization** — whether state is split sensibly by provider/environment, or awkwardly mixed in a way that makes a single cloud's outage/incident harder to isolate operationally.
- **Redundant provider coverage** — the same underlying capability (e.g., object storage) implemented separately per provider with no shared interface at all, when a lighter-weight shared interface (without over-abstracting) might reduce duplication.

### 3. Report

Findings grouped by Abstraction Fit, Consistency, Provider Pitfalls, State Organization, Redundancy, each with severity and specific recommendation.

## Notes

- Multi-cloud abstraction is a judgment call with real tradeoffs — don't reflexively recommend more abstraction or less; assess whether the current level is actually serving the team or fighting them.
- Provider-specific pitfalls require accurate, current knowledge of each provider's actual behavior — flag anything uncertain as worth verifying against current provider documentation rather than asserting with false confidence.
