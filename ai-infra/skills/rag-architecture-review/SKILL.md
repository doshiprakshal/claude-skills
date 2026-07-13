---
name: rag-architecture-review
description: Review a RAG (retrieval-augmented generation) system's overall architecture — retrieval strategy fit, chunking approach, re-ranking, and the retrieval-to-generation handoff, distinct from vector database configuration or embedding pipeline specifics. Triggers on "review our rag architecture", "why is our rag system retrieving irrelevant context", "review our retrieval and re-ranking strategy", "assess our rag system's chunking approach".
user-invocable: true
---

# RAG Architecture Review

Review a retrieval-augmented generation system's overall architecture — retrieval strategy, chunking, re-ranking, and the retrieval-to-generation handoff.

## When to use

- Reviewing a RAG system's end-to-end design, or diagnosing poor retrieval/generation quality.

**Out of scope**:
- Vector database configuration/indexing depth → `vector-database-review`
- Embedding model/pipeline specifics → `embedding-pipeline-review`
- Evaluating generated output quality directly → `prompt-evaluation`

## Inputs

- The retrieval pipeline (chunking strategy, embedding model, retrieval method, re-ranking if any).
- Representative queries and their retrieved context, especially cases where retrieval seems poor.
- How retrieved context is incorporated into the generation prompt.

## Workflow

### 1. Assess chunking strategy

Check whether document chunking size/overlap matches the actual content structure and query patterns — chunks too large dilute relevance (retrieving a lot of irrelevant surrounding text) and waste context window; chunks too small lose necessary context, splitting a coherent answer across multiple disconnected chunks.

### 2. Assess retrieval strategy fit

Check whether pure semantic (embedding-based) retrieval, keyword/lexical retrieval, or a hybrid approach is used, matching actual query characteristics — semantic retrieval alone can miss exact-match needs (specific identifiers, exact terminology); hybrid retrieval is often more robust but adds complexity worth confirming is justified.

### 3. Assess re-ranking

Check whether a re-ranking step exists after initial retrieval to improve precision on the top results actually passed to generation — initial retrieval (especially at higher top-k) often includes marginally relevant results that a re-ranker can filter, materially improving what the generation step actually sees.

### 4. Assess the retrieval-to-generation handoff

Check how retrieved chunks are formatted/incorporated into the generation prompt (ordering, source attribution, handling of no-relevant-result cases) — a system with no explicit handling for "nothing relevant was retrieved" risks hallucinated or misleading answers presented with the same confidence as well-grounded ones.

### 5. Report

Findings grouped by Chunking Strategy, Retrieval Strategy Fit, Re-Ranking, Retrieval-to-Generation Handoff, each with severity, and a diagnosis for specific poor-retrieval examples if provided.

## Notes

- When diagnosing "retrieving irrelevant context" complaints, work backward from a specific failing query through each stage (chunking → retrieval → re-ranking → handoff) rather than assuming the cause — the same symptom can originate from any of these stages, and the fix differs substantially depending on which one is actually responsible.
- Explicit handling for "no sufficiently relevant context was retrieved" is a commonly missing safeguard — without it, the generation step will still attempt an answer using whatever was retrieved, however weakly relevant, producing a confidently-stated but poorly-grounded response.
