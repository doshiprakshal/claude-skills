# Platform Security

Reviews whether security is baked into platform golden paths and self-service actions as the automatic default, rather than an opt-in step.

See `SKILL.md` for the full workflow.

## How to invoke

- "Is security baked into our golden paths by default?"
- "Do teams have to opt into security or is it automatic?"
- "Review platform-level security-by-default posture."

## Example

### Input

The new-service golden path template generates a Kubernetes manifest that, by default, runs as root with no resource limits and a broadly-scoped IAM role — there's a commented-out "secure" configuration block in the template with instructions to uncomment it, but this step isn't required or enforced. Self-service IAM permission requests have no scoping limit (per an earlier `self-service-review` finding).

### Output (abbreviated)

> **Findings**
>
> - **Golden path defaults to insecure configuration, secure option is opt-in and commented out** — `[Blocker]` — the "secure by default" premise is inverted here: the easiest path (do nothing, use the template as generated) produces a root-running, broadly-permissioned service, while the secure option requires a developer to know to find and uncomment a specific block. Given equal or lower effort, the insecure path will dominate in practice. Flip the default: generate the secure configuration by default, with an explicit, visible step required to opt into broader permissions if genuinely needed.
> - **No enforcement backing the "secure" option even when used** — `[High]` — even a developer who does uncomment the secure block has no admission-time enforcement confirming the final manifest meets the standard; see `security/admission-controller-review` for closing this gap with actual enforcement rather than relying on template discipline alone.
> - **Cross-reference**: the unguardrailed self-service IAM requests noted in `self-service-review` compound this finding — even a securely-templated service could still have its permissions broadened after the fact with no gate.
>
> **Overall verdict**: this is a textbook case of a secure option existing but not being the path of least resistance — flipping the template default is a small, high-leverage change that would fix this for every future service generated from it.

This example is illustrative — a real review depends entirely on the actual golden path and self-service configuration discovered.
