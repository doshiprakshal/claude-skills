---
name: customer-summary
description: Write a customer-facing incident summary or status-page update — accurate about impact without over-disclosing internal technical/security detail, appropriately apologetic without legal overreach. Triggers on "write a customer-facing incident summary", "draft a status page update for this incident", "write the public postmortem for customers", "draft a customer notification about this outage".
user-invocable: true
---

# Customer Summary

Write a customer-facing incident summary or status-page update, balancing transparency about impact with appropriate discretion about internal technical/security detail.

## When to use

- A customer-facing communication about an incident is needed (status page, email notification, public postmortem).

**Out of scope**:
- Internal leadership summary → `executive-summary`
- Internal real-time incident-channel updates → `slack-summary`
- The full internal technical postmortem → `postmortem-generator`

## Inputs

- The incident's impact from the customer's perspective (what they experienced, when, for how long).
- The technical findings, to draw from for an appropriately-scoped cause statement.
- Any compliance/legal constraints on disclosure (e.g., security incidents may have specific disclosure requirements — flag rather than assume).

## Workflow

### 1. Frame from the customer's perspective

State what customers experienced (not what the internal system did) — "checkout was unavailable" not "the checkout-service pod entered a crash loop."

### 2. Scope the cause statement carefully

State cause at a level that's honest but doesn't over-disclose exploitable technical/security detail (e.g., "a software defect in a recent update" rather than naming the specific vulnerable code path or system) — if this is a security incident, flag explicitly that legal/security review should confirm disclosure scope before publishing, since disclosure requirements can be jurisdiction- and severity-specific.

### 3. Match tone to severity

Acknowledge impact appropriately without overpromising ("this will never happen again" is generally not defensible) or underplaying real impact — state concrete prevention steps instead of blanket reassurance.

### 4. Report

The drafted customer communication, plus an explicit flag if the content touches security/compliance-sensitive disclosure and should be legal-reviewed before publishing.

## Notes

- Always flag security-related incidents for legal/compliance review before this draft is treated as final — disclosure obligations and appropriate technical detail level are not purely an engineering-communication judgment call.
- Avoid absolute language ("guaranteed," "will never happen again") — favor concrete, falsifiable prevention commitments instead, which are both more credible and less legally risky.
