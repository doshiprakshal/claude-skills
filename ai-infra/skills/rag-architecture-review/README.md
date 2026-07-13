# RAG Architecture Review

Reviews a RAG system's overall architecture — chunking strategy, retrieval strategy fit, re-ranking, and the retrieval-to-generation handoff.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our RAG architecture."
- "Why is our RAG system retrieving irrelevant context?"
- "Assess our RAG system's chunking approach."

## Example

### Input

Documents are chunked at a fixed 2000 tokens with no overlap, splitting many answers across two adjacent chunks. Retrieval is pure semantic (embedding similarity), top-k=10, with no re-ranking step — all 10 chunks are passed directly into the generation prompt regardless of individual relevance. A user query for a specific error code (e.g., "ERR-4471") returns semantically similar but not exact-match results, missing the document that literally contains that code.

### Output (abbreviated)

> **Findings**
>
> - **Fixed chunking with no overlap splits answers across chunks** — `[High]` — a query needing content spanning a chunk boundary may retrieve only one of the two relevant chunks, or retrieve them non-adjacently ranked, degrading the generation step's ability to form a complete answer. Recommend adding overlap (e.g., 10-15% of chunk size) so boundary-spanning content appears in full within at least one chunk.
> - **Pure semantic retrieval misses exact-identifier queries** — `[High]` — the specific failing example (searching for "ERR-4471") demonstrates a known limitation of semantic-only retrieval: exact identifiers/codes don't always cluster meaningfully in embedding space the way natural-language concepts do. Recommend hybrid retrieval combining semantic search with keyword/lexical matching (e.g., BM25) specifically to catch exact-match cases like error codes.
> - **No re-ranking, all top-10 passed directly to generation** — `[Medium]` — at top-k=10 with pure semantic retrieval, some results are likely only marginally relevant; passing all of them equally weighted into the generation prompt dilutes the signal and wastes context window. Add a re-ranking step to filter/reorder before generation.
>
> **Diagnosis for the ERR-4471 example**: root cause is the retrieval strategy stage specifically (pure semantic, no lexical fallback) — the chunking and re-ranking issues are real but don't explain this particular failure.
>
> **Overall verdict**: the hybrid-retrieval gap is the most directly responsible for the reported irrelevant-context complaint; the chunking overlap fix is a good complementary improvement but addresses a different failure mode.

This example is illustrative — a real review depends entirely on the actual RAG pipeline and failing queries discovered.
