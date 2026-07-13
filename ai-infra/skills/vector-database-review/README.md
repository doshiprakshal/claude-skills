# Vector Database Review

Reviews a vector database's configuration — index type/parameters, metadata filtering strategy, scaling behavior, and update/freshness handling.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our vector database configuration."
- "Is our vector index tuned correctly for recall and latency?"
- "Why is our vector search slow or low-recall?"

## Example

### Input

Vector search uses HNSW with default parameters. Queries filter by `tenant_id` using post-filtering (search top-k=20 candidates, then discard non-matching tenants in application code). Some tenants have very few documents relative to others; those tenants' queries are frequently returning fewer than the requested number of results even though sufficient matching documents exist in the underlying data.

### Output (abbreviated)

> **Findings**
>
> - **Post-filtering causing under-returned results for low-density tenants** — `[High]` — with top-k=20 candidates retrieved before filtering, a tenant whose documents are a small fraction of the total dataset will frequently have most or all of the top-20 semantically-nearest results belong to *other* tenants, leaving few or none for this tenant after filtering — even when that tenant has plenty of genuinely relevant documents that just weren't in the unfiltered top-20. Switch to pre-filtering (restricting the ANN search itself to the tenant's documents) if the vector database supports it, or significantly increase top-k before filtering as a partial mitigation.
> - **Default HNSW parameters, recall not measured** — `[Medium]` — no evidence the default `ef_search` value has been validated against the application's actual recall requirements. Recommend measuring recall against a spot-checked query set and tuning `ef_search` if the accuracy bar isn't currently met.
>
> **Overall verdict**: the post-filtering issue is the more severe and directly explains the specific complaint about low-density tenants receiving fewer results than expected — prioritize this over general index parameter tuning.

This example is illustrative — a real review depends entirely on the actual vector database configuration and data distribution discovered.
