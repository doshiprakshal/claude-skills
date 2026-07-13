---
name: context-window-optimization
description: Optimize context window usage — what's actually included in the prompt, redundancy removal, and context ordering/placement effects on model attention, distinct from token-usage cost analysis or RAG retrieval strategy itself. Triggers on "optimize our context window usage", "are we wasting context window space", "does the order of information in our prompt matter", "review what we're including in our prompt context".
user-invocable: true
---

# Context Window Optimization

Optimize what's actually included in the context window and how it's arranged, independent of retrieval strategy or cost accounting.

## When to use

- Reviewing what's included in a prompt's context window for redundancy, relevance, or effective arrangement.

**Out of scope**:
- Cost/token-usage accounting across requests → `token-usage-analysis`
- The retrieval strategy determining what candidate content exists to potentially include → `rag-architecture-review`

## Inputs

- Representative full prompts as actually sent to the model, including all injected context.
- The source and purpose of each major context component (retrieved documents, conversation history, system instructions, few-shot examples).

## Workflow

### 1. Audit context composition

Break down what's actually in the context window by source/purpose (system prompt, retrieved documents, conversation history, few-shot examples) and assess whether each component is still necessary and appropriately sized — context windows accumulate cruft over time as features are added incrementally without revisiting earlier inclusions.

### 2. Identify redundancy

Check for duplicated or near-duplicated content across components (e.g., the same information appearing in both a system prompt and a retrieved document, or conversation history repeating information already in a retrieved document) — redundancy wastes context space without adding information.

### 3. Assess conversation history handling

For multi-turn interactions, check whether full history is included indefinitely (growing unboundedly and eventually consuming most of the context budget) versus a bounded/summarized approach (e.g., keeping recent turns verbatim, summarizing older ones) — unbounded history inclusion is a common and increasingly costly oversight as conversations lengthen.

### 4. Assess context ordering/placement

Consider whether the order and placement of information in the context affects the model's attention to it — content placed at the very beginning or end of a long context is often attended to more reliably than content buried in the middle ("lost in the middle" effect); check whether the most important instructions/information are positioned advantageously rather than arbitrarily.

### 5. Report

A context composition breakdown, redundancy findings, conversation history handling assessment, and ordering/placement recommendations, each with severity.

## Notes

- Context window usage tends to grow through incremental, well-intentioned additions (one more few-shot example, one more piece of retrieved context) that are individually reasonable but collectively bloat the prompt — periodically audit the full composition rather than only reviewing each addition in isolation.
- The "lost in the middle" effect (content in the middle of a long context receiving less effective attention than content at the start or end) is a real and often underappreciated factor — for critical instructions, consider placement, not just presence, especially as context length grows.
