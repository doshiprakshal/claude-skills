---
name: cloudtrail-investigation
description: Investigate CloudTrail logs for a specific event or incident — who made a specific API call, when, from where, and what changed as a result — systematic forensic reconstruction rather than a raw log dump. Triggers on "who deleted this resource", "investigate this cloudtrail event", "what changed this security group", "cloudtrail forensics".
user-invocable: true
---

# CloudTrail Investigation

Investigate CloudTrail logs to answer a specific forensic question — who did what, when, from where — reconstructing a clear timeline rather than dumping raw events. The AWS-audit-log equivalent of the `kubernetes` domain's Investigate skills.

## When to use

- Investigating who made a specific change (a deleted resource, a modified security group, an unexpected IAM change).
- Reconstructing the sequence of events around an incident.

**Out of scope**:
- Live drift detection (state vs. config, not a forensic "who/when" question) → `terraform/drift-analysis`
- Ongoing security monitoring/alerting setup → `cloudwatch-review`

## Inputs

- The specific resource/event in question, and an approximate time window.
- CloudTrail log access (Console/Athena query over CloudTrail logs, or CloudTrail Lake if configured).

## Workflow

### 1. Narrow the search

Start from the specific resource ARN or event name and a time window, rather than scanning all logs broadly — CloudTrail volume is typically too high for unscoped searching to be practical.

### 2. Reconstruct the timeline

For the relevant events found: exact timestamp, the calling principal (IAM user/role, and whether via console, CLI, SDK, or an AWS service), source IP, the exact API call and its parameters, and the request result (success/error).

### 3. Distinguish direct cause from context

Identify the specific event that directly caused the outcome in question, and separate it from surrounding context events (e.g., a role assumption immediately before the actual destructive call, useful for understanding *how* access was obtained, not just *that* it was used).

### 4. Report

1. **Timeline** — chronological, each entry with timestamp, principal, source IP, action, result.
2. **Direct cause** — the specific event(s) that caused the outcome, called out clearly.
3. **Open questions** — anything CloudTrail alone can't answer (e.g., *why* someone made a change) — flag for follow-up with the person/team involved rather than speculating.

## Notes

- CloudTrail records *what* happened, not *why* — don't speculate about intent; report the facts and flag intent as a question for the responsible person/team.
- Check whether the calling principal was a human (console/CLI with a named IAM user/role) or an automated process (a CI/CD role, a Lambda execution role) — this materially changes what "who did this" means and what the appropriate follow-up is.
