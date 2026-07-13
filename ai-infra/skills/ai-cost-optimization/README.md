# AI Cost Optimization

Identifies and prioritizes AI infrastructure cost optimization opportunities holistically — model selection, GPU utilization, caching, and prompt efficiency — weighed against quality risk.

See `SKILL.md` for the full workflow.

## How to invoke

- "Optimize our AI infrastructure costs."
- "Why is our LLM bill so high?"
- "Where can we cut AI costs without hurting quality?"

## Example

### Input

Cost breakdown: 70% of API spend comes from a single high-capability model used for all requests, including simple classification tasks that don't require its full capability. 15% comes from a customer-support summarization feature with no caching, despite many near-duplicate queries. GPU utilization for the self-hosted portion (remaining 15% of infra) is separately known to be low (per an earlier `gpu-cluster-optimization` finding).

### Output (abbreviated)

> **Prioritized opportunities**
>
> 1. **Route simple classification tasks to a smaller/cheaper model** — `[High savings, Medium quality risk]` — accounts for a meaningful share of the dominant 70% cost category; classification tasks are typically good candidates for smaller models. Requires `prompt-evaluation`-backed validation comparing the smaller model's classification accuracy against the current model before shipping — do not treat as a safe win until validated.
> 2. **Add caching for the summarization feature's near-duplicate queries** — `[Medium savings, Low quality risk]` — caching doesn't change output for genuinely repeated inputs, making this a lower-risk win than the model-routing change. Recommend implementing via `ai-gateway-review`'s caching guidance.
> 3. **GPU utilization improvement** — `[Medium savings, Low quality risk]` — already identified separately; re-confirming it remains a priority alongside the above, since it carries essentially no quality risk.
>
> **Overall verdict**: the model-routing change has the largest potential savings given it targets the dominant cost category, but should be sequenced after (or validated in parallel with) the lower-risk caching and GPU fixes, which can be captured with near-zero quality risk while the model-routing evaluation is conducted properly.

This example is illustrative — a real optimization depends entirely on the actual cost breakdown and workload discovered.
