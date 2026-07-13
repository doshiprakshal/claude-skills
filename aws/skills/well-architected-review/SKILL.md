---
name: well-architected-review
description: Conduct a formal AWS Well-Architected Framework review across the six pillars (Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, Sustainability), synthesizing findings from the other domain skills into the framework's structure. Triggers on "run a well-architected review", "waf review on our workload", "how do we score against the well-architected framework", "well-architected pillar review".
user-invocable: true
---

# AWS Well-Architected Review

Conduct a structured review against the AWS Well-Architected Framework's six pillars, synthesizing and organizing findings (many of which overlap with other skills in this domain) into the Framework's specific structure and question set — useful when the deliverable specifically needs to be a Well-Architected-formatted review (e.g., for a WAR with AWS or an internal governance process).

## When to use

- Conducting a formal Well-Architected Review, or preparing for one with AWS.
- The user wants findings organized by WAF pillar specifically.

**Out of scope**:
- This skill organizes and synthesizes — for deep findings in a specific area, the other domain skills (`security-audit`, `cost-optimization`, `disaster-recovery`, `performance-review`, etc.) do the actual detailed analysis; this skill's job is structuring the overall review, not re-deriving every check from scratch.

## Inputs

- The workload's architecture and configuration across all relevant services.
- Findings from other skills already run, if available (reuse rather than re-deriving).

## Workflow

### 1. Map to pillars

For each of the six pillars, identify the relevant AWS Well-Architected questions and map findings to them:
- **Operational Excellence** — IaC usage, deployment automation, runbook coverage, observability.
- **Security** — IAM, network exposure, encryption, incident response readiness (draw on `iam-security`, `s3-security`, `security-audit`-equivalent findings).
- **Reliability** — Multi-AZ/region, backup/DR, auto-scaling, fault isolation (draw on `disaster-recovery`, `backup-strategy`, `auto-scaling-review`).
- **Performance Efficiency** — service/instance selection fit, caching, monitoring of performance metrics.
- **Cost Optimization** — commitment coverage, rightsizing, waste elimination (draw on `cost-optimization`).
- **Sustainability** — resource utilization efficiency, region selection considering carbon intensity where relevant, minimizing over-provisioning.

### 2. Score and prioritize

For each pillar, note High-Risk Issues (HRIs) and Medium-Risk Issues distinctly (matching AWS's own WAR terminology), so the output is directly usable in a formal review context.

### 3. Report

Per-pillar findings with HRI/MRI classification, cross-referencing the specific domain skill that can provide deeper analysis for follow-up on any given finding.

## Notes

- This is a synthesis/structuring skill — if deep findings aren't already available from other skills, recommend running the relevant specific skill first rather than doing a shallow pass across all six pillars from scratch.
- Use AWS's own HRI/MRI terminology so the output maps cleanly onto a real Well-Architected Tool review if the user is using it.
