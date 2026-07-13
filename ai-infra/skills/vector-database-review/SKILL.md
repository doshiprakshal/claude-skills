---
name: vector-database-review
description: Review a vector database's configuration — index type/parameters, metadata filtering strategy, and scaling behavior, distinct from the broader RAG pipeline design or embedding generation itself. Triggers on "review our vector database configuration", "is our vector index tuned correctly for recall and latency", "review our metadata filtering strategy in the vector store", "why is our vector search slow or low-recall".
user-invocable: true
---

# Vector Database Review

Review a vector database's configuration — index type/parameters, metadata filtering, and scaling behavior.

## When to use

- Reviewing vector database indexing, filtering, or performance/recall tuning specifically.

**Out of scope**:
- Overall RAG pipeline design (chunking, re-ranking, retrieval strategy choice) → `rag-architecture-review`
- Embedding model choice and generation pipeline → `embedding-pipeline-review`

## Inputs

- Vector index type and parameters (e.g., HNSW parameters, IVF settings).
- Metadata filtering usage alongside vector search.
- Query latency and recall/accuracy metrics if available.

## Workflow

### 1. Assess index type and parameter fit

Check whether the index type (e.g., HNSW, IVF, flat/brute-force) and its parameters match the actual dataset size and recall/latency requirements — approximate nearest neighbor index parameters (like HNSW's `ef_search`/`ef_construction`) trade recall for speed, and a default configuration may not match the actual accuracy bar the application needs.

### 2. Assess metadata filtering strategy

Check how metadata filters (e.g., filtering by tenant, document type, date range) interact with vector search — pre-filtering vs. post-filtering has significant performance and correctness implications (post-filtering after ANN search can return fewer results than requested if many top-k candidates get filtered out, silently under-returning) — confirm the chosen approach fits the actual filter selectivity.

### 3. Assess scaling behavior

Check whether the vector database's scaling approach (sharding, replication) matches the dataset size and query volume trajectory — some index types have different scaling characteristics (e.g., index build/update cost) that matter more as data grows.

### 4. Assess update/freshness handling

Check how the index handles updates/deletes to underlying documents — some ANN index types handle updates less efficiently than pure inserts, and a system with frequently-changing source documents needs this evaluated explicitly rather than assumed to be free.

### 5. Report

Findings grouped by Index Type/Parameters, Metadata Filtering Strategy, Scaling Behavior, Update/Freshness Handling, each with severity.

## Notes

- Post-filtering (search first, then discard non-matching metadata results) silently under-returning results when filters are selective is a common and easy-to-miss correctness bug — always check which filtering approach is used and whether it fits the actual filter selectivity in this workload.
- ANN index recall/speed tradeoff parameters are frequently left at defaults without validating whether the resulting recall actually meets the application's accuracy bar — recommend measuring actual recall against a labeled or spot-checked query set rather than assuming default parameters are adequate.
