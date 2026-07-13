---
name: template-review
description: Review the technical quality of a platform template (Backstage software template, Terraform module template, scaffolding template) — parameterization design, validation, and output correctness, distinct from the golden path's overall workflow design or Backstage-wide configuration. Triggers on "review this software template", "is this scaffolding template well designed", "review our terraform module template for new services", "check this template for parameterization issues".
user-invocable: true
---

# Template Review

Review the technical quality of a specific platform template — parameterization, validation, and whether its output is actually correct and current.

## When to use

- Reviewing a specific template's technical implementation (a Backstage software template, a module/scaffold template).

**Out of scope**:
- The overall golden-path workflow the template implements → `golden-path-review`
- Backstage instance-wide configuration → `backstage-review`
- Terraform module design principles generally → `terraform/module-review`

## Inputs

- The template's definition (parameters, generated files/structure, any post-generation steps).
- What the template is supposed to produce, and any known issues reported by users.

## Workflow

### 1. Assess parameterization design

Check whether exposed parameters are the ones that actually vary in practice, with sensible defaults for the common case — a template exposing too many parameters burdens every user with decisions most don't need to make; too few forces workarounds for legitimate variation.

### 2. Assess input validation

Confirm parameter inputs are validated (format, allowed values) before generation, so invalid input fails fast with a clear message rather than producing a broken or invalid output that's only discovered later.

### 3. Verify output correctness

Confirm the template's generated output is actually correct and current — run/trace through generation with representative inputs and check the result builds/deploys/passes CI, rather than assuming correctness from the template definition alone (templates rot silently when the underlying standards they encode move on without the template being updated).

### 4. Assess post-generation guidance

Check whether the template leaves the user with clear next steps (what to configure next, what's still manual) rather than a generated scaffold with no guidance on what to do with it.

### 5. Report

Findings on Parameterization, Input Validation, Output Correctness, Post-Generation Guidance, each with severity, plus confirmation of whether the template was actually exercised/verified as part of this review or only statically read.

## Notes

- Always state explicitly whether output correctness was verified by actually generating from the template versus only reading its definition — a template can look correct on paper while producing broken output due to an interaction only visible at generation time.
- Template rot (falling out of sync with evolving standards) is common and easy to miss since the template file itself doesn't change even as the standards it should reflect do — cross-check against current standards explicitly rather than assuming the template is current because it hasn't been recently edited.
