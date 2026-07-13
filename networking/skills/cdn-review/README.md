# CDN Review

A vendor-agnostic CDN strategy review — cache-control policy fit, origin shielding, multi-CDN considerations, and purge/invalidation workflow safety.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our CDN strategy."
- "Is our cache-control policy right?"
- "Should we use multiple CDNs?"

## Example

### Input

Team's deployment process runs a full-site cache purge on every deploy (several times a day), with no origin shielding configured. Origin has occasionally been overwhelmed briefly right after a deploy, correlating with the purge.

### Output (abbreviated)

> **Findings**
>
> - **Full-site purge on every deploy, no origin shielding** — `[High]` — purging the entire cache several times a day means every purge is followed by a traffic spike hitting the origin directly (since everything is now a cache miss), and with no origin shielding, that spike goes straight to the origin with no buffering layer. This directly explains the observed origin overload right after deploys. Two complementary fixes: (1) switch to targeted purges of only the specific assets that changed on each deploy, rather than purging everything; (2) add origin shielding so even a purge-triggered spike is absorbed by a shield layer rather than hitting the origin with full force.
>
> **Overall verdict**
> Both fixes address the same root problem from different angles — targeted purging reduces how often you create a cache-miss spike at all, and origin shielding protects against the spikes that do still happen. Recommend implementing both, with targeted purging as the higher-priority since it addresses the root cause rather than just mitigating the symptom.

This example is illustrative — a real review depends entirely on the actual CDN configuration discovered for the target setup.
