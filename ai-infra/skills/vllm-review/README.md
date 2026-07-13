# vLLM Review

Reviews a vLLM deployment's configuration — continuous batching effectiveness, KV cache sizing, tensor parallelism, and quantization choice.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our vLLM configuration."
- "Is our vLLM KV cache sized correctly?"
- "Should we use tensor parallelism for our vLLM deployment?"

## Example

### Input

A 7B model served via vLLM on a single A100 (80GB). `gpu_memory_utilization` is set to 0.5 (conservative, leaving significant memory unused). `max_num_seqs` is set to 16. Observed request concurrency during peak traffic regularly reaches 40+ simultaneous requests, with requests queueing and increased latency during these periods. `max_model_len` is configured at 32768, though actual observed request lengths rarely exceed 4096 tokens.

### Output (abbreviated)

> **Findings**
>
> - **`gpu_memory_utilization` conservatively set to 0.5** — `[High]` — leaves roughly half of the 80GB GPU's memory unused for KV cache, directly limiting achievable batch size and concurrency. Increase toward a higher fraction (e.g., 0.85-0.9), leaving headroom for activation memory, and monitor for OOM.
> - **`max_num_seqs` of 16, below observed peak concurrency of 40+** — `[High]` — this artificially caps batching below actual demand, causing the observed queueing/latency during peak traffic. Increase `max_num_seqs`, which should now have room given the KV cache fix above.
> - **`max_model_len` of 32768 far exceeds actual usage (rarely over 4096)** — `[Medium]` — the configured max reduces effective KV cache capacity available per request slot, since vLLM reserves capacity based on the configured max. Reducing to a more realistic value (e.g., 8192, with headroom) would free up KV cache space for more concurrent requests.
>
> **Overall verdict**: all three findings compound the same underlying issue — configuration is currently more conservative than the workload needs across memory, batching, and context length, directly explaining the observed peak-traffic queueing. Recommend addressing the KV cache and `max_num_seqs` settings together, since they interact directly.

This example is illustrative — a real review depends entirely on the actual vLLM configuration and workload metrics discovered.
