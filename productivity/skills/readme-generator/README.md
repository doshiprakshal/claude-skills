# README Generator

Generates or reviews a project README, tailored to its actual audience — external users, internal consumers, or contributors.

See `SKILL.md` for the full workflow.

## How to invoke

- "Generate a README for this project."
- "Review our README for completeness."
- "Our README doesn't help new users get started, fix it."

## Example

### Input

An internal service repo's README currently just says "This is the notifications service." No setup instructions, no explanation of what the service does or how other teams should interact with it. The audience is internal engineers who might need to run it locally or integrate with it.

### Output (abbreviated)

> **Findings**
>
> - **No explanation of purpose** — `[High]` — "This is the notifications service" doesn't tell a reader what it actually does, what triggers notifications, or which teams depend on it. Add a brief description covering purpose and key consumers.
> - **No getting-started section** — `[High]` — for an internal audience that may need to run this locally, there's currently no setup path at all. Add concrete, verified local setup instructions.
> - **No contribution guidance needed**: this is an internal-only service repo, not accepting external contributions — correctly omit a contribution section rather than adding generic boilerplate.
>
> **Generated draft**:
> ```markdown
> # Notifications Service
>
> Sends transactional notifications (email, SMS, push) triggered by events from order-service, account-service, and billing-service.
>
> ## Getting Started
> [concrete setup steps verified against current tooling]
>
> ## How Other Teams Integrate
> [brief note on the event contract other services should publish to trigger notifications]
> ```

This example is illustrative — a real README depends entirely on the actual project and its intended audience.
