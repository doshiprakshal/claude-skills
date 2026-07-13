---
name: readme-generator
description: Generate or review a project README — what it does, how to get started, and how to contribute, tailored to whether the audience is external users, internal consumers, or contributors. Triggers on "generate a readme for this project", "write a getting started section for our readme", "review our readme for completeness", "our readme doesn't help new users get started, fix it".
user-invocable: true
---

# README Generator

Generate or review a project README, tailored to its actual intended audience (external users, internal consumers, or contributors).

## When to use

- Generating a new README, or reviewing an existing one for completeness/clarity.

**Out of scope**:
- API reference-style documentation → `api-documentation`
- General long-form technical documentation beyond a project's top-level README → `technical-documentation`

## Inputs

- The project (its purpose, how it's used, how to set it up).
- The intended audience — public open-source users, internal team consumers, or contributors (these have different needs).

## Workflow

### 1. Establish audience and purpose

Determine who actually reads this README and what they need from it — a public open-source project needs different framing (why should someone adopt this) than an internal service repo (how does my team use/deploy this) — tailor content accordingly rather than using one generic template.

### 2. Lead with what it does and why

A brief, clear statement of what the project does and the problem it solves, near the top — readers should be able to tell within seconds whether this is relevant to them.

### 3. Cover getting started concretely

Concrete, copy-pasteable setup/usage instructions — verified against actual current setup steps where possible, not just written from memory, since a stale getting-started section is a common source of new-user frustration.

### 4. Cover contribution guidance if applicable

For projects accepting contributions, cover how to contribute (development setup, testing, PR process) — omit this section entirely for projects that don't accept external contributions rather than including boilerplate that doesn't apply.

### 5. Report or generate

For a review: findings on Audience/Purpose Clarity, Getting Started Accuracy, Contribution Guidance (if applicable), each with severity. For generation: the drafted README matching the established audience and purpose.

## Notes

- Verify getting-started instructions actually work rather than trusting they're still accurate — commands, dependency versions, and setup steps drift out of date silently as a project evolves, and this is one of the most common and most frustrating README failures for new users.
- Tailor structure to actual audience — an internal-only service repo doesn't need a "why choose this project" pitch, and a public open-source project needs more of that framing than an internal one; don't apply a single template regardless of audience.
