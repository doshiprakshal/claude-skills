---
name: prompt-evaluation
description: Design or review an evaluation methodology for prompt/model output quality — building a representative test set, choosing appropriate evaluation methods (exact match, LLM-as-judge, human review), and detecting regressions between versions, distinct from ad hoc manual spot-checking. Triggers on "help us evaluate our prompt quality systematically", "how do we detect regressions when we change our prompt or model", "design an evaluation set for our llm feature", "should we use llm-as-judge for this evaluation".
user-invocable: true
---

# Prompt Evaluation

Design or review a systematic evaluation methodology for prompt/model output quality, replacing ad hoc spot-checking with a repeatable, regression-detecting process.

## When to use

- Building or reviewing an evaluation methodology for prompt or model output quality.
- Changing a prompt, model, or model version and needing to detect quality regressions before shipping.

**Out of scope**:
- Reducing token usage/cost of prompts → `token-usage-analysis`, `context-window-optimization`
- The RAG retrieval pipeline's own quality (as opposed to the generated output given good retrieval) → `rag-architecture-review`

## Inputs

- The prompt/feature being evaluated and its intended behavior.
- Any existing test/evaluation set, or representative real inputs to build one from.
- What quality dimensions matter (correctness, tone, format adherence, safety, etc.).

## Workflow

### 1. Build a representative test set

Construct a test set covering the actual distribution of real inputs, including edge cases and known-difficult examples, not just easy/typical cases — a test set skewed toward easy cases will systematically fail to catch regressions that matter most.

### 2. Choose evaluation method(s) per quality dimension

- **Exact/structured match** — for outputs with a verifiable correct answer or required format (e.g., valid JSON, a specific classification), use deterministic checking — cheapest and most reliable where applicable.
- **LLM-as-judge** — for more subjective quality dimensions (helpfulness, tone, coherence) where deterministic checking isn't feasible, use another model to score outputs against defined criteria — cross-reference that judge-model consistency itself should be spot-checked against human judgment periodically, since an unvalidated judge can silently drift or have blind spots.
- **Human review** — reserve for a sample of cases, especially safety-critical or highly subjective ones, or for periodically validating the LLM-as-judge approach's alignment with human judgment.

### 3. Establish a baseline and regression detection

Run the evaluation against the current production prompt/model to establish a baseline score, so future changes can be compared against it rather than evaluated in isolation — a regression is defined relative to this baseline, not an absolute quality bar.

### 4. Integrate into the change process

Recommend running the evaluation set as a required step before any prompt/model change ships, similar in spirit to a test suite gating a code change — this turns evaluation from an occasional manual check into a systematic regression gate.

### 5. Report

The recommended test set composition, evaluation method(s) per quality dimension, baseline scores if computed, and how to integrate this into the prompt/model change workflow.

## Notes

- An LLM-as-judge evaluator should itself be periodically validated against human judgment — treat "does the judge model's scoring actually align with what humans would say" as an ongoing question, not a one-time setup decision, since judge-model behavior can also drift with model updates.
- A test set skewed toward easy, typical cases provides false confidence — deliberately include known-difficult and edge-case examples, since regressions often show up there first while aggregate scores on easy cases stay flat.
