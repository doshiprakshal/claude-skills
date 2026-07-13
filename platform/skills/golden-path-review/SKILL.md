---
name: golden-path-review
description: Review the design and content of a golden path (an opinionated, paved-road workflow for a common task like "spin up a new service") — whether it actually covers the common case well, stays current, and has a sensible escape hatch, distinct from how it's technically implemented as a Backstage template. Triggers on "review our golden path for creating a new service", "is our paved-road workflow actually good", "review the content of this golden path", "assess whether our golden paths cover real use cases".
user-invocable: true
---

# Golden Path Review

Review the design and content of a golden path — whether the opinionated workflow it provides actually serves the common case well and stays maintainable over time.

## When to use

- Reviewing a specific golden path's design/content (what it does and doesn't cover), as opposed to its technical implementation.

**Out of scope**:
- Backstage-specific template implementation mechanics → `backstage-review`, `template-review`
- Whether developers are actually adopting the golden path (usage/friction) → `developer-experience-audit`

## Inputs

- The golden path's defined workflow/steps and what it produces.
- The range of real use cases it's meant to serve.
- How/when the golden path is updated as underlying standards change.

## Workflow

### 1. Assess common-case coverage

Determine whether the golden path actually covers the majority of real use cases well, or whether it's built for an overly narrow "ideal" case that most real services don't cleanly fit — a golden path most teams can't actually use without heavy customization has failed its core purpose.

### 2. Assess opinionation vs. flexibility balance

A golden path should be genuinely opinionated (that's the point — reducing decisions) but needs a clear, sanctioned escape hatch for legitimate exceptions, rather than either being so rigid it forces workarounds or so flexible it stops actually providing guardrails.

### 3. Assess currency

Check whether the golden path reflects current best practice/standards or has drifted stale while underlying infrastructure/tooling standards moved on — a stale golden path actively teaches outdated patterns to every team that uses it, which is a worse outcome than having no golden path.

### 4. Assess update mechanism

Confirm there's an actual owner and process for updating the golden path as standards evolve, and ideally a mechanism to propagate updates to services that already used an earlier version (versioning/migration story), not just new adopters.

### 5. Report

Findings on Common-Case Coverage, Opinionation/Flexibility Balance, Currency, Update Mechanism, each with severity and recommendation.

## Notes

- A stale golden path is actively harmful, not just neutral — it propagates outdated patterns to every new adopter; treat currency as a first-class, ongoing maintenance concern, not a one-time design task.
- If most teams need heavy customization to use a "golden" path, that's a strong signal the path itself needs redesign around what teams actually need, not that teams need more training on using it as-is.
