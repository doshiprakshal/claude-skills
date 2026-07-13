# Internal Developer Platform

Designs or evaluates the overall architecture of an Internal Developer Platform — abstraction layering and build-vs-buy decisions per layer.

See `SKILL.md` for the full workflow.

## How to invoke

- "Design our internal developer platform architecture."
- "Should we build or buy our IDP?"
- "Review our IDP's abstraction layers."

## Example

### Input

A 3-person platform team supports 40 product engineers on Kubernetes/AWS. Currently, developers write raw Terraform and Kubernetes manifests directly for every new service — no abstraction layer exists yet. The team is considering building a fully custom internal portal from scratch versus adopting Backstage.

### Output (abbreviated)

> **Current state**: no abstraction layers exist — developers interact directly with the infrastructure layer (raw Terraform/K8s manifests), meaning every new service requires infrastructure-level expertise from product engineers. This is the layer-conflation problem in its most basic form.
>
> **Recommendation**: introduce a provisioning/orchestration layer (e.g., a thin set of Terraform modules or a Crossplane-based abstraction) exposing a small number of well-defined "service types" rather than raw primitives, plus a developer-facing interface layer.
>
> **Build vs. buy**: given a 3-person platform team, building a fully custom portal from scratch is a significant, ongoing maintenance burden this team is unlikely to sustain alongside its other responsibilities. Recommend adopting Backstage (see `backstage-review` for configuration depth) for the developer-facing interface layer rather than building custom — it fits the common case well and frees the team's limited capacity for the orchestration layer, which is more likely to need genuine customization for this org's specific infrastructure.
>
> **Golden-path integration**: design golden-path templates as Backstage software templates calling into the new orchestration layer's module interface, so paths can be updated independently of both the portal and the underlying infrastructure modules.

This example is illustrative — a real design depends entirely on the actual team capacity, infrastructure stack, and existing tooling.
