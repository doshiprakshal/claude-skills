---
name: communication-draft
description: Draft the right incident communication for a specific audience and channel that doesn't fit the other dedicated communication skills — e.g., an internal all-hands notice, a specific stakeholder email, or a support-team briefing — by adapting tone/detail level to the audience. Triggers on "draft a communication for this incident to X audience", "write an internal notice about this incident", "draft a briefing for the support team about this outage", "write a stakeholder email about this incident".
user-invocable: true
---

# Communication Draft

Draft an incident communication for a specific audience/channel not covered by the dedicated communication skills, adapting tone, detail level, and framing to that audience.

## When to use

- An incident communication is needed for an audience other than leadership, customers, or the live incident channel (e.g., support team briefing, affected-team notice, specific stakeholder email).

**Out of scope**:
- Leadership-facing summary → `executive-summary`
- Customer-facing summary/status page → `customer-summary`
- Real-time incident-channel updates → `slack-summary`

## Inputs

- The target audience and their relationship to the incident (do they need to act, just be informed, or field questions from others).
- The incident's current status/findings.
- The channel/format (email, internal wiki notice, briefing doc).

## Workflow

### 1. Identify the audience's actual need

Determine what this audience needs to do or know — a support team fielding customer questions needs different content (talking points, what to tell customers, what not to speculate about) than an internal team just being notified their dependency was affected.

### 2. Calibrate detail and tone

Match technical depth to the audience (a support-team briefing needs plain language and clear guidance on what to say/not say to customers, not root-cause technical detail) and tone to the incident's severity (avoid both alarmism and understatement).

### 3. Include actionable guidance where relevant

If the audience needs to act or respond to others (e.g., support agents fielding tickets), give them the concrete lines/guidance to use, not just background information.

### 4. Report

The drafted communication, tailored to the stated audience and channel.

## Notes

- Always start by clarifying who the audience actually is and what they need from the communication (inform vs. equip-to-act) — using the wrong template (e.g., leadership-style brevity for a support team that needs talking points) produces a communication that technically covers the incident but doesn't serve its actual purpose.
- For audiences fielding external questions (support, sales), be explicit about what they should and shouldn't speculate about, especially for still-unconfirmed root cause or unresolved incidents.
