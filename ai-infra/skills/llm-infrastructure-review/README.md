# LLM Infrastructure Review

Reviews LLM infrastructure holistically — serving stack fit, GPU utilization, gateway presence, cost visibility, and observability — as a top-level entry point routing to deeper skills.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our LLM infrastructure."
- "Holistic review of our AI serving stack."
- "What's the state of our LLM infrastructure?"

## Example

### Input

Stack: two models served via vLLM on a dedicated GPU cluster, with applications calling the vLLM endpoints directly (no gateway). GPU utilization dashboards don't exist — the team isn't sure how utilized the cluster actually is. No centralized token usage or cost tracking exists.

### Output (abbreviated)

> **Capability map**: Serving (vLLM, in use) | GPU Utilization (unknown — no visibility) | Gateway (absent — direct calls) | Cost Visibility (none) | Observability (partial — vLLM's own metrics likely exist but not centrally reviewed).
>
> **Findings**
>
> - **No gateway layer, applications call vLLM directly** — `[High]` — cross-cutting concerns (auth, rate limiting, multi-model routing, unified observability) have no central enforcement point; this becomes significantly more costly to retrofit as more applications and models are added. Recommend `ai-gateway-review` to scope introducing one now, before further growth.
> - **No GPU utilization visibility** — `[High]` — given GPU compute cost, not knowing utilization means the team can't tell whether they're over- or under-provisioned. Recommend `gpu-cluster-optimization` as a near-term priority.
> - **No cost/token usage tracking** — `[High]` — AI infrastructure cost is typically both large and opaque; recommend `ai-cost-optimization` and `token-usage-analysis` once basic visibility is established.
>
> **Overall verdict**: this stack is in an early maturity stage — functional serving exists, but none of the cross-cutting visibility (cost, utilization, centralized gateway) that becomes necessary at scale is in place yet. Recommend establishing GPU utilization and cost visibility first, since decisions about the gateway and further scaling are better made with that data in hand.

This example is illustrative — a real review depends entirely on the actual stack and scale discovered.
