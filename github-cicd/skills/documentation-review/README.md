# Documentation Review

Reviews a repository's documentation for completeness and currency — whether it actually reflects the current codebase and gets a new contributor productive.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our repo documentation."
- "Is our README up to date?"
- "Would a new contributor be able to follow our setup docs?"

## Example

### Input

README's setup section says: `npm install && npm start`. The project's `package.json` was migrated to use `pnpm` six months ago, and `npm install` now fails due to a workspace configuration that only `pnpm` understands. A deploy runbook still describes a manual SSH-based deployment process, but the team migrated to a CI-based deploy pipeline three months ago.

### Output (abbreviated)

> **Findings**
>
> - **Setup instructions reference the wrong package manager** — `[High]` — README says `npm install && npm start`, but the project uses pnpm workspaces (per `package.json`/`pnpm-workspace.yaml`), and `npm install` will fail. Any new contributor following the README hits a wall immediately. Update to `pnpm install && pnpm start`.
> - **Deploy runbook describes a process that no longer exists** — `[Blocker]` — the documented manual SSH deploy process was replaced by a CI pipeline three months ago. If someone follows this runbook during an incident (when a deploy might be urgently needed), it won't work and could cost critical time. Update the runbook to reflect the actual current CI-based process.
>
> **Overall verdict**
> The deploy runbook staleness is the more serious finding — it's an operational document that could cause real harm if relied upon during an incident, not just an onboarding friction point. Fix both, prioritizing the runbook.

This example is illustrative — a real review depends entirely on the actual documentation and codebase state discovered for the target repository.
