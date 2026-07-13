# TensorRT-LLM Review

Reviews a TensorRT-LLM deployment — whether the compilation overhead is justified, precision/quantization choice, build-time shape configuration, and in-flight batching.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our TensorRT-LLM configuration."
- "Is our TensorRT-LLM engine build optimized correctly?"
- "Should we use TensorRT-LLM for this model?"

## Example

### Input

Team rebuilds their TensorRT-LLM engine roughly weekly as they iterate on fine-tuning experiments. Engine is built with max batch size of 8 and max sequence length of 2048; production traffic now regularly sees batches up to 24 and occasional sequences up to 4096, both exceeding the built engine's limits and causing request failures/truncation.

### Output (abbreviated)

> **Compilation overhead justification**: `[Flag]` — weekly rebuilds driven by active fine-tuning iteration is a fairly high change frequency for a framework whose main value proposition assumes a stable, compiled configuration; each rebuild also risks the exact shape-mismatch problem seen below. Recommend evaluating whether vLLM (which doesn't require a build step per model/config change) would better fit the current experimentation-heavy phase, reserving a TensorRT-LLM migration for once the model/config has stabilized.
>
> **Build-time shape mismatch** — `[Blocker]` — the compiled engine's max batch size (8) and max sequence length (2048) are both below actual observed production traffic (batches up to 24, sequences up to 4096), causing request failures/truncation right now. This requires a full engine rebuild to fix, not a runtime setting — rebuild with shape limits that include headroom above current observed peaks, and add monitoring to catch this drift earlier next time.
>
> **Overall verdict**: the build-time shape mismatch is an active production issue and should be fixed immediately via rebuild; the broader compilation-overhead question is worth revisiting given the current experimentation cadence, since it directly caused this specific incident.

This example is illustrative — a real review depends entirely on the actual engine configuration and traffic patterns discovered.
