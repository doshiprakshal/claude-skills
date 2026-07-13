# Communication Draft

Drafts an incident communication for a specific audience/channel not covered by the dedicated communication skills — e.g., a support-team briefing or stakeholder email.

See `SKILL.md` for the full workflow.

## How to invoke

- "Draft a briefing for the support team about this outage."
- "Write an internal notice about this incident for the platform team."
- "Write a stakeholder email about this incident."

## Example

### Input

Audience: customer support team, currently fielding tickets about failed checkouts. Incident: ongoing, root cause suspected (bad deploy) but not yet confirmed, mitigation (rollback) in progress.

### Output (abbreviated)

> **Support Team Briefing — Checkout Issue**
>
> **What's happening**: Some customers are experiencing failed checkout attempts. Our engineering team has identified a likely cause and is actively rolling out a fix.
>
> **What to tell customers**: "We're aware of an issue affecting some checkout attempts and are actively working on a fix. We apologize for the inconvenience — please try again in a few minutes." Offer to follow up if the issue persists for them after [time].
>
> **What NOT to say**: Don't confirm a specific technical cause yet (still being verified) or promise an exact resolution time. Don't say "this is fully resolved" until you see the "all clear" follow-up from this channel.
>
> **Escalation**: If a customer reports a related issue we haven't mentioned (e.g., a charge without a completed order), escalate to [team/channel] rather than troubleshooting directly.
>
> We'll send an update here as soon as we can confirm resolution.

This example is illustrative — a real draft depends entirely on the actual audience and incident status.
