# Platform Roadmap

Sequences and prioritizes a platform team's roadmap from identified gaps — balancing impact, effort, dependency ordering, and hard constraints.

See `SKILL.md` for the full workflow.

## How to invoke

- "Help us prioritize our platform roadmap."
- "What should our platform team work on next?"
- "Build a platform roadmap from these findings."

## Example

### Input

Candidate items: (1) CI pipeline speed improvement — high impact (hit daily by every developer), medium effort. (2) Cost allocation for shared cluster resources — medium impact, medium effort. (3) Automate team onboarding — high impact given stated 2x growth plan, low effort. (4) A compliance-mandated audit logging gap with a fixed deadline in 6 weeks, moderate effort.

### Output (abbreviated)

> **Roadmap**
>
> **Immediate (constraint-driven)**: Audit logging gap — `[Deadline: 6 weeks]` — sequenced first not because it scores highest on impact/effort alone, but because it has a fixed external compliance deadline; flagged explicitly as constraint-driven rather than priority-driven.
>
> **Near-term (highest impact/effort ratio)**: Automate team onboarding — high impact (directly addresses the scaling bottleneck identified for the coming growth), low effort — the strongest impact-per-effort candidate available and should follow immediately after the compliance item.
>
> **Near-term**: CI pipeline speed — high impact (daily, org-wide friction) but medium effort; sequenced after onboarding automation given onboarding's lower effort for comparable impact, not because CI speed matters less.
>
> **Mid-term**: Cost allocation for shared resources — medium impact, medium effort; no dependency or deadline pressure, so it's sequenced after the higher-ratio items above.
>
> **Overall verdict**: only one item (audit logging) is constraint-driven; the rest are ordered by impact-per-effort, with onboarding automation and CI speed as the two highest-value near-term investments once the compliance deadline is met.

This example is illustrative — a real roadmap depends entirely on the actual candidate items, their impact/effort sizing, and organizational constraints.
