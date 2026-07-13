# Prompt Evaluation

Designs or reviews a systematic evaluation methodology for prompt/model output quality — representative test sets, evaluation method selection, and regression detection.

See `SKILL.md` for the full workflow.

## How to invoke

- "Help us evaluate our prompt quality systematically."
- "How do we detect regressions when we change our prompt or model?"
- "Design an evaluation set for our LLM feature."

## Example

### Input

A customer support summarization feature currently has no formal evaluation — quality is checked by an engineer manually reading a handful of outputs before shipping a prompt change. The team wants to switch to a cheaper model and needs to confirm quality doesn't regress.

### Output (abbreviated)

> **Recommended test set**: build a set of ~50-100 representative support conversations, deliberately including: typical cases (majority), known-difficult cases (very long threads, ambiguous customer intent, multiple issues in one conversation), and a few historical cases that previously produced poor summaries if any are documented.
>
> **Evaluation methods**:
> - **Structured check**: confirm every output is valid, well-formed summary text within the required length constraint — deterministic, catches format regressions cheaply.
> - **LLM-as-judge**: score each summary on accuracy (does it capture the actual issue/resolution) and completeness against the source conversation, using a defined rubric — appropriate here since "is this a good summary" is subjective and not deterministically checkable.
> - **Human review**: sample 15-20% of cases for human validation, both to catch what the judge might miss and to periodically confirm the judge's scoring aligns with human judgment.
>
> **Baseline**: run the full test set against the current (more expensive) model first to establish baseline scores, then run the same set against the candidate cheaper model and compare — a regression is a meaningful score drop relative to this baseline, not an absolute threshold.
>
> **Process integration**: recommend this evaluation set run automatically before any future prompt or model change ships, not just for this one-time model switch — turning today's one-off comparison into a standing regression gate.

This example is illustrative — a real evaluation design depends entirely on the actual feature, quality dimensions, and available test data.
