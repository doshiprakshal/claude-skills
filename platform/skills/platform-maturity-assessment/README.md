# Platform Maturity Assessment

Scores a platform's maturity against a defined stage model across capability dimensions, to identify the biggest gaps for roadmap prioritization.

See `SKILL.md` for the full workflow.

## How to invoke

- "Assess our platform maturity."
- "What stage is our platform at?"
- "Where are the biggest maturity gaps in our platform?"

## Example

### Input

Provisioning: templated, self-service with quotas (evidence: 90% of new services use it). Deployment: templated CI/CD golden path, self-service (evidence: 85% adoption). Cost visibility: a cost dashboard exists but is rarely checked; no team has cost allocated to their own budget, and no alerts exist for anomalous spend. Security: baseline policies exist but are inconsistently enforced (per earlier `multi-cluster-review` finding of config drift).

### Output (abbreviated)

> **Maturity scorecard** (Ad Hoc → Managed → Self-Service → Optimized)
>
> | Dimension | Stage | Evidence |
> |---|---|---|
> | Provisioning | Self-Service | 90% adoption of templated self-service flow |
> | Deployment | Self-Service | 85% adoption of golden-path CI/CD |
> | Security/Compliance | Managed | Baseline policies exist but inconsistently enforced (confirmed drift) |
> | Cost Visibility | Ad Hoc | Dashboard exists but unused; no cost ownership or alerting |
>
> **Profile shape**: strong in provisioning/deployment (both at Self-Service), notably weak in cost visibility (still Ad Hoc despite a dashboard existing) and only Managed (not yet consistently enforced) in security.
>
> **Prioritized next-stage target**: Cost Visibility is the lowest-scoring dimension and, given no team currently owns cost accountability, likely has compounding impact the longer it's deprioritized. To reach Managed: assign cost ownership per team/service and add anomaly alerting — the dashboard's existence isn't sufficient on its own since it's not actually being used.
>
> **Overall verdict**: don't let strong provisioning/deployment maturity create false confidence about overall platform maturity — the scorecard shape shows security enforcement and cost visibility are the real gaps to address next.

This example is illustrative — a real assessment depends entirely on the actual platform capabilities and evidence gathered.
