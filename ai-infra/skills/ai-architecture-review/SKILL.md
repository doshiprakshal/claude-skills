---
name: ai-architecture-review
description: Review the overall architecture of an AI/LLM-powered system holistically — how serving, gateway, RAG, observability, and cost/security concerns fit together as a coherent system, synthesizing across the domain's specialized skills rather than deep-diving any single one. Triggers on "review our overall ai system architecture", "assess our end-to-end ai architecture holistically", "how do all our ai infrastructure pieces fit together", "architecture review for our new ai feature".
user-invocable: true
---

# AI Architecture Review

Review the overall architecture of an AI/LLM-powered system holistically, synthesizing across serving, gateway, RAG, observability, cost, and security concerns as a coherent whole.

## When to use

- A holistic, system-wide architecture review of an AI-powered feature or platform is requested.
- Designing a new AI system and wanting an end-to-end architectural sanity check.

**Out of scope**:
- Any single component's deep-dive → `model-serving-review`, `ai-gateway-review`, `rag-architecture-review`, `ai-observability`, `ai-security-review`, `ai-cost-optimization`

## Inputs

- The system's full architecture: serving layer, gateway (if any), RAG/retrieval components (if any), observability setup, and how requests flow end-to-end.
- The system's purpose and criticality (internal tool vs. customer-facing production feature).

## Workflow

### 1. Map the end-to-end architecture

Trace a request's full path from entry point through to model response, identifying every component involved — this is the foundation for assessing whether the pieces form a coherent system or an ad hoc collection of individually-reasonable but disjointedly-assembled parts.

### 2. Assess architectural coherence

Check whether the components fit together sensibly — e.g., a gateway that doesn't actually front all traffic (cross-reference `ai-gateway-review`'s coverage check), a RAG pipeline whose retrieval quality issues would be invisible without adequate observability (cross-reference `ai-observability`), or a routing strategy with no quality monitoring feeding back into it (cross-reference `multi-model-routing`).

### 3. Assess cross-cutting concern coverage

For security, cost visibility, and observability — confirm these are actually addressed somewhere in the architecture (not necessarily deeply, that's the specialized skills' job) rather than being entirely absent, which is a more foundational finding than any single component's tuning.

### 4. Identify the weakest link given system criticality

For a customer-facing, production-critical system, apply a higher bar across every dimension than for an internal prototyping tool — explicitly calibrate findings' severity to the system's actual criticality rather than a fixed standard.

### 5. Report

An architecture map, coherence findings, cross-cutting concern coverage summary, and prioritized recommendations, each routed to the relevant specialized skill for depth, calibrated to the system's stated criticality.

## Notes

- This skill's distinct value is synthesis and coherence-checking across components, not depth in any one — always route deep findings to the appropriate specialized skill rather than re-deriving that analysis here.
- Severity calibration should reflect actual system criticality — the same architectural gap (e.g., no fallback on provider failure) is a minor note for an internal prototype and a blocker for a customer-facing production feature; always state the criticality assumption explicitly.
