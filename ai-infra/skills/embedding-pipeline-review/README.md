# Embedding Pipeline Review

Reviews an embedding generation pipeline — model choice fit, index/query version consistency, re-embedding strategy, and generation efficiency.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our embedding pipeline."
- "Did we accidentally mix embeddings from two different model versions?"
- "How should we handle re-embedding when we change embedding models?"

## Example

### Input

The team upgraded their embedding model 6 weeks ago for query-time embedding generation (to get better quality), but the existing indexed document corpus was never re-embedded — it still contains embeddings from the previous model version. Retrieval quality has noticeably degraded since the upgrade, though no errors are occurring.

### Output (abbreviated)

> **Findings**
>
> - **Index/query embedding model mismatch — confirmed** — `[Blocker]` — queries are now embedded with the new model while the indexed corpus still holds embeddings from the old model; these two embedding spaces aren't guaranteed to be comparable, meaning vector similarity search is now comparing apples to oranges for every single query. This directly explains the reported retrieval quality degradation since the upgrade — this is very likely the root cause, not a chunking or retrieval-strategy issue.
> - **No re-embedding step was performed as part of the model upgrade** — `[Blocker]` — this is the underlying process gap that caused the mismatch above; a full corpus re-embedding should be a required, non-optional step of any embedding model change.
>
> **Recommended fix**: re-embed the entire existing document corpus with the new embedding model and re-index, so both index-time and query-time embeddings are consistently from the new model. Until this completes, consider reverting query-time embedding to the old model to restore consistency (at the cost of the quality improvement the upgrade was meant to provide) rather than continuing to operate with a mismatched index.
>
> **Overall verdict**: this is a textbook index/query embedding mismatch — the symptom (degraded-but-not-broken retrieval, no errors) is exactly what this failure mode produces, and it should be checked early whenever retrieval quality degrades shortly after any embedding-model-related change.

This example is illustrative — a real review depends entirely on the actual embedding pipeline and change history discovered.
