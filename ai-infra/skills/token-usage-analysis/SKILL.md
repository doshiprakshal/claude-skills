---
name: token-usage-analysis
description: Analyze token usage breakdown per request/feature — input vs. output tokens, what's driving high per-request usage, and per-feature/per-team attribution, as a diagnostic precursor to cost or context optimization. Triggers on "analyze our token usage breakdown", "which feature is driving our highest token usage", "why is this specific request using so many tokens", "break down our input vs output token consumption".
user-invocable: true
---

# Token Usage Analysis

Analyze token usage breakdown per request/feature to identify what's actually driving consumption, as a diagnostic step feeding into cost or context optimization.

## When to use

- Understanding what's driving token consumption, at the request or feature/team level.

**Out of scope**:
- Deciding what to do about high context usage (removing redundancy, restructuring) → `context-window-optimization`
- Holistic cost prioritization across model selection/caching/GPU together → `ai-cost-optimization`

## Inputs

- Token usage logs/metrics, ideally broken down by input vs. output and by feature/team/application.
- Representative high-usage requests for detailed breakdown.

## Workflow

### 1. Break down input vs. output tokens

Separate input (prompt) tokens from output (completion) tokens in the usage data — the optimization lever differs substantially between the two (input token growth usually traces to context/RAG/history bloat; output token growth traces to response length, verbosity, or repeated generation like retries).

### 2. Attribute usage by feature/team

Break down aggregate usage by consuming feature or team, identifying the actual concentration of usage — token/cost optimization effort should focus on the largest contributors, not be spread evenly across all features regardless of their actual usage share.

### 3. Deep-dive representative high-usage requests

For the top contributor(s), examine representative individual requests to see exactly what's consuming tokens — a large system prompt, verbose retrieved context, long conversation history, or unexpectedly verbose model output are each diagnosed differently.

### 4. Check for waste patterns

Look for retry/error-driven token waste (failed requests that still consumed tokens and were retried, multiplying usage for the same logical request) and redundant generation (e.g., a model asked to repeat back input content unnecessarily in its output).

### 5. Report

An input/output breakdown, per-feature/team attribution, deep-dive findings on the top contributor(s), and identified waste patterns, feeding into `context-window-optimization` (for input-side findings) or output-shaping prompt changes (for output-side findings).

## Notes

- Always separate input and output token analysis — they have different causes and different fixes, and lumping them into a single "tokens per request" number obscures which lever actually matters for the specific usage pattern found.
- Retry-driven token waste (a failed or unsatisfactory response triggering a retry that re-consumes similar input tokens) is a commonly overlooked contributor — check error/retry rates alongside raw token counts, since a high retry rate can silently multiply effective token cost per successful outcome.
