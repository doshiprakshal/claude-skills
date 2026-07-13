# Template Review

Reviews the technical quality of a platform template — parameterization design, input validation, output correctness, and post-generation guidance.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review this software template."
- "Is this scaffolding template well designed?"
- "Review our Terraform module template for new services."

## Example

### Input

A Backstage software template for new services exposes 14 parameters, including several rarely-changed infrastructure settings most users leave at defaults without understanding. No validation exists on the "service name" parameter, and a recent generation with a name containing an uppercase letter produced a broken Kubernetes manifest (names must be lowercase) that wasn't caught until CI failed. The template generates a Dockerfile using a base image version that was deprecated org-wide 6 months ago.

### Output (abbreviated)

> **Findings**
>
> - **14 exposed parameters, most left at default** — `[Medium]` — over-parameterization burdens users with decisions most don't need to make. Recommend reducing to the small set that genuinely varies per use case, with the rest set to sensible fixed defaults (or exposed only via an "advanced" path for the rare case that needs them).
> - **No validation on service name parameter, causing a downstream CI failure** — `[High]` — invalid input (uppercase name) should fail immediately at generation time with a clear message, not silently produce a broken manifest discovered later in CI. Add input validation (e.g., a regex constraint) at the template parameter level.
> - **Generated Dockerfile uses a base image deprecated 6 months ago** — `[High]` — template rot: every new service generated since the org-wide deprecation has been started on an already-outdated pattern. Update the template immediately; see `dockerfile-review` for the specific correct pattern.
>
> **Verification note**: output correctness was confirmed by actually generating a service from the template with representative inputs, not just reading the template definition — this is what surfaced the uppercase-name failure.
>
> **Overall verdict**: the deprecated base image is the most urgent fix (actively propagating known-wrong output to every new service); the validation gap is a close second given it's already caused a real failure.

This example is illustrative — a real review depends entirely on the actual template definition and generation behavior.
