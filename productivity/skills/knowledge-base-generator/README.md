# Knowledge Base Generator

Organizes scattered documentation into a structured, navigable knowledge base — inventory, duplication and gap detection, and a task-oriented information architecture.

See `SKILL.md` for the full workflow.

## How to invoke

- "Help us organize our scattered documentation into a knowledge base."
- "Consolidate our docs into a coherent knowledge base."
- "Identify gaps and duplication across our docs."

## Example

### Input

Documentation currently lives across a Confluence space (organized by team), a set of repo-level READMEs, and a Notion doc a former employee started. Deployment instructions for `checkout-service` exist in both Confluence and its README, and they disagree — Confluence still references a deployment tool that was replaced 4 months ago.

### Output (abbreviated)

> **Inventory**: three disconnected sources (Confluence by-team, repo READMEs, an orphaned Notion doc), no consistent cross-linking or single entry point.
>
> **Duplication flagged**: `[High]` — `checkout-service` deployment instructions exist in two places with conflicting content; the Confluence version is stale (references a deprecated tool), while the README appears current. This is worse than a gap — a reader consulting Confluence would be actively misled. Recommend immediately marking the Confluence version as deprecated/redirecting to the README, then deciding on one canonical source going forward.
>
> **Proposed information architecture**: reorganize around task-oriented categories ("Deploying a service," "Onboarding," "Incident Response") each linking to the single canonical source per topic, rather than the current team-based Confluence structure — team-based organization requires knowing which team owns something before you can find it, while task-based organization matches how people actually search when they have a specific need.
>
> **Consolidation plan**: (1) resolve the checkout-service conflict immediately, (2) audit remaining Confluence/README pairs for similar conflicts, (3) migrate the orphaned Notion content into the new structure or explicitly archive it if superseded.

This example is illustrative — a real consolidation plan depends entirely on the actual scattered documentation discovered.
