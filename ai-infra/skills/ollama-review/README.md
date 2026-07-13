# Ollama Review

Reviews an Ollama deployment — fit for purpose (including whether it's been outgrown), quantization choice, resource/concurrency handling, and model management practices.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our Ollama setup."
- "Is Ollama appropriate for our production workload?"
- "Why is Ollama slow under concurrent requests?"

## Example

### Input

Ollama was originally set up for internal prototyping with a handful of users. It's now serving a customer-facing internal tool with growing usage — currently around 50 concurrent users reporting slow response times during peak hours. The model in use is a 4-bit quantized variant, chosen originally "because it was faster to download," with no evaluation of output quality since. Models are pulled with the `latest` tag, re-pulled periodically.

### Output (abbreviated)

> **Fit-for-purpose assessment**: `[Flag — likely outgrown]` — Ollama was appropriate for its original prototyping use case, but 50 concurrent users on a customer-facing tool is well beyond what it's designed to handle efficiently; the reported slowness under concurrent load is a direct symptom of this mismatch, not primarily a tuning problem. Recommend evaluating a migration to `vllm-review`-covered infrastructure for this specific workload, given its current scale and production-facing nature.
>
> **Quantization choice unvalidated** — `[High]` — the 4-bit quantization was chosen for download convenience, not evaluated for output quality; recommend running `prompt-evaluation` against representative prompts comparing quantized vs. full-precision output before continuing to rely on this choice at production scale, since accuracy issues could be silently degrading the tool's usefulness.
>
> **Model pulled via `latest` tag** — `[Medium]` — re-pulling `latest` periodically means model behavior can change without an explicit, reviewed decision to update; pin to a specific version and update deliberately.
>
> **Overall verdict**: the concurrency/slowness issue is best understood as an early warning that this workload has outgrown Ollama's intended use case, not primarily a configuration tuning problem — recommend prioritizing the migration assessment over further Ollama-specific tuning.

This example is illustrative — a real review depends entirely on the actual Ollama configuration and workload scale discovered.
