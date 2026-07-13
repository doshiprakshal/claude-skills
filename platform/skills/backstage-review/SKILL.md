---
name: backstage-review
description: Review a Backstage instance's configuration — catalog entity model, plugin selection, TechDocs setup, and software template design — a tool-specific deep-dive distinct from the broader IDP architecture decision of whether to use Backstage at all. Triggers on "review our backstage setup", "why is our backstage catalog so messy", "review our backstage software templates", "audit our backstage plugin configuration".
user-invocable: true
---

# Backstage Review

Review a Backstage instance's configuration — catalog model, plugins, TechDocs, and software templates — as a tool-specific deep-dive.

## When to use

- Reviewing an existing or being-configured Backstage instance's setup.

**Out of scope**:
- Whether Backstage is the right choice at all vs. alternatives → `internal-developer-platform`
- The content/design of golden paths themselves (as opposed to how they're implemented as Backstage templates) → `golden-path-review`
- The broader service catalog data model question independent of Backstage specifically → `service-catalog-review`

## Inputs

- Backstage catalog entity definitions (`catalog-info.yaml` files) and their consistency across services.
- Installed plugins and their configuration.
- TechDocs setup and documentation coverage.
- Software template definitions.

## Workflow

### 1. Discover

Gather the catalog entity model in use, installed plugins, and existing software templates.

### 2. Checks

- **Catalog entity consistency** — `catalog-info.yaml` files across services follow a consistent schema/convention (ownership, lifecycle, system/domain grouping) rather than ad hoc, inconsistent metadata per team — inconsistency here is the most common source of "our catalog is messy" complaints.
- **Ownership accuracy** — catalog entity ownership metadata is accurate and kept in sync with reality (a common decay pattern: ownership set once at onboarding, never updated as teams reorganize).
- **Plugin selection fit** — installed plugins are actually used and provide value proportional to their maintenance cost, rather than an accumulation of plugins added once and never revisited.
- **TechDocs coverage and freshness** — documentation is actually present and current for cataloged services, not just a catalog entry with no accompanying docs (an empty or stale TechDocs page undermines trust in the catalog as a whole).
- **Software template quality** — templates actually produce a working, golden-path-compliant service on first use, tested end-to-end rather than assumed correct (cross-reference `template-review` for deeper template-specific critique).

### 3. Report

Findings grouped by Catalog Consistency, Ownership Accuracy, Plugin Fit, TechDocs Coverage, Template Quality, each with severity.

## Notes

- Catalog entity inconsistency compounds over time as more services onboard without a strictly-enforced schema — recommend a validation/linting step in CI for `catalog-info.yaml` files if one doesn't already exist, since manual consistency enforcement doesn't scale.
- A catalog entry with no accompanying TechDocs is often worse than no entry at all — it creates the appearance of documentation existing, leading engineers to trust an absence rather than search elsewhere.
