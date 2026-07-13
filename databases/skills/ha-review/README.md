# HA Review

Reviews database high-availability architecture — single points of failure, failover automation and detection speed, and achievability against the stated availability target.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our database HA architecture."
- "Do we have a single point of failure in our database setup?"
- "Is our database availability target actually achievable?"

## Example

### Input

Stated target: 99.95% availability. Architecture: primary with one synchronous replica, automated failover via a managed service. Application connects using a hardcoded primary IP address rather than a DNS name or proxy endpoint that would automatically redirect after failover. Health check interval for failure detection is 60 seconds, requiring 3 consecutive failures before triggering failover (effectively ~3 minutes to detect).

### Output (abbreviated)

> **Single points of failure map**: database engine — redundant (replica + automated failover). Connection/discovery layer — `[Blocker]`: hardcoded primary IP means even a successful automated failover doesn't help, since the application keeps connecting to the old (now-failed) primary's address. This is the actual single point of failure, not the database engine itself.
>
> **Failover detection speed**: ~3 minutes to detect failure (60s interval × 3 consecutive failures) before failover even begins — this alone consumes a meaningful fraction of the error budget for a 99.95% target (~22 minutes/month allowed downtime).
>
> **Achievability verdict**: `[Not currently achievable as architected]` — even setting aside the hardcoded-IP issue, ~3 minutes of detection time per failover event is a large fraction of the monthly downtime budget for 99.95%; more than one failover event in a month would likely breach the target on detection time alone. The hardcoded IP issue means the actual achieved availability is currently far worse than this, since failover doesn't functionally restore service without a manual application-side intervention.
>
> **Recommendation**: fix the connection layer first (use a DNS name or proxy endpoint that updates on failover) — this is a prerequisite for the automated failover to have any effect at all. Separately, consider tightening health-check detection timing if the target must be met reliably.

This example is illustrative — a real review depends entirely on the actual architecture and target discovered.
