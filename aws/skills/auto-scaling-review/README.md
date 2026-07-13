# Auto Scaling Review

Reviews Auto Scaling Group configuration — scaling policies, health check settings, launch template hygiene, and multi-AZ distribution — for whether the group will actually scale correctly and stay healthy under real load.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our Auto Scaling Group."
- "Why isn't our ASG scaling?"
- "ASG health check review."

## Example

### Input

ASG uses `EC2` health checks (not `ELB`), sits behind an ALB target group, min=2/max=2/desired=2 (no room to scale at all), spans a single AZ/subnet. The app has a known failure mode where it hangs and stops responding to HTTP requests while the OS-level process is still running.

### Output (abbreviated)

> **Findings**
>
> - **`EC2` health checks won't catch application-level hangs** — `[High]` — the app's known failure mode (hung but still running) is invisible to `EC2` health checks, which only check instance status, not application responsiveness. Since the ASG sits behind an ALB target group, switch to `ELB` health checks so a hung instance that's failing target-group health checks actually gets replaced.
> - **min=max=2, no scaling headroom** — `[Medium]` — the ASG can never scale up regardless of load, since min and max are both fixed at 2. If traffic is expected to vary, raise `max` and add a scaling policy; if load is genuinely flat, this may be intentional — confirm.
> - **Single AZ** — `[High]` — the entire ASG is in one AZ/subnet. An AZ-level failure takes down all capacity simultaneously. Spread across at least 2 AZs.
>
> **Overall verdict**
> The health check type is the most directly actionable given the app's known hang failure mode — it's currently blind to the exact problem this ASG exists to protect against. Fix that first, then address AZ distribution.

This example is illustrative — a real review depends entirely on the actual ASG configuration discovered for the target group.
