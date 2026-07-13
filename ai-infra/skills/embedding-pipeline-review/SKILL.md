---
name: embedding-pipeline-review
description: Review an embedding generation pipeline — model choice fit, batch/latency efficiency, versioning consistency between index-time and query-time embeddings, and re-embedding strategy on model changes, distinct from the vector store or RAG pipeline design around it. Triggers on "review our embedding pipeline", "did we accidentally mix embeddings from two different model versions", "review our embedding model choice", "how should we handle re-embedding when we change embedding models".
user-invocable: true
---

# Embedding Pipeline Review

Review an embedding generation pipeline — model choice, generation efficiency, and version consistency between what was indexed and what's queried.

## When to use

- Reviewing embedding model choice, generation pipeline efficiency, or version consistency.
- Diagnosing unexpectedly poor retrieval that might trace to an embedding mismatch rather than the retrieval logic itself.

**Out of scope**:
- Overall RAG retrieval/chunking/re-ranking strategy → `rag-architecture-review`
- Vector index configuration once embeddings are stored → `vector-database-review`

## Inputs

- The embedding model(s) in use, for both indexing and query-time embedding generation.
- Pipeline architecture (batch vs. real-time generation, any caching).
- History of embedding model changes and whether re-embedding was performed.

## Workflow

### 1. Assess model choice fit

Check whether the embedding model matches the domain and task (e.g., a general-purpose embedding model may underperform a domain-specific or task-tuned one for specialized content) and dimension/cost tradeoffs are deliberate.

### 2. Assess index-time vs. query-time consistency

**Critically**, confirm the exact same embedding model (and version) is used to embed both the indexed documents and incoming queries — a mismatch here (e.g., documents embedded with model version A, queries embedded with version B after an upgrade) silently degrades retrieval quality without any obvious error, since embeddings from different models/versions aren't guaranteed to be comparable in the same vector space.

### 3. Assess re-embedding strategy on model changes

Check whether there's a defined process for re-embedding the full corpus when the embedding model changes — an embedding model upgrade without a full re-embedding of existing indexed content leaves the index in a mixed, inconsistent state (the version-consistency problem above, but for the whole corpus rather than a temporary window).

### 4. Assess generation efficiency

Check whether embedding generation is batched efficiently (for bulk indexing) and whether query-time embedding generation latency is acceptable for the retrieval path's overall latency budget.

### 5. Report

Findings grouped by Model Choice Fit, Index/Query Consistency, Re-Embedding Strategy, Generation Efficiency, each with severity — treating any detected version mismatch as the highest-priority finding.

## Notes

- An index/query embedding model mismatch is one of the most severe and hardest-to-diagnose RAG failure modes, since it produces degraded-but-not-obviously-broken retrieval rather than an error — always check model/version consistency explicitly as an early step when diagnosing unexplained retrieval quality issues, even if the reported symptom initially looks like a chunking or retrieval-strategy problem.
- A full re-embedding of the corpus after any embedding model change should be treated as a required step, not optional — flag any embedding model upgrade that didn't include a full corpus re-embedding as leaving the index in an inconsistent state.
