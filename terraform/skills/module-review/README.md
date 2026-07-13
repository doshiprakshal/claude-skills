# Terraform Module Review

Reviews a reusable Terraform module's design — input/output interface quality, composability, versioning discipline, and hardcoded values that should be parameterized.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review this Terraform module."
- "Is our module well designed?"
- "Should this be a reusable module?"

## Example

### Input

A `vpc` module that creates its own hardcoded `us-east-1` region resources, has no `variables.tf` beyond a single `config` object (`var.config.everything`), no `outputs.tf` (consumers currently reference resources by constructing ARNs manually outside the module), and no git tags — consumers all reference `ref=main`.

### Output (abbreviated)

> **Findings**
>
> - **Hardcoded region** — `[High]` — the module hardcodes `us-east-1` internally rather than accepting it as a variable or inheriting from the provider config. This makes the module unusable for any team needing a different region. Parameterize or remove the hardcoded region and rely on the provider block passed in by the consumer.
> - **Opaque single `config` object as the entire interface** — `[Medium]` — a single blob input makes it hard for consumers to know what's actually required/optional without reading the module's internals, and defeats Terraform's own type-checking on individual fields. Break into explicit, individually-typed variables with clear defaults.
> - **No outputs defined** — `[High]` — consumers currently reconstruct resource ARNs manually outside the module instead of referencing module outputs, which is fragile and duplicates logic that should live in the module. Add outputs for the resource IDs/ARNs consumers actually need.
> - **No versioning — all consumers track `ref=main`** — `[Blocker]` — any change to the module immediately affects every consumer with no ability to pin or roll forward deliberately. A breaking change here has essentially unbounded blast radius. Start tagging releases and encourage consumers to pin to a specific tag.
>
> **Overall verdict**
> Not ready for wider reuse as-is — the lack of versioning is the most urgent structural issue (any fix to the other findings would itself be a breaking, unversioned change today). Start there, then address the interface design.

This example is illustrative — a real review depends entirely on the actual module structure discovered for the target module.
