---
name: internal-developer-platform
description: Design or evaluate the overall architecture of an Internal Developer Platform (IDP) — the layering of abstractions (infrastructure, orchestration, developer-facing interface) and build-vs-buy decisions, distinct from any single tool's configuration or the platform's day-to-day capability review. Triggers on "design our internal developer platform architecture", "should we build or buy our idp", "review our idp's abstraction layers", "help us architect our internal developer platform".
user-invocable: true
---

# Internal Developer Platform

Design or evaluate the overall architecture of an Internal Developer Platform — how abstraction layers are structured and key build-vs-buy decisions, as an architecture-level concern distinct from operating an already-built platform.

## When to use

- Designing a new IDP from scratch, or evaluating an existing one's architectural layering.
- A build-vs-buy decision for IDP tooling is being made.

**Out of scope**:
- Day-to-day capability/adoption review of an operating platform → `platform-review`
- Backstage-specific configuration → `backstage-review`
- Golden path content design → `golden-path-review`

## Inputs

- Current or target infrastructure stack (cloud, orchestration platform).
- Developer team size/composition and their current pain points.
- Any existing IDP components already adopted.

## Workflow

### 1. Define the abstraction layers

An IDP typically layers: infrastructure (cloud/k8s primitives) → orchestration/provisioning (how resources get created) → developer-facing interface (portal, CLI, templates) — assess whether the target architecture cleanly separates these, since conflating layers (e.g., developers directly authoring raw infrastructure config through the "developer interface") undermines the abstraction's value.

### 2. Assess build-vs-buy per layer

For each layer, evaluate whether an off-the-shelf tool (Backstage, a managed platform product) fits, versus building custom — factoring in team size (a small platform team may not sustain a fully custom build), existing tool ecosystem fit, and how differentiated the org's actual needs are from what off-the-shelf tools assume.

### 3. Design the golden-path integration point

Determine how golden paths/templates plug into the architecture — they should be a thin, updatable layer on top of the core abstraction, not hardcoded into it, so paths can evolve without a full platform rebuild.

### 4. Assess extensibility

Confirm the architecture allows product teams to escape the paved path when genuinely needed (an IDP that's too rigid drives shadow IT / bypass, similar to the adoption-gap risk in `platform-review`) while still defaulting to the golden path for the common case.

### 5. Report

A proposed or assessed layer architecture, build-vs-buy recommendation per layer with reasoning, and how golden paths integrate — flagging any layer-conflation or over-rigidity found in an existing architecture.

## Notes

- Layer conflation (skipping the abstraction and letting developers touch raw infrastructure primitives directly) is the most common architectural weakness in early-stage IDPs — actively check for it even if not the explicit question asked.
- Build-vs-buy should weight platform team sustaining capacity heavily — a custom-built layer that the current team can't maintain long-term is a worse choice than a slightly-imperfect off-the-shelf fit.
