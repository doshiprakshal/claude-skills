# AWS Well-Architected Review

Conducts a formal AWS Well-Architected Framework review across the six pillars, synthesizing findings from the other domain skills into the Framework's structure.

See `SKILL.md` for the full workflow.

## How to invoke

- "Run a Well-Architected Review."
- "WAF review on our workload."
- "How do we score against the Well-Architected Framework?"

## Example

### Input

A workload that has already had `disaster-recovery`, `cost-optimization`, and `iam-security` run against it, with findings available: single-region (no DR), no Savings Plan coverage, and one over-privileged IAM role.

### Output (abbreviated)

> **Reliability pillar**
> - **HRI**: No cross-region DR strategy — single-region architecture with an untested manual recovery runbook (from `disaster-recovery` findings). This is a High-Risk Issue under REL13 (define recovery objectives) and REL10 (deploy the workload to multiple locations).
>
> **Cost Optimization pillar**
> - **MRI**: No Savings Plan coverage on steady-state compute spend (from `cost-optimization` findings) — Medium-Risk under COST07 (use pricing models that reduce cost). Not an HRI since it's a cost-efficiency gap, not an operational risk.
>
> **Security pillar**
> - **HRI**: Over-privileged IAM role identified (`AdministratorAccess` attached to a service role that should be least-privilege) — High-Risk under SEC03 (manage identities and permissions).
>
> **Operational Excellence / Performance Efficiency / Sustainability pillars**
> Not yet assessed — recommend running `security-audit`-equivalent checks and a `performance-review` pass to complete the picture for these pillars.
>
> **Overall verdict**
> 2 High-Risk Issues identified so far (Reliability, Security) — both warrant remediation plans before this workload would pass a formal Well-Architected Review. Recommend completing the remaining three pillars' analysis before finalizing the review.

This example is illustrative — a real review depends entirely on the actual findings available and architecture discovered for the target workload.
