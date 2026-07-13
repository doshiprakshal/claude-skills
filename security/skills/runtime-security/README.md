# Runtime Security

Reviews runtime threat detection and enforcement — coverage, rule tuning, false-positive sources, and response integration.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our runtime security monitoring setup."
- "Are our Falco rules tuned correctly?"
- "Why is our runtime security tool generating so many false positives?"

## Example

### Input

Falco is deployed cluster-wide. The dominant source of alerts (about 70% of daily volume) is the default "Terminal shell in container" rule, which fires every time an engineer runs `kubectl exec` for legitimate debugging — a common, accepted practice on this team. Alerts go to a Slack channel that's largely ignored due to volume.

### Output (abbreviated)

> **Findings**
>
> - **Coverage**: cluster-wide deployment confirmed — no gap here.
> - **Dominant noise source: "Terminal shell in container" rule firing on legitimate debug workflow** — `[High]` — this single rule accounts for ~70% of alert volume and is firing on an accepted, routine practice rather than genuine anomalous behavior, which is very likely why the alert channel is being ignored. **Recommendation**: don't disable the rule outright (it has real value for detecting an actual attacker gaining shell access) — instead, scope an exception for the specific, known debug access pattern (e.g., a specific service account or exec context used for legitimate debugging), so unexpected shell access still alerts while routine debugging doesn't.
> - **Response integration**: alerts reach Slack but are effectively ignored due to volume — `[High, consequence of the above]` — a genuine detection is currently likely to be missed in the noise. Expect this to resolve significantly once the dominant noise source is tuned.
>
> **Overall verdict**: this is a single, high-leverage tuning fix — narrowing the shell-detection rule to exclude the known legitimate debug pattern should cut alert volume dramatically and make the channel usable again for genuine detections.

This example is illustrative — a real review depends entirely on the actual rule configuration and alert history discovered.
