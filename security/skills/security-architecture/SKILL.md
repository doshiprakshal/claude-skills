---
name: security-architecture
description: Review overall security architecture maturity holistically — defense-in-depth layering, blast-radius containment, and where security investment is most needed across an already-built system or organization, distinct from a proactive per-feature threat model or any single control-area deep-dive. Triggers on "review our overall security architecture", "how mature is our security posture", "where should we invest in security next", "holistic security architecture review across our organization".
user-invocable: true
---

# Security Architecture

Review overall security architecture maturity holistically for an already-built system or organization — defense-in-depth layering and where investment is most needed, synthesizing across control areas rather than deep-diving any one.

## When to use

- A holistic, organization/system-wide security posture and maturity review is requested.
- The user asks where to invest next in security, without a specific control area already named.

**Out of scope**:
- Proactive, pre-launch threat modeling for a specific new system/feature → `threat-modeling`
- Deep-dive in any single control area → the relevant dedicated skill (`iam-audit`, `network-security`, `encryption-review`, `container-security`, `kubernetes-security`, `audit-logging-review`, `identity-review`, etc.)

## Inputs

- Findings from relevant control-area reviews if already available (to synthesize rather than re-derive from scratch).
- Overall system/organization architecture and its most sensitive assets.

## Workflow

### 1. Map defense-in-depth layers

Identify the layers of defense currently in place (perimeter, network segmentation, identity/access control, application-level controls, data-level encryption, detection/response) and assess whether they're genuinely independent layers or whether a single control failure would cascade through multiple "layers" that turn out to depend on the same underlying assumption.

### 2. Assess blast-radius containment

For the most sensitive assets, reason through what a realistic compromise starting point (a phished employee credential, a vulnerable public-facing service) could ultimately reach, given current layering — this synthesizes findings across identity, network, and encryption control areas into a single end-to-end assessment.

### 3. Identify the weakest layer

Defense-in-depth is only as strong as its weakest meaningfully-independent layer for a given attack path — identify which layer is currently weakest and would be the first to fail, since that's usually the highest-leverage investment.

### 4. Prioritize investment

Given the weakest-layer analysis and available control-area findings, recommend where security investment is most impactful next — informed by realistic attack paths and blast radius, not just a checklist of "how many controls exist."

### 5. Report

A defense-in-depth layer map, the weakest-layer finding, one or two concrete blast-radius scenarios illustrating current exposure, and prioritized investment recommendations, referencing the relevant control-area skills for implementation depth.

## Notes

- The highest-value output of this skill is usually the "weakest layer" identification and a concrete blast-radius scenario — these make abstract maturity assessments tangible and actionable in a way a generic checklist score doesn't.
- Two nominally distinct layers (e.g., "network segmentation" and "identity-based access control") sometimes turn out to rely on the same underlying assumption (e.g., both trusting the same identity provider with no additional verification) — watch for this false sense of depth explicitly.
