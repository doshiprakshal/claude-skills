# Multi-Model Routing

Designs or reviews a multi-model routing strategy — request classification, routing logic reliability, fallback behavior, and per-route quality monitoring.

See `SKILL.md` for the full workflow.

## How to invoke

- "Design a multi-model routing strategy."
- "Should we route different request types to different models?"
- "Review our model fallback behavior."

## Example

### Input

Team wants to route simple FAQ-style queries to a cheaper model and complex multi-step reasoning queries to a more capable one, using a keyword-based heuristic to classify requests. No fallback exists currently — if the primary model provider has an outage, requests fail outright. No per-route quality monitoring exists.

### Output (abbreviated)

> **Classification approach review**: `[Flag]` — a keyword-based heuristic is a coarse proxy for actual complexity and risks misrouting some genuinely complex queries to the cheaper model based on superficial keyword match, which would be a quality regression, not just a missed savings. Recommend validating this classifier's accuracy against a labeled sample (cross-reference `prompt-evaluation`) before relying on it, and consider a lightweight model-based classifier as a more robust alternative if keyword accuracy proves insufficient.
>
> **Fallback behavior — missing** — `[High]` — no fallback currently exists; a primary provider outage causes outright request failure rather than degraded-but-functional service via an alternative model. Recommend defining a fallback model per route, explicitly accepting the quality/cost tradeoff of the fallback path, rather than leaving this unhandled.
>
> **Per-route quality monitoring — missing** — `[Medium]` — once routing is live, there's currently no way to detect if the cheaper-model route is producing worse outcomes than expected for its assigned request types. Recommend tagging quality/feedback metrics by route, not just in aggregate.
>
> **Overall verdict**: validate the classification approach before shipping — a routing strategy that saves cost but silently misroutes complex queries to an inadequate model would be a net-negative outcome, and this is currently unverified.

This example is illustrative — a real design/review depends entirely on the actual request types, models, and routing logic involved.
