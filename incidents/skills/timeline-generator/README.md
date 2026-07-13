# Timeline Generator

Builds a precise, chronological, source-attributed incident timeline from scattered evidence — alerts, deploys, chat logs, and metric inflection points.

See `SKILL.md` for the full workflow.

## How to invoke

- "Build a timeline for this incident."
- "Put together a chronological timeline of what happened."
- "Reconstruct the sequence of events for this outage."

## Example

### Input

Evidence: deploy log shows `checkout-service v42` deployed 15:00:03 UTC. PagerDuty alert "elevated 500s" fired 15:04:12 UTC. Slack #incidents channel: "investigating checkout errors" at 15:05 (local time, EST, incident channel timezone unclear). Grafana shows error rate begins climbing at 15:01:00 UTC. Slack: "rolling back to v41" at 15:12 EST. Deploy log shows rollback completed 15:14:47 UTC.

### Output (abbreviated)

> **Timeline (UTC)**
>
> | Time | Event | Source |
> |---|---|---|
> | 15:00:03 | `checkout-service v42` deployed | Deploy log |
> | 15:01:00 | Error rate begins climbing | Grafana metrics |
> | 15:04:12 | PagerDuty alert "elevated 500s" fires | PagerDuty |
> | 15:05:00 (converted from 15:05 EST) | "investigating checkout errors" posted | Slack #incidents |
> | 15:12:00 (converted from 15:12 EST) | "rolling back to v41" posted | Slack #incidents |
> | 15:14:47 | Rollback to v41 completed | Deploy log |
>
> **Note**: Slack timestamps were given in EST (UTC-5) in the source and converted to UTC here for consistency with the deploy log and metrics timestamps — verify the EST assumption against the actual channel/workspace timezone setting before finalizing.
> **Gap**: no evidence between 15:01:00 (error rate begins climbing) and 15:04:12 (alert fires) beyond the metric trend itself — no human action recorded in this window.

This example is illustrative — a real timeline depends entirely on the actual evidence gathered for the target incident.
