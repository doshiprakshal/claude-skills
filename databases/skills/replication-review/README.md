# Replication Review

Reviews database replication topology and health cross-engine — lag, topology fit, failover readiness, routing correctness, and split-brain protection.

See `SKILL.md` for the full workflow.

## How to invoke

- "Review our database replication setup."
- "Is our replication lag acceptable?"
- "Assess our database replication health."

## Example

### Input

Primary database has one replica, intended as a hot failover standby (not used for read scaling). Replication lag averages 30 seconds, occasionally spiking to 2 minutes under write-heavy load. Failover is manual (a documented runbook exists) and has never been executed, tested, or drilled. Application connections are hardcoded to the primary's address, with no separate replica connection path in use anywhere.

### Output (abbreviated)

> **Findings**
>
> - **30-second average lag is concerning for a hot-failover-standby replica** — `[High]` — for a replica whose stated purpose is failover readiness (not read scaling with stale-read tolerance), lag of this magnitude means a failover during a lag spike could lose up to 2 minutes of recent writes. Investigate the cause of lag (likely write volume or network bandwidth to the replica) and consider whether the replica's role should be reconsidered if lag can't be reduced.
> - **Failover has never been tested** — `[High]` — a documented runbook is not the same as a verified capability; the actual failover process (DNS/connection cutover, application reconnection behavior) is unverified. Recommend a scheduled failover drill in a controlled window.
> - **No replica connection path exists anywhere in the application** — `[Advisory]` — since this replica is intended purely as a failover standby (not for read scaling), this isn't a routing bug — but worth confirming this is the deliberate intent and not an unused opportunity for read-scaling benefit, given the replica already exists.
>
> **Overall verdict**: the untested failover process is the most urgent gap — this replica exists specifically for failover, and its actual readiness for that role is currently unverified. The lag issue should be investigated in parallel, since it directly affects how much data a real failover could lose.

This example is illustrative — a real review depends entirely on the actual replication topology and metrics discovered.
