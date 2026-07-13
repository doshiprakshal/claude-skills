---
name: knowledge-base-generator
description: Organize scattered documentation/tribal knowledge into a structured, navigable knowledge base — identifying gaps, duplication, and a sensible information architecture, distinct from writing any single document. Triggers on "help us organize our scattered documentation into a knowledge base", "consolidate our docs into a coherent knowledge base", "what's a good information architecture for our documentation", "identify gaps and duplication across our docs".
user-invocable: true
---

# Knowledge Base Generator

Organize scattered documentation and tribal knowledge into a structured, navigable knowledge base.

## When to use

- Consolidating scattered docs (wikis, READMEs, Slack knowledge, tribal knowledge) into an organized knowledge base structure.

**Out of scope**:
- Writing/reviewing any single document's content quality → `technical-documentation`
- Findability/currency review of existing runbooks specifically → `sre/runbook-review`

## Inputs

- The current scattered documentation sources (locations, rough content areas).
- Known tribal knowledge that isn't written down anywhere yet, if identifiable.

## Workflow

### 1. Inventory existing content

Catalog what documentation already exists and where, across all current scattered locations — this is the raw material to organize, not to rewrite from scratch.

### 2. Identify duplication

Find content that's documented in multiple places, potentially with drifted/conflicting versions — duplication isn't just redundant effort, it's a correctness risk when the copies disagree, similar to the catalog-consistency concern in `platform/service-catalog-review`.

### 3. Identify gaps

Find known tribal knowledge or frequently-asked questions that aren't documented anywhere — cross-reference against support/question channel history if available, similar to the coverage-gap approach in `platform/platform-documentation`.

### 4. Design an information architecture

Propose a structure/categorization that matches how people actually look for information (by task, by system, by audience) rather than an arbitrary or organically-grown structure — a knowledge base's value depends heavily on whether its structure matches actual search/browse behavior.

### 5. Report

An inventory with duplication and gaps flagged, and a proposed information architecture with a migration/consolidation plan for moving scattered content into it.

## Notes

- Duplicated content with drifted, conflicting versions is a more serious problem than an outright gap — a reader consulting a stale duplicate can be actively misled, whereas a gap at least doesn't provide false confidence; prioritize resolving conflicting duplicates highly.
- Design the information architecture around actual search/browse behavior (task-oriented, system-oriented) rather than however content happened to accumulate organically — this is usually the single highest-leverage change for making a knowledge base actually useful.
