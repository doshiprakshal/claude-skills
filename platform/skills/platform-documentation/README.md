# Platform Documentation

Reviews platform documentation for coverage, findability, and currency — whether developers can actually self-serve answers instead of asking the platform team.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our platform documentation coverage."
- "Why does everyone still ask us instead of reading the docs?"
- "Audit our platform docs for gaps."

## Example

### Input

Support-channel history over the last month shows the top 3 recurring questions are: "how do I get a new database?" (documented, but the doc is buried 4 levels deep in a wiki with no search indexing), "why did my deploy fail with error X?" (not documented anywhere), and "what's our current logging library?" (documented, but the doc describes a library that was replaced 6 months ago).

### Output (abbreviated)

> **Findings**
>
> - **"How do I get a new database?" — findability gap** — `[High]` — the answer exists but is effectively undiscoverable given its location; this is a navigation/promotion problem, not a writing problem. Move it to a prominent, searchable location (e.g., linked directly from the service catalog or a top-level docs index) rather than rewriting content that's already adequate.
> - **"Why did my deploy fail with error X?" — coverage gap** — `[High]` — no documented answer exists for a top recurring question; this needs new content, likely a troubleshooting/FAQ entry for common deploy failure modes.
> - **"What's our current logging library?" — currency gap** — `[High]` — the documented answer is actively wrong (describes a library replaced 6 months ago), which is worse than no documentation since it actively misleads readers into re-adopting a deprecated pattern. Update immediately.
>
> **Overall verdict**: all three top recurring questions have a different root cause (findability, coverage, currency) requiring three different fixes — treating this as a single "write more docs" problem would only address one of the three and leave the other two unresolved.

This example is illustrative — a real review depends entirely on the actual documentation set and support-channel history discovered.
