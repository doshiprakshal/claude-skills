# Token Usage Analysis

Analyzes token usage breakdown — input vs. output, per-feature/team attribution, and waste patterns like retries — as a diagnostic precursor to optimization.

See `SKILL.md` for the full workflow.

## How to invoke

- "Analyze our token usage breakdown."
- "Which feature is driving our highest token usage?"
- "Why is this specific request using so many tokens?"

## Example

### Input

Aggregate token usage: 80% input tokens, 20% output tokens. Per-feature breakdown shows a document-summarization feature accounts for 55% of total usage. Deep-diving a representative request shows the input includes the full source document (average 8000 tokens) plus a 1500-token system prompt with several worked examples. Retry rate for this feature is 12% (requests that fail validation and get automatically retried with the same input).

### Output (abbreviated)

> **Input/output breakdown**: 80/20 split strongly points to input-side (context/prompt) content as the primary usage driver, not verbose model output — optimization effort should focus there first.
>
> **Feature attribution**: document-summarization accounts for the majority (55%) of total usage — the highest-leverage target for any optimization effort.
>
> **Deep-dive**: the 8000-token source document dominates the request's input, with the 1500-token system prompt (including worked examples) as a secondary contributor. Route to `context-window-optimization` to assess whether the full document needs to be included verbatim versus a retrieved/chunked subset, and whether all worked examples are needed on every request.
>
> **Waste pattern identified**: `[High]` — a 12% retry rate on this feature means roughly 1 in 8 successful outcomes is actually consuming input tokens twice (original attempt + retry), a meaningful multiplier on top of the already-large per-request input size. Investigate why validation failures trigger retries with identical input — fixing the underlying validation failure cause would compound with any context-size reduction.
>
> **Overall verdict**: the summarization feature's large document input and its retry rate are the two highest-leverage findings — both should be addressed, with the retry-rate fix being comparatively lower-effort and worth prioritizing first.

This example is illustrative — a real analysis depends entirely on the actual usage data discovered.
