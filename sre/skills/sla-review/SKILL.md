---
name: sla-review
description: Review external SLA commitments against actual internal SLO/reliability capability — whether promised contractual terms are realistically achievable, and the gap between what's promised externally and what's tracked internally. Triggers on "review our sla commitments against our actual reliability", "can we actually meet the sla we promised this customer", "review the gap between our slas and internal slos", "assess our sla penalty exposure".
user-invocable: true
---

# SLA Review

Review external SLA commitments against actual internal reliability capability, identifying gaps between what's promised and what's achievable.

## When to use

- Assessing whether external SLA commitments are realistically achievable given actual reliability.
- Evaluating penalty/contractual exposure from SLA terms.

**Out of scope**:
- Internal SLO definition/adoption → `slo-review`
- Single-service SLI/target technical correctness → `observability/slo-review`

## Inputs

- External SLA commitments (target, measurement window, penalty terms) per customer/contract.
- Internal SLO/actual historical reliability data for the services those SLAs cover.

## Workflow

### 1. Map SLA terms to internal reliability data

For each SLA commitment, identify the corresponding internal service(s) and compare the promised target against actual historical performance — an SLA is only as safe as the internal capability backing it.

### 2. Identify achievability gaps

Flag any SLA where the promised target exceeds what internal SLOs/historical data show is realistically achievable — this is a direct business risk (penalty exposure, customer trust) independent of any single incident, and should be surfaced proactively rather than discovered after a breach.

### 3. Assess measurement alignment

Check whether the SLA's measurement methodology (what counts as downtime, what exclusions apply, what window) matches how internal SLOs are actually measured — a mismatch here means internal dashboards showing "healthy" could still correspond to an SLA breach if the external measurement is stricter or covers different scope.

### 4. Assess penalty exposure

For SLAs with financial penalty terms, quantify realistic exposure given the achievability gap identified — this turns an abstract reliability concern into a concrete business risk figure that can inform prioritization.

### 5. Report

A per-SLA achievability assessment (with the underlying internal data), measurement alignment findings, and penalty exposure estimate where applicable, prioritized by risk.

## Notes

- An SLA promised without checking it against actual internal reliability data is a common and risky gap — often SLAs are set by sales/business terms independent of engineering's actual measured capability; always cross-check rather than assuming alignment.
- Measurement methodology mismatches (what counts as downtime, exclusion windows) are a subtle but real risk — two organizations can have "the same" 99.9% target with very different practical meaning depending on measurement definition; always compare methodology, not just the headline percentage.
