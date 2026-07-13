# Technical Documentation

Reviews or writes general technical documentation for clarity, structure, and audience fit.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review this technical documentation for clarity."
- "Help me write documentation for this system."
- "Is this doc written for the right audience?"

## Example

### Input

A doc titled "Deploying the Notification Service" is intended for new team members' first deployment. It opens with two paragraphs on the historical reasons the service was split from the monolith, then jumps into deployment commands assuming familiarity with the internal CLI tool's flags with no examples.

### Output (abbreviated)

> **Findings**
>
> - **Audience mismatch: leads with background theory instead of the task** — `[High]` — for a new-team-member, first-deployment doc, the historical context isn't what the reader needs first; it delays getting to the actual actionable content. Move the deployment steps to the top; historical context (if valuable at all) can be a brief aside or appendix.
> - **Assumes CLI flag familiarity with no examples** — `[High]` — a new team member is exactly the reader least likely to already know the internal CLI's flags. Add a concrete example command with each flag explained inline, rather than assuming prior familiarity.
> - **Structure**: otherwise reasonably organized once past the opening; no further structural issues found.
>
> **Overall verdict**: this doc is written more like an explanation of the system's history than a task-oriented onboarding guide — recommend restructuring to lead with the deployment task and add concrete command examples, given the stated new-team-member audience.

This example is illustrative — a real review depends entirely on the actual documentation content and intended audience.
