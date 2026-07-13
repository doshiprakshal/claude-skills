# Developer Experience Audit

Audits developer experience friction across the platform's full lifecycle, grounded in real usage data — onboarding, inner-loop speed, and where developers actually get stuck.

See `SKILL.md` for the full workflow.

## How to invoke

- "Audit our developer experience."
- "Why are developers frustrated with our platform?"
- "How long does it take a new engineer to ship their first change?"

## Example

### Input

Time-to-first-production-deploy for new hires averages 12 days. CI pipeline for the average service takes 18 minutes per run, and developers report running it 8-10 times per day during active development. A recent survey's top complaint by volume was "CI is slow," not onboarding difficulty.

### Output (abbreviated)

> **Developer journey map**
>
> - **Onboarding (first-time friction)**: 12 days to first prod deploy — notable, but affects each developer once.
> - **Inner loop (recurring friction)**: 18-minute CI runs × 8-10 runs/day per active developer — this is the dominant aggregate cost. At even a conservative estimate, this represents roughly 2-3 hours of daily wait time per active developer across the org, dwarfing the one-time onboarding cost in aggregate impact.
>
> **Findings**
>
> - **CI pipeline duration is the highest-leverage friction point** — `[High]` — the survey data (top complaint by volume) corroborates the quantitative estimate: this is both the most frequently-hit and most costly-in-aggregate friction source, despite onboarding time being the more "visible" metric. Recommend `github-cicd/build-performance` for a deep pipeline-speed investigation.
> - **12-day onboarding time** — `[Medium]` — real, but lower aggregate priority than CI speed given it's a one-time cost per hire versus a daily cost per active developer.
>
> **Overall verdict**: prioritize CI pipeline speed over further onboarding-flow polish — the data clearly shows recurring inner-loop friction outweighs first-time friction in aggregate cost here, even though onboarding time is the more commonly assumed priority.

This example is illustrative — a real audit depends entirely on the actual usage data and developer feedback gathered.
