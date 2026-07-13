# Reliability Roadmap

Sequences and prioritizes an SRE team's reliability investment roadmap from identified gaps — incident trends, toil, capacity, and availability findings.

See `SKILL.md` for the full workflow.

## How to invoke

- "Help us prioritize our reliability roadmap."
- "What should our SRE team work on next?"
- "Build a reliability roadmap from these findings."

## Example

### Input

Candidate items: (1) Automate the highest-cost toil category identified — high impact (frees ~7.5 hrs/quarter, per `toil-detection`), low effort. (2) Add redundancy to a service with a known single point of failure — high impact, high effort. (3) A planned 10-service portfolio expansion in 6 months with no corresponding team capacity increase planned.

### Output (abbreviated)

> **Roadmap**
>
> **Immediate**: automate the top toil category — highest impact-per-effort ratio available, and directly increases team capacity headroom ahead of the planned expansion.
>
> **Near-term (dependency-driven)**: prepare additional toil automation or capacity mitigation **before** the 10-service expansion in 6 months — sequenced ahead of its nominal timeline not because of raw impact/effort scoring alone, but because `capacity-planning` projects the team would be overloaded once the expansion lands without this groundwork. Treat the 6-month deadline as a hard constraint pulling this work forward.
>
> **Mid-term**: add redundancy to the single-point-of-failure service — high impact, but high effort with no urgent deadline forcing it earlier; sequenced after the capacity-related work above.
>
> **Overall verdict**: the portfolio expansion's fixed 6-month timeline is the key constraint shaping this roadmap — it pulls toil automation and capacity work forward ahead of the otherwise-comparable redundancy project, which is important but not time-boxed.

This example is illustrative — a real roadmap depends entirely on the actual candidate items and organizational constraints.
