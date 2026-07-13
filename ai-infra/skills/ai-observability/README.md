# AI Observability

Reviews observability coverage specific to AI/LLM workloads — prompt/response logging, production quality/drift monitoring, model-version tagging, and user feedback capture.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our AI observability coverage."
- "Are we logging prompts and responses for debugging?"
- "How would we detect a model quality regression in production?"

## Example

### Input

Prompts/responses are not logged at all (only aggregate latency and token count metrics exist). No production quality monitoring exists beyond pre-deployment evaluation runs. Metrics aren't tagged by model version — a recent gradual rollout to a new model version is blended into the same aggregate latency/error dashboards as the previous version.

### Output (abbreviated)

> **Findings**
>
> - **No prompt/response logging** — `[High]` — when a user or support team reports a specific bad response, there's currently no way to retrieve what was actually sent/generated to investigate. Recommend logging prompts and responses (with appropriate redaction/retention policy for sensitive data) at minimum for a sampled subset if full logging isn't feasible.
> - **No production quality/drift monitoring** — `[High]` — quality is only checked at pre-deployment evaluation time; nothing would detect a regression that only manifests with real production traffic diversity after shipping. Recommend adding a sampled LLM-as-judge or user-feedback-based signal on live traffic.
> - **Metrics not tagged by model version, currently masking a live rollout** — `[High]` — the ongoing gradual rollout to a new model version has no way to be isolated in current dashboards; if the new version has degraded latency or quality, it would currently be invisible until diluted enough to shift the blended aggregate. Add model-version tagging to all AI-specific metrics immediately, given the active rollout.
>
> **Overall verdict**: the missing model-version tagging is the most urgent given there's an active rollout right now that this gap directly affects — the other two are foundational gaps that should be addressed regardless of any specific in-flight change.

This example is illustrative — a real review depends entirely on the actual observability setup discovered.
